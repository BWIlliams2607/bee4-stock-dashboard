"use client"

import { motion } from "framer-motion"
import { Package, Truck, ClipboardList } from "lucide-react"

const cards = [
  {
    title: "Stock On Hand",
    value: "440",
    icon: <Package size={28} className="text-blue-500" />,
  },
  {
    title: "Incoming Shipments",
    value: "3",
    icon: <Truck size={28} className="text-yellow-500" />,
  },
  {
    title: "Dispatched Today",
    value: "5",
    icon: <ClipboardList size={28} className="text-rose-500" />,
  },
]

export default function DashboardPage() {
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
    </motion.div>
  )
}
