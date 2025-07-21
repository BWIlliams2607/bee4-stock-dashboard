"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { motion } from "framer-motion"
import { Camera as CameraIcon, Trash2, Download, Search as SearchIcon } from "lucide-react"
import { toast } from "sonner"

import { Card } from "@/components/Card"
import { MotionButton } from "@/components/button"
import { CameraBarcodeScanner } from "@/components/CameraBarcodeScanner"

type GoodsInEntry = {
  id: string
  timestamp: string
  barcode: string
  name: string
  sku: string
  quantity: number
  location: string
  shelf: string
}

export default function GoodsInPage() {
  const [entries, setEntries] = useState<GoodsInEntry[]>([])
  const [barcode, setBarcode] = useState("")
  const [name, setName] = useState("")
  const [sku, setSku] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [location, setLocation] = useState("")
  const [shelf, setShelf] = useState("")
  const [scannerOpen, setScannerOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const barcodeRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    try {
      const data = await fetch("/api/goods-in").then((r) => r.json())
      setEntries(data)
    } catch {
      toast.error("Failed to load goods-in log")
    }
  }

  const filtered = useMemo(() => {
    return entries
      .filter((e) =>
        [e.barcode, e.name, e.sku, e.location, e.shelf]
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [entries, searchTerm])

  const totals = useMemo(() => {
    const totalQty = entries.reduce((sum, e) => sum + e.quantity, 0)
    return { total: entries.length, totalQty }
  }, [entries])

  const handleAdd = async () => {
    if (!barcode || !name || quantity < 1) {
      return toast.error("Barcode, name and quantity are required")
    }
    try {
      const res = await fetch("/api/goods-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barcode, name, sku, quantity, location, shelf }),
      })
      if (!res.ok) throw new Error()
      const entry: GoodsInEntry = await res.json()
      setEntries((prev) => [entry, ...prev])
      toast.success("Goods in logged!")
      // reset fields
      setBarcode("")
      setName("")
      setSku("")
      setQuantity(1)
      setLocation("")
      setShelf("")
      barcodeRef.current?.focus()
    } catch {
      toast.error("Failed to register goods in")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this entry?")) return
    try {
      const res = await fetch(`/api/goods-in/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setEntries((prev) => prev.filter((e) => e.id !== id))
      toast.success("Entry deleted")
    } catch {
      toast.error("Delete failed")
    }
  }

  const exportCSV = () => {
    const rows = [
      ["Time", "Barcode", "Name", "SKU", "Qty", "Location", "Shelf"],
      ...entries.map((e) => [
        new Date(e.timestamp).toISOString(),
        e.barcode,
        e.name,
        e.sku,
        e.quantity,
        e.location,
        e.shelf,
      ]),
    ]
    const csv = rows.map((r) => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "goods_in.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-8">
      {/* Entry Form */}
      <Card>
        <h2 className="text-2xl font-semibold mb-4">Goods In</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Barcode + Scanner */}
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-200 mb-1">Barcode</label>
            <div className="flex">
              <input
                ref={barcodeRef}
                type="text"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="Scan or type…"
                className="flex-1 rounded-l-lg border bg-gray-800 px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => setScannerOpen(true)}
                className="h-10 w-10 rounded-r-lg border bg-gray-800 flex items-center justify-center hover:bg-gray-700"
                title="Scan"
              >
                <CameraIcon size={18} className="text-white" />
              </button>
            </div>
          </div>
          {/* Other Fields */}
          {[
            { label: "Name", value: name, setter: setName },
            { label: "SKU", value: sku, setter: setSku },
            { label: "Location", value: location, setter: setLocation },
            { label: "Shelf", value: shelf, setter: setShelf },
          ].map((field) => (
            <div key={field.label}>
              <label className="block text-sm font-medium text-gray-200 mb-1">{field.label}</label>
              <input
                type="text"
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
                placeholder={field.label}
                className="w-full rounded-lg border bg-gray-800 px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Quantity</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full rounded-lg border bg-gray-800 px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <MotionButton
            onClick={exportCSV}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="h-10 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
          >
            <Download size={16} /> Export CSV
          </MotionButton>
          <MotionButton
            onClick={handleAdd}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Add Goods In
          </MotionButton>
        </div>
      </Card>

      {/* Summary Totals */}
      <Card>
        <h3 className="text-xl font-semibold mb-4">Summary</h3>
        <div className="flex gap-8">
          <div>
            <div className="text-sm text-gray-400">Total Entries</div>
            <div className="text-lg font-semibold">{totals.total}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Total Quantity</div>
            <div className="text-lg font-semibold">{totals.totalQty}</div>
          </div>
        </div>
      </Card>

      {/* Recent Log */}
      <Card>
        <h3 className="text-xl font-semibold mb-4">Recent Goods In</h3>
        <div className="flex items-center justify-between mb-4">
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Filter table…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border bg-gray-800 px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
            />
            <SearchIcon size={16} className="absolute top-2 right-3 text-gray-400" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-white text-sm">
            <thead>
              <tr className="border-b border-gray-600">
                {["Time", "Barcode", "Name", "SKU", "Qty", "Location", "Shelf", "Actions"].map(
                  (h) => (
                    <th key={h} className="p-2 text-left">{h}</th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                  <td className="p-2">
                    {new Date(e.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="p-2">{e.barcode}</td>
                  <td className="p-2">{e.name}</td>
                  <td className="p-2">{e.sku}</td>
                  <td className="p-2">{e.quantity}</td>
                  <td className="p-2">{e.location}</td>
                  <td className="p-2">{e.shelf}</td>
                  <td className="p-2 flex gap-2">
                    <button onClick={() => handleDelete(e.id)} className="p-1 text-red-500 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-gray-400">
                    No entries match your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {scannerOpen && (
        <CameraBarcodeScanner
          onDetected={(code) => {
            setBarcode(code)
            setScannerOpen(false)
            barcodeRef.current?.focus()
          }}
          onClose={() => setScannerOpen(false)}
        />
      )}
    </motion.div>
  )
}
