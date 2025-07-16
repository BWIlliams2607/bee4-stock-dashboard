"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { defaultProducts } from "@/data/products"
import { CheckCircle, Camera } from "lucide-react"
import { Button } from "@/components/button"
import { CameraBarcodeScanner } from "@/components/CameraBarcodeScanner"
import { toast } from "sonner"

type GoodsInLog = {
  timestamp: string
  barcode: string
  name: string
  sku: string
  quantity: string
  location: string
  shelf: string
}

export default function GoodsInPage() {
  const [barcode, setBarcode] = useState("")
  const [name, setName] = useState("")
  const [sku, setSku] = useState("")
  const [quantity, setQuantity] = useState("")
  const [location, setLocation] = useState("")
  const [shelf, setShelf] = useState("")
  const [log, setLog] = useState<GoodsInLog[]>([])
  const [scannerOpen, setScannerOpen] = useState(false)
  const barcodeInputRef = useRef<HTMLInputElement>(null)

  // Autofill if barcode matches a known product
  useEffect(() => {
    const found = defaultProducts.find(p => p.barcode === barcode)
    if (found) {
      setName(found.name)
      setSku(found.sku)
    } else if (barcode) {
      setName("")
      setSku("")
    }
  }, [barcode])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!barcode || !name || !sku || !quantity || !location || !shelf) {
      toast.error("Please fill all fields")
      return
    }
    setLog([
      {
        timestamp: new Date().toLocaleString(),
        barcode,
        name,
        sku,
        quantity,
        location,
        shelf,
      },
      ...log,
    ])
    setBarcode("")
    setName("")
    setSku("")
    setQuantity("")
    setLocation("")
    setShelf("")
    toast.success("Goods added in!")
    barcodeInputRef.current?.focus()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-12"
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="rounded-lg bg-blue-600/80 text-white p-2 shadow-sm">
          <CheckCircle size={22} />
        </span>
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-400 to-blue-400 bg-clip-text text-transparent">
          Goods In
        </h2>
      </div>

      {/* Goods In Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-muted/70 shadow-xl rounded-2xl p-6 md:p-8 flex flex-col gap-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Barcode */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold">Barcode</label>
            <div className="flex items-center gap-2">
              <input
                required
                value={barcode}
                ref={barcodeInputRef}
                onChange={e => setBarcode(e.target.value)}
                className="px-4 py-2 rounded-lg bg-background text-foreground border border-border flex-1"
                placeholder="Scan or enter barcode"
              />
              <button
                type="button"
                className="flex items-center justify-center rounded-lg w-10 h-10 bg-muted hover:bg-blue-700/80 text-muted-foreground hover:text-white transition"
                onClick={() => setScannerOpen(true)}
                title="Scan barcode"
                tabIndex={-1}
              >
                <Camera size={22} />
              </button>
            </div>
          </div>
          {/* Name */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold">Product Name</label>
            <input
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="px-4 py-2 rounded-lg bg-background text-foreground border border-border"
              placeholder="Product name"
            />
          </div>
          {/* SKU */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold">SKU</label>
            <input
              required
              value={sku}
              onChange={e => setSku(e.target.value)}
              className="px-4 py-2 rounded-lg bg-background text-foreground border border-border"
              placeholder="SKU"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Quantity */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold">Quantity</label>
            <input
              required
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              className="px-4 py-2 rounded-lg bg-background text-foreground border border-border"
              placeholder="Quantity"
              type="number"
              min="1"
            />
          </div>
          {/* Location */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold">Location</label>
            <input
              required
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="px-4 py-2 rounded-lg bg-background text-foreground border border-border"
              placeholder="Location"
            />
          </div>
          {/* Shelf */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold">Shelf</label>
            <input
              required
              value={shelf}
              onChange={e => setShelf(e.target.value)}
              className="px-4 py-2 rounded-lg bg-background text-foreground border border-border"
              placeholder="Shelf"
            />
          </div>
        </div>
        <Button type="submit" className="mt-2 flex gap-2 items-center">
          Add In <CheckCircle size={20} />
        </Button>
      </form>

      {scannerOpen && (
        <CameraBarcodeScanner
          onDetected={code => {
            setBarcode(code)
            setScannerOpen(false)
            barcodeInputRef.current?.focus()
          }}
          onClose={() => setScannerOpen(false)}
        />
      )}

      {/* Log Table */}
      <div className="max-w-3xl mx-auto bg-muted/70 shadow-xl rounded-2xl p-6 md:p-8">
        <h3 className="text-lg font-bold mb-2">Goods In Log</h3>
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="p-2 text-left">Timestamp</th>
                <th className="p-2 text-left">Barcode</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">SKU</th>
                <th className="p-2 text-left">Quantity</th>
                <th className="p-2 text-left">Location</th>
                <th className="p-2 text-left">Shelf</th>
              </tr>
            </thead>
            <tbody>
              {log.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-3 text-center text-muted-foreground">
                    No records yet
                  </td>
                </tr>
              ) : (
                log.map((row, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="p-2">{row.timestamp}</td>
                    <td className="p-2">{row.barcode}</td>
                    <td className="p-2">{row.name}</td>
                    <td className="p-2">{row.sku}</td>
                    <td className="p-2">{row.quantity}</td>
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
