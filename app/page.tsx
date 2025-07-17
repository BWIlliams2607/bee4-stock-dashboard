// app/page.tsx
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Package, Truck, ClipboardList } from "lucide-react"

import { QuickActions } from "@/components/QuickActions"
import { IncomingSummary } from "@/components/IncomingSummary"
import { DispatchedSummary } from "@/components/DispatchedSummary"

interface IncomingItem {
  id: string
  timestamp: string
  product: string
  qty: number
}

interface Dispatch {
  id: string
  timestamp: string
}

export default function DashboardPage() {
  const [stockOnHand, setStockOnHand] = useState<number | null>(null)
  const [incoming, setIncoming] = useState<IncomingItem[]>([])
  const [dispatched, setDispatched] = useState<Dispatch[]>([])

  // Fetch all data on mount
  useEffect(() => {
    // 1) Stock on hand
    fetch("/api/stock-summary")
      .then((r) => r.json())
      .then((data) => setStockOnHand(data.totalOnHand))
      .catch(() => setStockOnHand(0))

    // 2) Incoming shipments
    fetch("/api/incoming-stock")
      .then((r) => r.json())
      .then(setIncoming)
      .catch(() => setIncoming([]))

    // 3) Dispatches today
    fetch("/api/goods-out/today")
      .then((r) => r.json())
      .then(setDispatched)
      .catch(() => setDispatched([]))
  }, [])

  // Prepare the three top‐level summary cards
  const cards = [
    {
      title: "Stock On Hand",
      value: stockOnHand !== null ? stockOnHand : "…",
      icon: <Package size={28} className="text-blue-500" />,
    },
    {
      title: "Incoming Shipments",
      value: incoming.length,
      icon: <Truck size={28} className="text-yellow-500" />,
    },
    {
      title: "Dispatched Today",
      value: dispatched.length,
      icon: <ClipboardList size={28} className="text-rose-500" />,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-10 py-8 px-4 md:px-8"
    >
      {/* Page title */}
      <h2 className="text-3xl font-bold tracking-tight text-blue-400">
        Bee4 Stock Dashboard
      </h2>

      {/* Quick‑action buttons */}
      <QuickActions />

      {/* Top summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            className="bg-muted/70 shadow-xl rounded-2xl p-8 flex flex-col items-center justify-center"
          >
            {card.icon}
            <div className="mt-2 text-4xl font-bold">{card.value}</div>
            <div className="mt-2 text-md text-muted-foreground">{card.title}</div>
          </motion.div>
        ))}
      </div>

      {/* Detailed summaries in accordions */}
      <div className="space-y-6">
        <IncomingSummary
          details={incoming.map((i) => ({
            timestamp: i.timestamp,
            qty: i.qty,
          }))}
        />

        <DispatchedSummary
          details={dispatched.map((d) => ({
            timestamp: d.timestamp,
          }))}
        />
      </div>
    </motion.div>
  )
}
