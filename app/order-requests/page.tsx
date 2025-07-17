"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/button"
import { toast } from "sonner"

type OrderRequestLog = {
  timestamp: string
  item: string
  category: "Materials" | "Maintenance"
  quantity: string
  priority: "Low" | "Medium" | "High"
  location: string
  notes: string
}

export default function OrderRequestsPage() {
  const [item, setItem] = useState("")
  const [category, setCategory] = useState<OrderRequestLog["category"]>("Materials")
  const [quantity, setQuantity] = useState("")
  const [priority, setPriority] = useState<OrderRequestLog["priority"]>("Low")
  const [location, setLocation] = useState("")
  const [notes, setNotes] = useState("")
  const [log, setLog] = useState<OrderRequestLog[]>([])
  const itemInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!item || !quantity || !location) {
      toast.error("Please fill item, quantity, and location")
      return
    }
    const entry: OrderRequestLog = {
      timestamp: new Date().toLocaleString(),
      item,
      category,
      quantity,
      priority,
      location,
      notes,
    }
    setLog([entry, ...log])
    toast.success("Order request submitted!")
    // reset
    setItem("")
    setQuantity("")
    setLocation("")
    setNotes("")
    setCategory("Materials")
    setPriority("Low")
    itemInputRef.current?.focus()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-12"
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="rounded-lg bg-yellow-600/90 text-white p-2 shadow-sm">
          <CheckCircle size={22} />
        </span>
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
          Order Requests
        </h2>
      </div>

      {/* Request Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-muted/70 shadow-xl rounded-2xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Left Column */}
        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="text-sm font-semibold">Item Description</label>
            <input
              required
              ref={itemInputRef}
              value={item}
              onChange={(e) => setItem(e.target.value)}
              placeholder="E.g. Printer Toner, Safety Gloves"
              className="px-4 py-2 rounded-lg bg-background text-foreground border border-border"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as OrderRequestLog["category"])}
              className="px-4 py-2 rounded-lg bg-background text-foreground border border-border"
            >
              <option>Materials</option>
              <option>Maintenance</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold">Quantity</label>
            <input
              required
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
              className="px-4 py-2 rounded-lg bg-background text-foreground border border-border"
            />
          </div>
        </div>
        {/* Right Column */}
        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="text-sm font-semibold">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as OrderRequestLog["priority"])}
              className="px-4 py-2 rounded-lg bg-background text-foreground border border-border"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold">Location</label>
            <input
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Warehouse 1, Line A"
              className="px-4 py-2 rounded-lg bg-background text-foreground border border-border"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold">Additional Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any extra details..."
              className="px-4 py-2 rounded-lg bg-background text-foreground border border-border resize-none"
              rows={3}
            />
          </div>
        </div>

        <div className="md:col-span-2 flex justify-end">
          <Button type="submit" className="flex items-center gap-2">
            Submit Request <CheckCircle size={20} />
          </Button>
        </div>
      </form>

      {/* Request Log */}
      <div className="max-w-3xl mx-auto bg-muted/70 shadow-xl rounded-2xl p-6 md:p-8">
        <h3 className="text-lg font-bold mb-2">Request Log</h3>
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="p-2 text-left">Time</th>
                <th className="p-2 text-left">Item</th>
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-left">Qty</th>
                <th className="p-2 text-left">Priority</th>
                <th className="p-2 text-left">Location</th>
                <th className="p-2 text-left">Notes</th>
              </tr>
            </thead>
            <tbody>
              {log.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-3 text-center text-muted-foreground">
                    No requests yet
                  </td>
                </tr>
              ) : (
                log.map((row, i) => (
                  <tr key={i} className="border-b border-border hover:bg-background/80">
                    <td className="p-2">{row.timestamp}</td>
                    <td className="p-2">{row.item}</td>
                    <td className="p-2">{row.category}</td>
                    <td className="p-2">{row.quantity}</td>
                    <td className="p-2">{row.priority}</td>
                    <td className="p-2">{row.location}</td>
                    <td className="p-2">{row.notes}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}
