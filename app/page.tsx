"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Package, Truck, ClipboardList } from "lucide-react"

type Incoming = {
  id: string
  timestamp: string
  barcode: string
  product: string
  qty: number
}

export default function DashboardPage() {
  const [stockOnHand, setStockOnHand] = useState<number | null>(null)
  const [incoming, setIncoming] = useState<Incoming[]>([])
  const [dispatchedToday, setDispatchedToday] = useState<number | null>(null)

  // Fetch dynamic data on mount
  useEffect(() => {
    fetch("/api/stock-summary")
      .then((r) => r.json())
      .then((data) => {
        setStockOnHand(data.totalOnHand)
      })
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
      className="space-y-10"
    >
      <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-8">
        Bee4 Stock Dashboard
      </h2>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            className="bg-muted/70 shadow-xl rounded-2xl p-8 flex flex-col items-center justify-center"
          >
            <div>{card.icon}</div>
            <div className="mt-2 text-4xl font-bold">{card.value}</div>
            <div className="mt-2 text-md text-muted-foreground">{card.title}</div>
          </motion.div>
        ))}
      </div>

      {/* Incoming Details Panel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-muted/70 p-6 rounded-2xl shadow-soft"
      >
        <div className="flex items-center mb-4 space-x-2">
          <Truck className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-semibold">Incoming Shipments Details</h3>
        </div>
        {incoming.length > 0 ? (
          <ul className="space-y-3">
            {incoming.slice(0, 5).map((i) => (
              <li
                key={i.id}
                className="flex justify-between items-center p-3 bg-background/50 rounded-lg"
              >
                <div className="space-y-1">
                  <div className="font-medium">{i.product}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(i.timestamp).toLocaleString(undefined, {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <div className="text-xl font-bold">×{i.qty}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            No incoming shipments at the moment.
          </p>
        )}
      </motion.div>
    </motion.div>
  )
}
