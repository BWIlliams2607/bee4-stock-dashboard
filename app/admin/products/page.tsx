"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { motion } from "framer-motion"
import { Combobox } from "@headlessui/react"
import { Camera as CameraIcon, ChevronsUpDown, CheckCircle, Trash2, Download, Search as SearchIcon } from "lucide-react"
import { toast } from "sonner"

import { Card } from "@/components/Card"
import { MotionButton } from "@/components/button"
import { CameraBarcodeScanner } from "@/components/CameraBarcodeScanner"

type Product = { id: number; barcode: string; name: string }

type IncomingStockLog = {
  id: number
  timestamp: string
  barcode: string
  name: string
  expectedDate: string
  quantity: number
  supplier: string
}

export default function IncomingStockPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [logs, setLogs] = useState<IncomingStockLog[]>([])

  // Form state
  const [selected, setSelected] = useState<Product | null>(null)
  const [query, setQuery] = useState("")
  const [expectedDate, setExpectedDate] = useState("")
  const [quantity, setQuantity] = useState<number>(1)
  const [supplier, setSupplier] = useState("")

  // Scanner
  const [scannerOpen, setScannerOpen] = useState(false)
  const comboRef = useRef<HTMLInputElement>(null)

  // Log search
  const [searchLog, setSearchLog] = useState("")

  // Load products & logs
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [ps, ls] = await Promise.all([
        fetch("/api/products").then((r) => r.json()),
        fetch("/api/incoming-stock").then((r) => r.json()),
      ])
      setProducts(ps)
      setLogs(ls)
    } catch {
      toast.error("Failed to load data")
    }
  }

  // Filter products for combobox
  const filteredProducts = useMemo(() => {
    if (!query) return products
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.barcode.includes(query)
    )
  }, [products, query])

  // Filtered & sorted logs
  const filteredLogs = useMemo(() => {
    return logs
      .filter(
        (r) =>
          r.name.toLowerCase().includes(searchLog.toLowerCase()) ||
          r.barcode.includes(searchLog) ||
          r.supplier.toLowerCase().includes(searchLog.toLowerCase())
      )
      .sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
  }, [logs, searchLog])

  // Summary totals
  const totals = useMemo(() => {
    const totalCount = logs.length
    const totalQty = logs.reduce((sum, r) => sum + r.quantity, 0)
    return { totalCount, totalQty }
  }, [logs])

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selected || !expectedDate || quantity < 1 || !supplier.trim()) {
      return toast.error("Please fill all fields")
    }
    try {
      const payload = { barcode: selected.barcode, name: selected.name, expectedDate, quantity, supplier }
      const res = await fetch("/api/incoming-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error()
      const saved: IncomingStockLog = await res.json()
      setLogs((prev) => [saved, ...prev])
      toast.success("Incoming stock logged!")
      setSelected(null)
      setQuery("")
      setExpectedDate("")
      setQuantity(1)
      setSupplier("")
      comboRef.current?.focus()
    } catch {
      toast.error("Failed to log incoming stock")
    }
  }

  // Delete log entry
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this log?")) return
    try {
      const res = await fetch(`/api/incoming-stock/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setLogs((prev) => prev.filter((r) => r.id !== id))
      toast.success("Log deleted")
    } catch {
      toast.error("Delete failed")
    }
  }

  // Export CSV
  const exportCSV = () => {
    const rows = [
      ["Time", "Name", "Barcode", "Expected", "Qty", "Supplier"],
      ...logs.map((r) => [
        new Date(r.timestamp).toISOString(),
        r.name,
        r.barcode,
        r.expectedDate,
        r.quantity.toString(),
        r.supplier,
      ]),
    ]
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\r\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "incoming_stock.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <CheckCircle size={28} className="text-purple-500" />
        <h1 className="text-3xl font-bold text-white">Incoming Stock</h1>
      </div>

      {/* Form */}
      <Card>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Product selector + scan */}
          <div className="md:col-span-4">
            <label className="block text-sm font-medium mb-1 text-gray-200">Product</label>
            <div className="relative">
              <button type="button" onClick={() => setScannerOpen(true)} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white" title="Scan barcode">
                <CameraIcon size={20} />
              </button>
              <Combobox value={selected} onChange={setSelected} nullable>
                <Combobox.Input
                  ref={comboRef}
                  className="w-full rounded-lg border border-gray-600 bg-gray-800 px-10 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                  displayValue={(p: Product) => p?.name || ""}
                  onChange={(e) => { setQuery(e.target.value); setSelected(null); }}
                  placeholder="Search by name or barcode…"
                />
                <Combobox.Button className="absolute inset-y-0 right-2 flex items-center">
                  <ChevronsUpDown size={20} className="text-gray-400 hover:text-white" />
                </Combobox.Button>
                {filteredProducts.length > 0 && (
                  <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-gray-800 py-1 shadow-lg text-sm scrollbar-thin scrollbar-thumb-purple-500">
                    {filteredProducts.map((p) => (
                      <Combobox.Option key={p.id} value={p} className={({ active }) => `cursor-pointer px-4 py-2 ${active ? 'bg-purple-600 text-white' : 'text-gray-200'}`}>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-gray-400">{p.barcode}</div>
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                )}
              </Combobox>
            </div>
          </div>

          {/* Expected Date */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-200">Expected Date</label>
            <input
              type="date"
              value={expectedDate}
              onChange={(e) => setExpectedDate(e.target.value)}
              className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-white focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-200">Quantity</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Supplier */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-200">Supplier</label>
            <input
              type="text"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              placeholder="e.g. Acme Co."
              className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Submit */}
          <div className="md:col-span-4">
            <MotionButton type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full bg-purple-600 text-white hover:bg-purple-700 px-6 py-2 rounded-lg flex justify-center gap-2">
              Log Incoming <CheckCircle size={20} />
            </MotionButton>
          </div>
        </form>
      </Card>

      {/* Scanner Modal */}
      {scannerOpen && (
        <CameraBarcodeScanner
          onDetected={(code) => {
            const prod = products.find((p) => p.barcode === code)
            if (prod) {
              setSelected(prod)
              setQuery(prod.name)
            } else {
              toast.error("Unknown barcode")
            }
            setScannerOpen(false)
            comboRef.current?.focus()
          }}
          onClose={() => setScannerOpen(false)}
        />
      )}

      {/* Summary Totals */}
      <Card>
        <h3 className="text-xl font-semibold mb-4">Summary</h3>
        <div className="flex gap-8 items-center">
          <div>
            <div className="text-sm text-gray-400">Total Logs</div>
            <div className="text-lg font-semibold">{totals.totalCount}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Total Incoming</div>
            <div className="text-lg font-semibold">{totals.totalQty}</div>
          </div>
          <MotionButton onClick={exportCSV} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="ml-auto bg-purple-600 px-4 py-2 rounded-lg text-white flex items-center gap-2 hover:bg-purple-700">
            <Download size={16} /> Export CSV
          </MotionButton>
        </div>
      </Card>

      {/* Search logs + Table */}
      <div className="space-y-4">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search logs…"
            value={searchLog}
            onChange={(e) => setSearchLog(e.target.value)}
            className="w-full rounded-lg border bg-gray-800 px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
          />
          <SearchIcon size={16} className="absolute top-2 right-3 text-gray-400" />
        </div>
        <div className="overflow-x-auto bg-gray-800 p-4 rounded-2xl shadow-lg">
          <table className="min-w-full text-white text-sm">
            <thead>
              <tr className="border-b border-gray-600">
                {[
                  "Time",
                  "Name",
                  "Barcode",
                  "Expected",
                  "Qty",
                  "Supplier",
                  "Actions",
                ].map((h) => (
                  <th key={h} className="p-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((r) => (
                <tr key={r.id} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                  <td className="p-2 text-left">{new Date(r.timestamp).toLocaleString()}</td>
                  <td className="p-2 text-left">{r.name}</td>
                  <td className="p-2 text-left">{r.barcode}</td>
                  <td className="p-2 text-left">{r.expectedDate}</td>
                  <td className="p-2 text-left">{r.quantity}</td>
                  <td className="p-2 text-left">{r.supplier}</td>
                  <td className="p-2 flex gap-2">
                    <button onClick={() => handleDelete(r.id)} className="p-1 text-red-500 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-gray-400">
                    No logs match your filter.
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
