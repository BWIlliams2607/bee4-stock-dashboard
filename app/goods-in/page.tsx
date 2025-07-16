"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { Combobox } from "@headlessui/react"
import { CheckCircle, Camera, ChevronUpDown } from "lucide-react"
import { Button } from "@/components/button"
import { CameraBarcodeScanner } from "@/components/CameraBarcodeScanner"
import { toast } from "sonner"

type Product = {
  id: number
  barcode: string
  name: string
  description: string | null
}

type GoodsInLog = {
  id: number
  timestamp: string
  barcode: string
  name: string
  sku: string
  quantity: number
  location: string
  shelf: string
}

export default function GoodsInPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [query, setQuery] = useState("")              // for combobox filtering
  const [selected, setSelected] = useState<Product | null>(null)

  const [quantity, setQuantity] = useState("")
  const [location, setLocation] = useState("")
  const [shelf, setShelf] = useState("")

  const [log, setLog] = useState<GoodsInLog[]>([])
  const [searchLog, setSearchLog] = useState("")       // for log table filtering

  const [scannerOpen, setScannerOpen] = useState(false)
  const barcodeInputRef = useRef<HTMLInputElement>(null)

  // 1. Fetch products + logs
  useEffect(() => {
    Promise.all([
      fetch("/api/products").then(r => r.json()),
      fetch("/api/goods-in").then(r => r.json())
    ])
    .then(([prods, logs]: [Product[], GoodsInLog[]]) => {
      setProducts(prods)
      setLog(logs)
    })
    .catch(() => toast.error("Failed to load products or logs"))
  }, [])

  // 2. Filtered products for the Combobox
  const filtered =
    query === ""
      ? products
      : products.filter(p =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.barcode.includes(query)
        )

  // 3. Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selected || !quantity || !location || !shelf) {
      toast.error("Please fill all fields")
      return
    }
    const payload = {
      barcode: selected.barcode,
      name: selected.name,
      sku: selected.barcode, // or use selected.id
      quantity: parseInt(quantity, 10),
      location,
      shelf,
    }
    const res = await fetch("/api/goods-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (!res.ok) return toast.error("Failed to save entry")
    const saved: GoodsInLog = await res.json()
    setLog([saved, ...log])
    setQuantity(""); setLocation(""); setShelf("")
    toast.success("Goods added in!")
    barcodeInputRef.current?.focus()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <CheckCircle size={28} className="text-blue-500" />
        <h1 className="text-3xl font-bold">Goods In</h1>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid gap-6 bg-muted/70 p-6 rounded-2xl shadow-xl max-w-3xl mx-auto
                   grid-cols-1 md:grid-cols-3"
      >
        {/* COMBOBOX: Product */}
        <div className="col-span-1 md:col-span-3">
          <label className="block text-sm font-semibold mb-1">Product</label>
          <Combobox value={selected} onChange={setSelected}>
            <div className="relative">
              <Combobox.Input
                className="w-full rounded-lg border border-border bg-background px-4 py-2 pr-10"
                displayValue={(p: Product) => p?.name || ""}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by name or barcode…"
              />
              <Combobox.Button className="absolute inset-y-0 right-2 flex items-center">
                <ChevronUpDown size={20} />
              </Combobox.Button>
            </div>
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg bg-background py-1 text-sm shadow-lg">
              {filtered.map(p => (
                <Combobox.Option
                  key={p.id}
                  value={p}
                  className={({ active }) =>
                    `cursor-pointer px-4 py-2 ${active ? "bg-blue-500 text-white" : ""}`
                  }
                >
                  <span className="block font-medium">{p.name}</span>
                  <span className="block text-xs text-muted-foreground">{p.barcode}</span>
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </Combobox>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-semibold mb-1">Quantity</label>
          <input
            required
            type="number"
            min={1}
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            className="w-full rounded-lg border border-border px-4 py-2 bg-background"
            placeholder="e.g. 100"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold mb-1">Location</label>
          <input
            required
            value={location}
            onChange={e => setLocation(e.target.value)}
            className="w-full rounded-lg border border-border px-4 py-2 bg-background"
            placeholder="e.g. Warehouse 1"
          />
        </div>

        {/* Shelf */}
        <div>
          <label className="block text-sm font-semibold mb-1">Shelf</label>
          <input
            required
            value={shelf}
            onChange={e => setShelf(e.target.value)}
            className="w-full rounded-lg border border-border px-4 py-2 bg-background"
            placeholder="e.g. A1, B3"
          />
        </div>

        {/* Submit button spans all cols */}
        <div className="md:col-span-3">
          <Button className="w-full flex justify-center gap-2" type="submit">
            Add Stock <CheckCircle size={20} />
          </Button>
        </div>
      </form>

      {/* Scanner Modal */}
      {scannerOpen && (
        <CameraBarcodeScanner
          onDetected={code => {
            // find product by barcode
            const found = products.find(p => p.barcode === code)
            if (found) setSelected(found)
            else toast.error("Unknown barcode")
            setScannerOpen(false)
            barcodeInputRef.current?.focus()
          }}
          onClose={() => setScannerOpen(false)}
        />
      )}

      {/* Search Logs & Table */}
      <div className="max-w-3xl mx-auto space-y-4">
        <input
          type="text"
          placeholder="Search logs…"
          className="w-full rounded-lg border border-border px-4 py-2 bg-background text-sm"
          value={searchLog}
          onChange={e => setSearchLog(e.target.value)}
        />

        <div className="overflow-x-auto bg-muted/70 p-4 rounded-2xl shadow-xl">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Time","Product","Barcode","Qty","Location","Shelf"].map(h => (
                  <th key={h} className="p-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {log
                .filter(r =>
                  r.name.toLowerCase().includes(searchLog.toLowerCase()) ||
                  r.barcode.includes(searchLog) ||
                  r.location.toLowerCase().includes(searchLog.toLowerCase())
                )
                .map(r => (
                  <tr key={r.id} className="border-b border-border hover:bg-muted/50">
                    <td className="p-2">{new Date(r.timestamp).toLocaleString()}</td>
                    <td className="p-2">{r.name}</td>
                    <td className="p-2">{r.barcode}</td>
                    <td className="p-2">{r.quantity}</td>
                    <td className="p-2">{r.location}</td>
                    <td className="p-2">{r.shelf}</td>
                  </tr>
                ))
              }
              {log.length === 0 && (
                <tr><td colSpan={6} className="p-4 text-center text-muted-foreground">No logs yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}
