// app/page.tsx
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Package, Truck, ClipboardList } from "lucide-react"

import { QuickActions } from "@/components/QuickActions"
import { Card } from "@/components/Card"

interface IncomingLog {
  id: string
  timestamp: string      // when logged
  expectedDate: string   // ISO
  product: string
  qty: number
  supplier: string
}

interface DispatchLog {
  id: string
  timestamp: string
  barcode: string
  name: string
}

export default function DashboardPage() {
  const [stockOnHand, setStockOnHand] = useState<number | null>(null)
  const [incoming, setIncoming] = useState<IncomingLog[]>([])
  const [dispatched, setDispatched] = useState<DispatchLog[]>([])

  useEffect(() => {
    // 1) Stock on hand
    fetch("/api/stock-summary")
      .then((r) => r.json())
      .then((data) => setStockOnHand(data.totalOnHand))
      .catch(() => setStockOnHand(0))

    // 2) Full incoming‐stock log
    fetch("/api/incoming-stock")
      .then((r) => r.json())
      .then(setIncoming)
      .catch(() => setIncoming([]))

    // 3) Goods‑out today
    fetch("/api/goods-out/today")
      .then((r) => r.json())
      .then(setDispatched)
      .catch(() => setDispatched([]))
  }, [])

  // sort incoming by expectedDate ascending
  const upcoming = incoming
    .sort((a, b) => new Date(a.expectedDate).getTime() - new Date(b.expectedDate).getTime())
    .slice(0, 5)

  // sort today's dispatches most recent
  const recentDispatch = dispatched
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5)

  const cards = [
    {
      title: "Stock On Hand",
      value: stockOnHand != null ? stockOnHand : "…",
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
      {/* Title & Quick Actions */}
      <h1 className="text-3xl font-bold text-blue-400">Bee4 Stock Dashboard</h1>
      <QuickActions />

      {/* Top Summary Cards */}
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
            <div className="mt-2 text-4xl font-semibold text-white">{card.value}</div>
            <div className="mt-1 text-sm text-gray-300">{card.title}</div>
          </motion.div>
        ))}
      </div>

      {/* Detailed Panels */}
      <div className="space-y-6">
        {/* Next 5 Incoming */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/60 rounded-2xl shadow-lg overflow-hidden"
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-yellow-300">Next Arrivals</h2>
            {upcoming.length > 0 ? (
              <ul className="space-y-3">
                {upcoming.map((i) => (
                  <li
                    key={i.id}
                    className="flex justify-between p-3 bg-gray-900 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-white">{i.product}</div>
                      <div className="text-sm text-gray-400">{i.supplier}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">
                        {new Date(i.expectedDate).toLocaleDateString()}
                      </div>
                      <div className="font-semibold text-yellow-200">{i.qty} pcs</div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="p-4 text-gray-400">No upcoming shipments</p>
            )}
          </Card>
        </motion.div>

        {/* Today's Dispatches */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/60 rounded-2xl shadow-lg overflow-hidden"
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-rose-300">Recent Dispatches</h2>
            {recentDispatch.length > 0 ? (
              <ul className="space-y-3">
                {recentDispatch.map((d) => (
                  <li
                    key={d.id}
                    className="flex justify-between p-3 bg-gray-900 rounded-lg"
                  >
                    <div className="text-white">{d.name || "Item"}</div>
                    <div className="text-gray-400 text-sm">
                      {new Date(d.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="p-4 text-gray-400">No dispatches today</p>
            )}
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
