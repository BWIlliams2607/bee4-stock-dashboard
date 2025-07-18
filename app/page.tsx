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

  // fetch all three datasets on mount
  useEffect(() => {
    fetch("/api/stock-summary")
      .then((r) => r.json())
      .then((data) => setStockOnHand(data.totalOnHand))
      .catch(() => setStockOnHand(0))

    fetch("/api/incoming-stock")
      .then((r) => r.json())
      .then(setIncoming)
      .catch(() => setIncoming([]))

    fetch("/api/goods-out/today")
      .then((r) => r.json())
      .then(setDispatched)
      .catch(() => setDispatched([]))
  }, [])

  const cards = [
    {
      title: "Stock On Hand",
      value: stockOnHand !== null ? stockOnHand : "…",
      icon: <Package size={28} className="text-blue-400" />,
    },
    {
      title: "Incoming Shipments",
      value: incoming.length,
      icon: <Truck size={28} className="text-yellow-400" />,
    },
    {
      title: "Dispatched Today",
      value: dispatched.length,
      icon: <ClipboardList size={28} className="text-rose-400" />,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-10 py-8 px-4 md:px-8"
    >
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-blue-400">
        Bee4 Stock Dashboard
      </h1>

      {/* Quick‑action bar */}
      <QuickActions />

      {/* Top summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-gray-800/60 rounded-2xl p-6 flex flex-col items-center shadow-lg"
          >
            {card.icon}
            <div className="mt-2 text-4xl font-semibold text-white">
              {card.value}
            </div>
            <div className="mt-1 text-sm text-gray-300">{card.title}</div>
          </motion.div>
        ))}
      </div>

      {/* Detailed summaries */}
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/60 rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Pass as `details` prop */}
          <IncomingSummary
            details={incoming.map((i) => ({
              timestamp: i.timestamp,
              product: i.product,
              qty: i.qty,
            }))}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/60 rounded-2xl shadow-lg overflow-hidden"
        >
          <DispatchedSummary
            details={dispatched.map((d) => ({
              timestamp: d.timestamp,
            }))}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}
