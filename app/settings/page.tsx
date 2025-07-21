"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/button"
import { Settings as SettingsIcon, XCircle } from "lucide-react"
import { toast } from "sonner"

// Simulated account and pages data
const AVAILABLE_PAGES = [
  "Dashboard",
  "Order Requests",
  "Analytics",
  "Products",
  "Settings",
]
type Account = {
  id: string
  name: string
  allowedPages: string[]
}

export default function SettingsPage() {
  // barcode→product mapping state
  const [barcode, setBarcode] = useState("")
  const [product, setProduct] = useState("")
  const [mappings, setMappings] = useState<{ barcode: string; product: string }[]>([])

  // accounts and page access state
  const [accounts, setAccounts] = useState<Account[]>([
    { id: "acc1", name: "Account A", allowedPages: ["Dashboard", "Products"] },
    { id: "acc2", name: "Account B", allowedPages: ["Order Requests"] },
  ])

  // add mapping
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!barcode || !product) return
    setMappings([{ barcode, product }, ...mappings])
    setBarcode("")
    setProduct("")
    toast.success("Mapping added!")
  }

  // remove mapping
  const handleRemove = (i: number) => {
    setMappings(mappings.filter((_, idx) => idx !== i))
    toast.success("Mapping removed")
  }

  // toggle page access for an account
  const togglePage = (accountId: string, page: string) => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id !== accountId) return acc
        const has = acc.allowedPages.includes(page)
        const newPages = has
          ? acc.allowedPages.filter((p) => p !== page)
          : [...acc.allowedPages, page]
        return { ...acc, allowedPages: newPages }
      })
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-10 max-w-4xl mx-auto py-8 px-4"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="rounded-lg bg-gray-700/90 text-white p-2 shadow-sm">
          <SettingsIcon size={22} />
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Settings
        </h2>
      </div>

      {/* Barcode→Product Form */}
      <form
        onSubmit={handleAdd}
        className="max-w-2xl mx-auto bg-muted/70 shadow-xl rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-end gap-6"
      >
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-sm font-semibold">Barcode</label>
          <input
            required
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            className="px-4 py-2 rounded-lg bg-background text-foreground border border-border"
            placeholder="Enter barcode"
          />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-sm font-semibold">Product</label>
          <input
            required
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="px-4 py-2 rounded-lg bg-background text-foreground border border-border"
            placeholder="Enter product"
          />
        </div>
        <Button type="submit" className="mt-2 md:mt-0">
          Add Mapping
        </Button>
      </form>

      {/* Mappings Table */}
      <div className="max-w-2xl mx-auto bg-muted/70 shadow-xl rounded-2xl p-6 md:p-8">
        <h3 className="text-lg font-bold mb-2 text-white">
          Barcode → Product Mappings
        </h3>
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full text-sm text-white">
            <thead>
              <tr className="border-b border-border">
                <th className="p-2 text-left font-semibold">Barcode</th>
                <th className="p-2 text-left font-semibold">Product</th>
                <th className="p-2"></th>
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

      {/* Accounts Section */}
      <div className="max-w-2xl mx-auto bg-muted/70 shadow-xl rounded-2xl p-6 md:p-8">
        <h3 className="text-lg font-bold mb-4 text-white">Accounts & Page Access</h3>
        <div className="space-y-6">
          {accounts.map((acc) => (
            <div key={acc.id} className="bg-background/70 p-4 rounded-lg">
              <h4 className="font-semibold text-white mb-2">
                {acc.name}
              </h4>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_PAGES.map((page) => {
                  const enabled = acc.allowedPages.includes(page)
                  return (
                    <button
                      key={page}
                      onClick={() => togglePage(acc.id, page)}
                      className={`px-3 py-1 rounded-full border transition text-sm whitespace-nowrap ${
                        enabled
                          ? "bg-emerald-400 border-emerald-500 text-gray-900"
                          : "bg-gray-800 border-gray-600 text-gray-400"
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
