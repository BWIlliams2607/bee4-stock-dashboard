"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/button"
import { ProductDropdown } from "@/components/ProductDropdown"
import { toast } from "sonner"
import { Truck } from "lucide-react"

export default function IncomingStockPage() {
  const [product, setProduct] = useState("")
  const [quantity, setQuantity] = useState("")
  const [supplier, setSupplier] = useState("")
  const [expected, setExpected] = useState("")
  const [log, setLog] = useState<any[]>([])
  const productRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!product || !quantity || !supplier || !expected) return

    const entry = {
      timestamp: new Date().toLocaleString(),
      product, quantity, supplier, expected,
    }
    setLog([entry, ...log])
    toast.success("Incoming stock logged!")

    setProduct("")
    setQuantity("")
    setSupplier("")
    setExpected("")
    productRef.current?.focus()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-12"
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="rounded-lg bg-yellow-500/90 text-white p-2 shadow-sm">
          <Truck size={22} />
        </span>
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
          Incoming Stock
        </h2>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        className="w-full bg-muted/70 shadow-xl rounded-2xl px-4 py-8 md:px-10 md:py-10 max-w-7xl mx-auto space-y-8"
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <ProductDropdown value={product} onChange={setProduct} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Quantity</label>
            <input
              required
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="px-4 py-2 rounded-lg bg-background text-foreground border border-border"
              placeholder="e.g. 500"
              ref={productRef}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Supplier</label>
            <input
              required
              type="text"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="px-4 py-2 rounded-lg bg-background text-foreground border border-border"
              placeholder="e.g. Avery"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Expected Arrival</label>
            <input
              required
              type="date"
              value={expected}
              onChange={(e) => setExpected(e.target.value)}
              className="px-4 py-2 rounded-lg bg-background text-foreground border border-border"
            />
          </div>
        </div>
        <Button type="submit" className="w-full md:w-auto mt-2 flex gap-2 items-center">
          Add Incoming
        </Button>
      </motion.form>

      <motion.div
        className="bg-muted/70 shadow-xl rounded-2xl p-6 md:p-8 max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold">Expected Arrivals</span>
          <span className="ml-1 mt-0.5 text-yellow-500">●</span>
        </div>
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="p-2 text-left font-semibold">Time</th>
                <th className="p-2 text-left font-semibold">Product</th>
                <th className="p-2 text-left font-semibold">Qty</th>
                <th className="p-2 text-left font-semibold">Supplier</th>
                <th className="p-2 text-left font-semibold">Expected</th>
              </tr>
            </thead>
            <AnimatePresence>
              <tbody>
                {log.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-3 text-center text-muted-foreground">
                      No incoming stock yet
                    </td>
                  </tr>
                ) : (
                  log.map((entry, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="border-b border-border hover:bg-background/80"
                    >
                      <td className="p-2">{entry.timestamp}</td>
                      <td className="p-2">{entry.product}</td>
                      <td className="p-2">{entry.quantity}</td>
                      <td className="p-2">{entry.supplier}</td>
                      <td className="p-2">{entry.expected}</td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </AnimatePresence>
          </table>
        </div>
      </motion.div>
    </motion.div>
  )
}
