"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Check, Clock, FileText } from "lucide-react"
import { toast } from "sonner"
import { MotionButton } from "@/components/button"

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

  // log state
  const [requests, setRequests] = useState<Request[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // fetch existing logs
  useEffect(() => {
    reload()
  }, [])

  // helper to load the log
  async function reload() {
    try {
      const r = await fetch("/api/order-requests")
      if (!r.ok) throw new Error()
      const data: Request[] = await r.json()
      setRequests(data)
    } catch {
      toast.error("Failed to load request log")
    }
  }

  // handle form submission
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

    if (res.ok) {
      toast.success("Order request sent and logged!")
      // clear form
      setItem("")
      setCategory("")
      setQuantity("")
      setPriority("")
      setLocation("")
      setNotes("")
      // reload the log
      reload()
    } else {
      const err = await res.json()
      toast.error(`Email failed—request still logged: ${err.error}`)
    }
    setSubmitting(false)
  }

  // filter helper
  const filtered = requests.filter((r) =>
    [r.item, r.category, r.priority, r.location, r.notes || ""]
      .some((field) =>
        field.toLowerCase().includes(searchTerm.trim().toLowerCase())
      )
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 max-w-5xl mx-auto py-8"
    >
      {/* header */}
      <header className="flex items-center space-x-2">
        <FileText className="w-6 h-6 text-emerald-400" />
        <h1 className="text-2xl font-bold">Order Requests</h1>
      </header>

      {/* form */}
      <section className="bg-muted/70 p-6 rounded-2xl shadow-soft grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* left */}
        <div className="space-y-4">
          <label className="block text-sm font-medium">Item Description</label>
          <input
            type="text"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            placeholder="What do you need?"
            className="w-full rounded-lg border border-border bg-input px-4 py-2 text-sm"
            disabled={submitting}
          />
          <label className="block text-sm font-medium">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Materials, Maintenance"
            className="w-full rounded-lg border border-border bg-input px-4 py-2 text-sm"
            disabled={submitting}
          />
          <label className="block text-sm font-medium">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) =>
              setQuantity(e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder="e.g. 10"
            className="w-full rounded-lg border border-border bg-input px-4 py-2 text-sm"
            disabled={submitting}
          />
        </div>

        {/* right */}
        <div className="space-y-4">
          <label className="block text-sm font-medium">Priority</label>
          <input
            type="text"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            placeholder="e.g. Low, Medium, High"
            className="w-full rounded-lg border border-border bg-input px-4 py-2 text-sm"
            disabled={submitting}
          />
          <label className="block text-sm font-medium">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Where should it go?"
            className="w-full rounded-lg border border-border bg-input px-4 py-2 text-sm"
            disabled={submitting}
          />
          <label className="block text-sm font-medium">Additional Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any extra details…"
            className="w-full rounded-lg border border-border bg-input px-4 py-2 text-sm h-24 resize-none"
            disabled={submitting}
          />
        </div>

        {/* submit */}
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
      </section>

      {/* search */}
      <div className="flex justify-end">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search log…"
          className="w-64 rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400"
        />
      </div>

      {/* log */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-2">Request Log</h2>
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
              {filtered.map((r) => (
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
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-gray-400">
                    No matching requests
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
