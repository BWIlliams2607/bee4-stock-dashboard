// app/order-requests/page.tsx
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Check, Clock, FileText } from "lucide-react"
import { toast } from "sonner"
import { MotionButton } from "@/components/button"
import { Card } from "@/components/Card"

type Request = {
  id: string
  timestamp: string
  item: string
  category: string
  quantity: number
  priority: string
  location: string
  notes?: string
}

export default function OrderRequestsPage() {
  // form state
  const [item, setItem] = useState("")
  const [category, setCategory] = useState("")
  const [quantity, setQuantity] = useState<number | "">("")
  const [priority, setPriority] = useState("")
  const [location, setLocation] = useState("")
  const [notes, setNotes] = useState("")

  // logs
  const [requests, setRequests] = useState<Request[]>([])
  const [submitting, setSubmitting] = useState(false)

  // load existing
  useEffect(() => {
    fetch("/api/order-requests")
      .then((r) => r.json())
      .then(setRequests)
      .catch(() => toast.error("Failed to load request log"))
  }, [])

  const handleSubmit = async () => {
    if (!item || !category || !quantity || !priority || !location) {
      return toast.error("Please fill in all required fields")
    }
    setSubmitting(true)
    const timestamp = new Date().toISOString()
    const body = { timestamp, item, category, quantity, priority, location, notes }
    const res = await fetch("/api/order-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const err = await res.json()
      toast.error(`Email failed—request still logged: ${err.error}`)
    } else {
      const saved = await res.json()
      setRequests((r) => [{ id: saved.id, ...body }, ...r])
      toast.success("Order request sent and logged!")
      // reset
      setItem("")
      setCategory("")
      setQuantity("")
      setPriority("")
      setLocation("")
      setNotes("")
    }
    setSubmitting(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 max-w-5xl mx-auto py-8"
    >
      {/* header */}
      <header className="flex items-center space-x-2">
        <FileText className="w-6 h-6 text-emerald-400" />
        <h1 className="text-2xl font-bold text-white">Order Requests</h1>
      </header>

      {/* form */}
      <Card>
        <form className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-200">
              Item Description
            </label>
            <input
              type="text"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              placeholder="What do you need?"
              className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400"
              disabled={submitting}
            />

            <label className="block text-sm font-medium text-gray-200">
              Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Materials, Maintenance"
              className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400"
              disabled={submitting}
            />

            <label className="block text-sm font-medium text-gray-200">
              Quantity
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) =>
                setQuantity(e.target.value === "" ? "" : Number(e.target.value))
              }
              placeholder="e.g. 10"
              className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400"
              disabled={submitting}
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-200">
              Priority
            </label>
            <input
              type="text"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              placeholder="e.g. Low, Medium, High"
              className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400"
              disabled={submitting}
            />

            <label className="block text-sm font-medium text-gray-200">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Where should it go?"
              className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400"
              disabled={submitting}
            />

            <label className="block text-sm font-medium text-gray-200">
              Additional Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any extra details…"
              className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-sm text-white placeholder-gray-400 h-24 resize-none focus:ring-2 focus:ring-emerald-400"
              disabled={submitting}
            />
          </div>

          <div className="lg:col-span-2 flex justify-end">
            <MotionButton
              onClick={handleSubmit}
              disabled={submitting}
              whileHover={{ scale: submitting ? 1 : 1.02 }}
              whileTap={{ scale: submitting ? 1 : 0.98 }}
              className="bg-blue-600 disabled:opacity-50 text-white hover:bg-blue-700 flex items-center gap-2 px-6 py-3 rounded-lg"
            >
              {submitting ? (
                <Clock className="animate-spin w-5 h-5" />
              ) : (
                <Check className="w-5 h-5" />
              )}
              <span>{submitting ? "Submitting…" : "Submit Request"}</span>
            </MotionButton>
          </div>
        </form>
      </Card>

      {/* log */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Request Log</h2>
        <div className="overflow-x-auto bg-gray-800 p-4 rounded-2xl shadow-lg">
          <table className="min-w-full text-white text-sm">
            <thead>
              <tr className="border-b border-gray-600">
                {[
                  "Time",
                  "Item",
                  "Category",
                  "Qty",
                  "Priority",
                  "Location",
                  "Notes",
                ].map((h) => (
                  <th key={h} className="p-2 text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-gray-700 hover:bg-gray-700 transition"
                >
                  <td className="p-2">
                    {new Date(r.timestamp).toLocaleString(undefined, {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </td>
                  <td className="p-2">{r.item}</td>
                  <td className="p-2">{r.category}</td>
                  <td className="p-2">{r.quantity}</td>
                  <td className="p-2">{r.priority}</td>
                  <td className="p-2">{r.location}</td>
                  <td className="p-2">{r.notes || "—"}</td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="p-4 text-center text-gray-400"
                  >
                    No requests yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </motion.div>
  )
}
