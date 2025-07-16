"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/button"
import { CameraBarcodeScanner } from "@/components/CameraBarcodeScanner"
import { toast } from "sonner"
import { CheckCircle, Package, Camera, Lock, Unlock } from "lucide-react"
import { defaultProducts, Product } from "@/data/products"

export default function GoodsInPage() {
  // Local "database"
  const [products, setProducts] = useState<Product[]>([...defaultProducts])
  const [barcode, setBarcode] = useState("")
  const [name, setName] = useState("")
  const [sku, setSku] = useState("")
  const [locked, setLocked] = useState(false)
  const [quantity, setQuantity] = useState("")
  const [location, setLocation] = useState("")
  const [shelf, setShelf] = useState("")
  const [log, setLog] = useState<any[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const [scannerOpen, setScannerOpen] = useState(false)

  // Lookup on barcode change
  const handleBarcodeChange = (value: string) => {
    setBarcode(value)
    const match = products.find(p => p.barcode === value)
    if (match) {
      setName(match.name)
      setSku(match.sku)
      setLocked(true)
    } else {
      setName("")
      setSku("")
      setLocked(false)
    }
  }

  const handleUnlock = () => setLocked(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!barcode || !name || !sku || !quantity || !location || !shelf) return

    // Log the Goods In event
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
    toast.success("Stock added successfully!")

    setBarcode("")
    setName("")
    setSku("")
    setQuantity("")
    setLocation("")
    setShelf("")
    setLocked(false)
    inputRef.current?.focus()
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-12">
      <div className="flex items-center gap-3 mb-2">
        <span className="rounded-lg bg-blue-600/90 text-white p-2 shadow-sm">
          <Package size={22} />
        </span>
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Goods In
        </h2>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        className="w-full bg-muted/70 shadow-xl rounded-2xl px-4 py-8 md:px-10 md:py-10 max-w-7xl mx-auto space-y-8"
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Barcode */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Barcode</label>
            <div className="flex gap-3 items-center w-full">
              <input
                required
                ref={inputRef}
                type="text"
                value={barcode}
                onChange={e => handleBarcodeChange(e.target.value)}
                className={`flex-1 px-5 py-3 rounded-xl bg-background text-foreground border border-border text-lg transition focus:ring-2 focus:ring-blue-500 ${locked ? "bg-muted/60 text-muted-foreground" : ""}`}
                placeholder="Type, paste, or scan barcode"
                readOnly={locked}
              />
              <button
                type="button"
                className="flex items-center justify-center rounded-xl w-12 h-12 bg-muted hover:bg-blue-700/80 text-muted-foreground hover:text-white transition text-xl"
                onClick={() => setScannerOpen(true)}
                title="Scan with Camera"
                tabIndex={-1}
              >
                <Camera size={26} />
              </button>
              {locked && (
                <button
                  type="button"
                  onClick={handleUnlock}
                  title="Unlock fields"
                  className="ml-2 p-2 rounded-lg bg-muted hover:bg-yellow-400/40 text-muted-foreground"
                >
                  <Unlock size={18} />
                </button>
              )}
            </div>
            <span className="text-xs text-muted-foreground mt-1">
              Type, paste, scan with a device, or use the camera.
            </span>
          </div>
          {/* Product Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Product Name</label>
            <input
              required
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className={`px-4 py-2 rounded-lg bg-background text-foreground border border-border ${locked ? "bg-muted/60 text-muted-foreground" : ""}`}
              placeholder="e.g. Vinyl Roll"
              readOnly={locked}
            />
          </div>
          {/* SKU */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">SKU</label>
            <input
              required
              type="text"
              value={sku}
              onChange={e => setSku(e.target.value)}
              className={`px-4 py-2 rounded-lg bg-background text-foreground border border-border ${locked ? "bg-muted/60 text-muted-foreground" : ""}`}
              placeholder="e.g. VR-001"
              readOnly={locked}
            />
          </div>
          {/* Quantity */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Quantity</label>
            <input
              required
              type="number"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              className="px-4 py-2 rounded-lg bg-background text-foreground border border-border"
              placeholder="e.g. 100"
            />
          </div>
          {/* Location */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Location</label>
            <input
              required
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="px-4 py-2 rounded-lg bg-background text-foreground border border-border"
              placeholder="e.g. Warehouse 1"
            />
          </div>
          {/* Shelf */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Shelf</label>
            <input
              required
              type="text"
              value={shelf}
              onChange={e => setShelf(e.target.value)}
              className="px-4 py-2 rounded-lg bg-background text-foreground border border-border"
              placeholder="e.g. A1, B3"
            />
          </div>
        </div>
        <Button type="submit" className="w-full md:w-auto mt-2 flex gap-2 items-center">
          Add Stock <CheckCircle size={20} />
        </Button>
      </motion.form>

      {scannerOpen && (
        <CameraBarcodeScanner
          onDetected={(code) => {
            handleBarcodeChange(code)
            setScannerOpen(false)
          }}
          onClose={() => setScannerOpen(false)}
        />
      )}

      <motion.div
        className="bg-muted/70 shadow-xl rounded-2xl p-6 md:p-8 max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold">Recent Goods In</span>
          <span className="ml-1 mt-0.5 text-blue-500">●</span>
        </div>
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="p-2 text-left font-semibold">Time</th>
                <th className="p-2 text-left font-semibold">Barcode</th>
                <th className="p-2 text-left font-semibold">Product</th>
                <th className="p-2 text-left font-semibold">SKU</th>
                <th className="p-2 text-left font-semibold">Qty</th>
                <th className="p-2 text-left font-semibold">Location</th>
                <th className="p-2 text-left font-semibold">Shelf</th>
              </tr>
            </thead>
            <AnimatePresence>
              <tbody>
                {log.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-3 text-center text-muted-foreground">
                      No logs yet
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
                      <td className="p-2">{entry.barcode}</td>
                      <td className="p-2">{entry.name}</td>
                      <td className="p-2">{entry.sku}</td>
                      <td className="p-2">{entry.quantity}</td>
                      <td className="p-2">{entry.location}</td>
                      <td className="p-2">{entry.shelf}</td>
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
