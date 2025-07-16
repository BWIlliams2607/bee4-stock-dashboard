"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/button"
import { Settings as SettingsIcon, XCircle } from "lucide-react"
import { toast } from "sonner"

export default function SettingsPage() {
  const [barcode, setBarcode] = useState("")
  const [product, setProduct] = useState("")
  const [mappings, setMappings] = useState<{ barcode: string; product: string }[]>([])

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!barcode || !product) return
    setMappings([{ barcode, product }, ...mappings])
    setBarcode("")
    setProduct("")
    toast.success("Mapping added!")
  }

  const handleRemove = (i: number) => {
    setMappings(mappings.filter((_, idx) => idx !== i))
    toast.success("Mapping removed")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-10"
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="rounded-lg bg-gray-700/90 text-white p-2 shadow-sm">
          <SettingsIcon size={22} />
        </span>
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-400 to-purple-400 bg-clip-text text-transparent">
          Settings
        </h2>
      </div>

      <form
        onSubmit={handleAdd}
        className="max-w-2xl mx-auto bg-muted/70 shadow-xl rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-end gap-6"
      >
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-sm font-semibold">Barcode</label>
          <input
            required
            value={barcode}
            onChange={e => setBarcode(e.target.value)}
            className="px-4 py-2 rounded-lg bg-background text-foreground border border-border"
            placeholder="Enter barcode"
          />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-sm font-semibold">Product</label>
          <input
            required
            value={product}
            onChange={e => setProduct(e.target.value)}
            className="px-4 py-2 rounded-lg bg-background text-foreground border border-border"
            placeholder="Enter product"
          />
        </div>
        <Button type="submit" className="mt-2 md:mt-0">
          Add Mapping
        </Button>
      </form>

      <div className="max-w-2xl mx-auto bg-muted/70 shadow-xl rounded-2xl p-6 md:p-8">
        <h3 className="text-lg font-bold mb-2">Barcode → Product Mappings</h3>
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="p-2 text-left font-semibold">Barcode</th>
                <th className="p-2 text-left font-semibold">Product</th>
                <th className="p-2 text-left font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {mappings.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-3 text-center text-muted-foreground">
                    No mappings yet
                  </td>
                </tr>
              ) : (
                mappings.map((row, i) => (
                  <tr key={i} className="border-b border-border hover:bg-background/80">
                    <td className="p-2">{row.barcode}</td>
                    <td className="p-2">{row.product}</td>
                    <td className="p-2">
                      <button
                        onClick={() => handleRemove(i)}
                        className="text-rose-500 hover:text-rose-700"
                        title="Remove"
                      >
                        <XCircle size={18} />
                      </button>
                    </td>
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
