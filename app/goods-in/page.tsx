"use client"

import { useEffect, useState, useRef } from "react"
import { Combobox } from "@headlessui/react"
import { motion } from "framer-motion"
import { CheckCircle, Camera, ChevronsUpDown } from "lucide-react"
import { MotionButton } from "@/components/button"
import { CameraBarcodeScanner } from "@/components/CameraBarcodeScanner"
import { toast } from "sonner"

type Product = { id: number; barcode: string; name: string }
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
  const [logs, setLogs] = useState<GoodsInLog[]>([])
  const [selected, setSelected] = useState<Product | null>(null)
  const [query, setQuery] = useState("")
  const [quantity, setQuantity] = useState("")
  const [location, setLocation] = useState("")
  const [shelf, setShelf] = useState("")
  const [searchLog, setSearchLog] = useState("")
  const [scannerOpen, setScannerOpen] = useState(false)
  const comboRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/goods-in").then((r) => r.json()),
    ])
      .then(([ps, ls]) => {
        setProducts(ps)
        setLogs(ls)
      })
      .catch(() => toast.error("Failed to load data"))
  }, [])

  const filtered =
    query === ""
      ? products
      : products.filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.barcode.includes(query)
        )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selected || !quantity || !location || !shelf) {
      return toast.error("Please fill all fields")
    }
    const payload = {
      barcode: selected.barcode,
      name: selected.name,
      sku: selected.barcode,
      quantity: Number(quantity),
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
    setLogs([saved, ...logs])
    setQuantity("")
    setLocation("")
    setShelf("")
    toast.success("Goods added in!")
    comboRef.current?.focus()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-3">
        <CheckCircle size={28} className="text-blue-500" />
        <h1 className="text-3xl font-bold">Goods In</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid max-w-3xl mx-auto gap-6 bg-muted/70 p-6 rounded-2xl shadow-xl grid-cols-1 md:grid-cols-3"
      >
        <div className="col-span-1 md:col-span-3">
          <label className="block text-sm font-semibold mb-1">Product</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setScannerOpen(true)}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              title="Scan barcode"
            >
              <Camera size={20} />
            </button>
            <Combobox value={selected} onChange={setSelected}>
              <Combobox.Input
                ref={comboRef}
                className="w-full rounded-lg border border-border bg-background px-10 py-2 pr-10"
                displayValue={(p: Product) => p?.name || ""}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or barcode…"
              />
              <Combobox.Button className="absolute inset-y-0 right-2 flex items-center">
                <ChevronsUpDown size={20} />
              </Combobox.Button>
              {filtered.length > 0 && (
                <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg bg-background py-1 text-sm shadow-lg z-10">
                  {filtered.map((p) => (
                    <Combobox.Option
                      key={p.id}
                      value={p}
                      className={({ active }) =>
                        `cursor-pointer px-4 py-2 ${
                          active ? "bg-blue-500 text-white" : ""
                        }`
                      }
                    >
                      <span className="block font-medium">{p.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {p.barcode}
                      </span>
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              )}
            </Combobox>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Quantity</label>
          <input
            type="number"
            min={1}
            required
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full rounded-lg border border-border px-4 py-2 bg-background"
            placeholder="e.g. 100"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Location</label>
          <input
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-lg border border-border px-4 py-2 bg-background"
            placeholder="e.g. Warehouse 1"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Shelf</label>
          <input
            required
            value={shelf}
            onChange={(e) => setShelf(e.target.value)}
            className="w-full rounded-lg border border-border px-4 py-2 bg-background"
            placeholder="e.g. A1, B3"
          />
        </div>

        <div className="md:col-span-3">
          <MotionButton
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 flex justify-center gap-2"
          >
            Add Stock <CheckCircle size={20} />
          </MotionButton>
        </div>
      </form>

      {scannerOpen && (
        <CameraBarcodeScanner
          onDetected={(code) => {
            const prod = products.find((p) => p.barcode === code)
            if (prod) setSelected(prod)
            else toast.error("Unknown barcode")
            setScannerOpen(false)
            comboRef.current?.focus()
          }}
          onClose={() => setScannerOpen(false)}
        />
      )}

      <div className="max-w-3xl mx-auto space-y-4">
        <input
          type="text"
          value={searchLog}
          onChange={(e) => setSearchLog(e.target.value)}
          placeholder="Search logs…"
          className="w-full rounded-lg border border-border px-4 py-2 bg-background text-sm"
        />

        <div className="overflow-x-auto bg-muted/70 p-4 rounded-2xl shadow-xl">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Time", "Product", "Barcode", "Qty", "Location", "Shelf"].map(
                  (h) => (
                    <th key={h} className="p-2 text-left">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {logs
                .filter(
                  (r) =>
                    r.name
                      .toLowerCase()
                      .includes(searchLog.toLowerCase()) ||
                    r.barcode.includes(searchLog) ||
                    r.location
                      .toLowerCase()
                      .includes(searchLog.toLowerCase())
                )
                .map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-border hover:bg-muted/50"
                  >
                    <td className="p-2">
                      {new Date(r.timestamp).toLocaleString()}
                    </td>
                    <td className="p-2">{r.name}</td>
                    <td className="p-2">{r.barcode}</td>
                    <td className="p-2">{r.quantity}</td>
                    <td className="p-2">{r.location}</td>
                    <td className="p-2">{r.shelf}</td>
                  </tr>
                ))}
              {logs.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-4 text-center text-muted-foreground"
                  >
                    No logs yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}