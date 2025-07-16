"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { PackageSearch } from "lucide-react"

const demoStock = [
  { product: "Vinyl Roll", total: 200, location: "Warehouse 1", shelf: "A1" },
  { product: "Label Sheet", total: 150, location: "Warehouse 1", shelf: "A2" },
  { product: "PVC Board", total: 90, location: "Warehouse 2", shelf: "B1" },
]

export default function StockSummaryPage() {
  const [filter, setFilter] = useState("")

  const filtered = demoStock.filter(row =>
    row.product.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-10"
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="rounded-lg bg-cyan-600/90 text-white p-2 shadow-sm">
          <PackageSearch size={22} />
        </span>
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Stock Summary
        </h2>
      </div>

      <div className="max-w-3xl mx-auto bg-muted/70 shadow-xl rounded-2xl p-6 md:p-8">
        <input
          type="text"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="mb-4 px-4 py-2 rounded-lg bg-background text-foreground border border-border w-full"
          placeholder="Search products…"
        />
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="p-2 text-left font-semibold">Product</th>
                <th className="p-2 text-left font-semibold">Total</th>
                <th className="p-2 text-left font-semibold">Location</th>
                <th className="p-2 text-left font-semibold">Shelf</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-3 text-center text-muted-foreground">
                    No stock found
                  </td>
                </tr>
              ) : (
                filtered.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-border hover:bg-background/80"
                  >
                    <td className="p-2">{row.product}</td>
                    <td className="p-2">{row.total}</td>
                    <td className="p-2">{row.location}</td>
                    <td className="p-2">{row.shelf}</td>
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
