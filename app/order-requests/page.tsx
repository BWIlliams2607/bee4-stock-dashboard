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

  useEffect(() => {
    reload()
  }, [])

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
      setItem("")
      setCategory("")
      setQuantity("")
      setPriority("")
      setLocation("")
      setNotes("")
      reload()
    } else {
      const err = await res.json()
      toast.error(`Email failed—request still logged: ${err.error}`)
    }
    setSubmitting(false)
  }

  const filtered = requests.filter(r =>
    [r.item, r.category, r.priority, r.location, r.notes || ""]
      .some(field => field.toLowerCase().includes(searchTerm.trim().toLowerCase()))
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-10 max-w-6xl mx-auto py-10 px-4 md:px-0"
    >
      <header className="flex items-center space-x-3 text-white">
        <FileText className="w-7 h-7 text-emerald-400" />
        <h1 className="text-3xl font-extrabold">Order Requests</h1>
      </header>

      <section className="bg-gray-900 bg-opacity-70 p-8 rounded-3xl shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/** Labels and inputs have consistent spacing */}
          {[
            { label: "Item Description", value: item, setter: setItem, placeholder: "What do you need?" },
            { label: "Category", value: category, setter: setCategory, placeholder: "e.g. Materials, Maintenance" },
            { label: "Quantity", value: quantity, setter: (v) => setQuantity(v as any), placeholder: "e.g. 10", type: "number" },
          ].map((field, idx) => (
            <div key={idx} className="flex flex-col">
              <label className="text-sm font-medium text-gray-300 mb-1">
                {field.label}
              </label>
              <input
                type={field.type || "text"}
                value={field.value}
                onChange={e => field.setter(field.type === "number" && e.target.value ? Number(e.target.value) : e.target.value)}
                placeholder={field.placeholder}
                disabled={submitting}
                className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              />
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {[
            { label: "Priority", value: priority, setter: setPriority, placeholder: "e.g. Low, Medium, High" },
            { label: "Location", value: location, setter: setLocation, placeholder: "Where should it go?" },
          ].map((field, idx) => (
            <div key={idx} className="flex flex-col">
              <label className="text-sm font-medium text-gray-300 mb-1">
                {field.label}
              </label>
              <input
                type="text"
                value={field.value}
                onChange={e => field.setter(e.target.value)}
                placeholder={field.placeholder}
                disabled={submitting}
                className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              />
            </div>
          ))}
          <div className="flex flex-col col-span-1 md:col-span-2">
            <label className="text-sm font-medium text-gray-300 mb-1">
              Additional Notes
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any extra details…"
              disabled={submitting}
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 h-28 resize-none placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            />
          </div>

          <div className="col-span-1 md:col-span-2 flex justify-end">
            <MotionButton
              onClick={handleSubmit}
              disabled={submitting}
              whileHover={{ scale: submitting ? 1 : 1.03 }}
              whileTap={{ scale: submitting ? 1 : 0.97 }}
              className="bg-emerald-400 hover:bg-emerald-500 text-gray-900 font-semibold flex items-center gap-2 px-8 py-3 rounded-full shadow-lg transition"
            >
              {submitting ? (
                <Clock className="animate-spin w-5 h-5" />
              ) : (
                <Check className="w-5 h-5" />
              )}
              <span>{submitting ? "Submitting…" : "Submit Request"}</span>
            </MotionButton>
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search log…"
          className="w-64 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
        />
      </div>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Request Log</h2>
        <div className="overflow-x-auto bg-gray-900 p-6 rounded-3xl shadow-xl">
          <table className="min-w-full table-auto text-gray-100 text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                {["Time", "Item", "Category", "Qty", "Priority", "Location", "Notes"].map(h => (
                  <th key={h} className="p-3 text-left font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-b border-gray-800 hover:bg-gray-800 transition">
                  <td className="p-3">
                    {new Date(r.timestamp).toLocaleString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'})}
                  </td>
                  <td className="p-3">{r.item}</td>
                  <td className="p-3">{r.category}</td>
                  <td className="p-3">{r.quantity}</td>
                  <td className="p-3">{r.priority}</td>
                  <td className="p-3">{r.location}</td>
                  <td className="p-3">{r.notes || "—"}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-gray-500">
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