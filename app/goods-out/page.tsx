"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/button"
import { ProductDropdown } from "@/components/ProductDropdown"
import { CameraBarcodeScanner } from "@/components/CameraBarcodeScanner"
import { toast } from "sonner"
import { CheckCircle, PackageMinus, Camera } from "lucide-react"

export default function GoodsOutPage() {
  const [barcode, setBarcode] = useState("")
  const [product, setProduct] = useState("")
  const [quantity, setQuantity] = useState("")
  const [location, setLocation] = useState("")
  const [shelf, setShelf] = useState("")
  const [log, setLog] = useState<any[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const [scannerOpen, setScannerOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!barcode || !product || !quantity || !location || !shelf) return

    const entry = {
      timestamp: new Date().toLocaleString(),
      barcode, product, quantity, location, shelf,
    }
    setLog([entry, ...log])
    toast.success("Stock removed successfully!")

    setBarcode("")
    setProduct("")
    setQuantity("")
    setLocation("")
    setShelf("")
    inputRef.current?.focus()
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-12">
      <div className="flex items-center gap-3 mb-2">
        <span className="rounded-lg bg-rose-600/90 text-white p-2 shadow-sm">
          <PackageMinus size={22} />
        </span>
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent">
          Goods Out
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
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Barcode</label>
            <div className="flex gap-2 items-center">
              <input
                required
                ref={inputRef}
                type="text"
                value={barcode}
                onChange={e => setBarcode(e.target.value)}
                className="px-4 py-2 rounded-lg bg-background text-foreground border border-border"
                placeholder="Type, paste, or scan barcode"
              />
              <button
                type="button"
                className="rounded-lg px-2 py-1 bg-muted hover:bg-muted/80 text-muted-foreground"
                onClick={() => setScannerOpen(true)}
                title="Scan with Camera"
              >
                <Camera size={20} />
              </button>
            </div>
            <span className="text-xs text-muted-foreground">
              Type, paste, scan with a device, or use the camera.
            </span>
          </div>
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
              placeholder="e.g. 25"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Location</label>
            <input
              required
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="px-4 py-2 rounded-lg bg-background text-foreground border border-border"
              placeholder="e.g. Warehouse 1"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Shelf</label>
            <input
              required
              type="text"
              value={shelf}
              onChange={(e) => setShelf(e.target.value)}
              className="px-4 py-2 rounded-lg bg-background text-foreground border border-border"
              placeholder="e.g. A1, B3"
            />
          </div>
        </div>
        <Button type="submit" className="w-full md:w-auto mt-2 flex gap-2 items-center">
          Remove Stock <CheckCircle size={20} />
        </Button>
      </motion.form>

      {scannerOpen && (
        <CameraBarcodeScanner
          onDetected={(code) => {
            setBarcode(code)
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
          <span className="text-xl font-bold">Recent Goods Out</span>
          <span className="ml-1 mt-0.5 text-rose-500">●</span>
        </div>
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="p-2 text-left font-semibold">Time</th>
                <th className="p-2 text-left font-semibold">Barcode</th>
                <th className="p-2 text-left font-semibold">Product</th>
                <th className="p-2 text-left font-semibold">Qty</th>
                <th className="p-2 text-left font-semibold">Location</th>
                <th className="p-2 text-left font-semibold">Shelf</th>
              </tr>
            </thead>
            <AnimatePresence>
              <tbody>
                {log.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-3 text-center text-muted-foreground">
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
                      <td className="p-2">{entry.product}</td>
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
