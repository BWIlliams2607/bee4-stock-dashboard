// app/page.tsx
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Package, Truck, ClipboardList } from "lucide-react"
import { IncomingSummary } from "@/components/IncomingSummary"

interface IncomingItem {
  id: string
  timestamp: string
  product: string
  qty: number
}

export default function DashboardPage() {
  const [stockOnHand, setStockOnHand] = useState<number | null>(null)
  const [incoming, setIncoming] = useState<IncomingItem[]>([])
  const [dispatchedToday, setDispatchedToday] = useState<number | null>(null)

  useEffect(() => {
    fetch("/api/stock-summary")
      .then((r) => r.json())
      .then((data) => setStockOnHand(data.totalOnHand))
      .catch(() => setStockOnHand(0))

    fetch("/api/incoming-stock")
      .then((r) => r.json())
      .then(setIncoming)
      .catch(() => setIncoming([]))

    fetch("/api/goods-out/today-count")
      .then((r) => r.json())
      .then((data) => setDispatchedToday(data.count))
      .catch(() => setDispatchedToday(0))
  }, [])

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
      value: dispatchedToday !== null ? dispatchedToday : "…",
      icon: <ClipboardList size={28} className="text-rose-500" />,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-10 py-8"
    >
      <h2 className="text-3xl font-bold tracking-tight text-blue-400 mb-8">
        Bee4 Stock Dashboard
      </h2>

      {/* Summary cards */}
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

      {/* Incoming Shipments summary & details */}
      <IncomingSummary
        details={incoming.map((i) => ({
          timestamp: i.timestamp,
          qty: i.qty,
        }))}
      />
    </motion.div>
  )
}
