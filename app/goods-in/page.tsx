// app/goods-in/page.tsx
"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { defaultProducts } from "@/data/products"
import { CheckCircle, Camera } from "lucide-react"
import { Button } from "@/components/button"
import { CameraBarcodeScanner } from "@/components/CameraBarcodeScanner"
import { toast } from "sonner"

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
  const [barcode, setBarcode] = useState("")
  const [name, setName] = useState("")
  const [sku, setSku] = useState("")
  const [quantity, setQuantity] = useState("")
  const [location, setLocation] = useState("")
  const [shelf, setShelf] = useState("")
  const [log, setLog] = useState<GoodsInLog[]>([])
  const [scannerOpen, setScannerOpen] = useState(false)
  const barcodeInputRef = useRef<HTMLInputElement>(null)

  // Fetch existing logs on mount
  useEffect(() => {
    fetch("/api/goods-in")
      .then(res => {
        if (!res.ok) throw new Error("Failed to load")
        return res.json()
      })
      .then((data: GoodsInLog[]) => setLog(data))
      .catch(() => toast.error("Could not load Goods In log"))
  }, [])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!barcode || !name || !sku || !quantity || !location || !shelf) {
      toast.error("Please fill all fields")
      return
    }

    // POST to your API
    const payload = {
      barcode,
      name,
      sku,
      quantity: parseInt(quantity, 10),
      location,
      shelf,
    }

    const res = await fetch("/api/goods-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      toast.error("Failed to save entry")
      return
    }

    const saved: GoodsInLog = await res.json()
    setLog([saved, ...log])

    // reset form
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
        <CheckCircle size={28} className="text-blue-500" />
        <h1 className="text-3xl font-bold">Goods In</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-muted/70 shadow-xl rounded-2xl p-6 md:p-8
                   grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Barcode */}
        <div>
          <label className="block text-sm font-semibold mb-1">Barcode</label>
          <div className="relative">
            <input
              required
              ref={barcodeInputRef}
              value={barcode}
              onChange={e => setBarcode(e.target.value)}
              placeholder="Type, paste, or scan barcode"
              className="w-full rounded-lg border border-border px-4 py-2 pr-12 bg-background text-foreground"
            />
            <button
              type="button"
              onClick={() => setScannerOpen(true)}
              className="absolute inset-y-0 right-2 flex items-center justify-center p-2 text-muted-foreground hover:text-foreground"
              title="Scan barcode"
            >
              <Camera size={20} />
            </button>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Type, paste, scan with a device, or use the camera.
          </p>
        </div>

        {/* Product Name */}
        <div>
          <label className="block text-sm font-semibold mb-1">Product Name</label>
          <input
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Vinyl Roll"
            className="w-full rounded-lg border border-border px-4 py-2 bg-background text-foreground"
          />
        </div>

        {/* SKU */}
        <div>
          <label className="block text-sm font-semibold mb-1">SKU</label>
          <input
            required
            value={sku}
            onChange={e => setSku(e.target.value)}
            placeholder="e.g. VR-001"
            className="w-full rounded-lg border border-border px-4 py-2 bg-background text-foreground"
          />
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
            placeholder="e.g. 100"
            className="w-full rounded-lg border border-border px-4 py-2 bg-background text-foreground"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold mb-1">Location</label>
          <input
            required
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="e.g. Warehouse 1"
            className="w-full rounded-lg border border-border px-4 py-2 bg-background text-foreground"
          />
        </div>

        {/* Shelf */}
        <div>
          <label className="block text-sm font-semibold mb-1">Shelf</label>
          <input
            required
            value={shelf}
            onChange={e => setShelf(e.target.value)}
            placeholder="e.g. A1, B3"
            className="w-full rounded-lg border border-border px-4 py-2 bg-background text-foreground"
          />
        </div>

        {/* Submit */}
        <div className="md:col-span-3">
          <Button type="submit" className="w-full flex justify-center gap-2">
            Add Stock <CheckCircle size={20} />
          </Button>
        </div>
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
      <div className="max-w-3xl mx-auto">
        <h2 className="text-lg font-bold mb-2">Recent Goods In</h2>
        <div className="overflow-x-auto rounded-lg bg-muted/70 shadow-xl p-4">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Time", "Barcode", "Product", "SKU", "Qty", "Location", "Shelf"].map(h => (
                  <th key={h} className="p-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {log.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-muted-foreground">
                    No logs yet
                  </td>
                </tr>
              ) : (
                log.map((r, i) => (
                  <tr key={r.id} className="border-b border-border">
                    <td className="p-2">{new Date(r.timestamp).toLocaleString()}</td>
                    <td className="p-2">{r.barcode}</td>
                    <td className="p-2">{r.name}</td>
                    <td className="p-2">{r.sku}</td>
                    <td className="p-2">{r.quantity}</td>
                    <td className="p-2">{r.location}</td>
                    <td className="p-2">{r.shelf}</td>
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
