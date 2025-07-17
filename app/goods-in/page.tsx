// app/goods-in/page.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Camera } from "lucide-react"
import { toast } from "sonner"

import { Card } from "@/components/Card"
import { MotionButton } from "@/components/button"
import { CameraBarcodeScanner } from "@/components/CameraBarcodeScanner"

type Product = {
  id: string
  barcode: string
  name: string
}

type GoodsInEntry = {
  id: string
  timestamp: string
  barcode: string
  name: string
  quantity: number
}

export default function GoodsInPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [entries, setEntries] = useState<GoodsInEntry[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [barcode, setBarcode] = useState("")
  const [quantity, setQuantity] = useState<number>(1)
  const [scannerOpen, setScannerOpen] = useState(false)
  const barcodeRef = useRef<HTMLInputElement>(null)

  // Load products and recent entries
  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then(setProducts)
      .catch(() => toast.error("Failed to load products"))

    fetch("/api/goods-in")
      .then((r) => r.json())
      .then(setEntries)
      .catch(() => toast.error("Failed to load goods in log"))
  }, [])

  const handleAdd = async () => {
    if (!barcode || !quantity) {
      return toast.error("Scan or enter a barcode and quantity")
    }
    const res = await fetch("/api/goods-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ barcode, quantity }),
    })
    if (!res.ok) {
      toast.error("Failed to register goods in")
    } else {
      const entry: GoodsInEntry = await res.json()
      setEntries((e) => [entry, ...e])
      toast.success("Goods in logged!")
      setBarcode("")
      setQuantity(1)
      barcodeRef.current?.focus()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-8"
    >
      {/* Form */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Goods In</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Barcode input + scanner */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Barcode</label>
            <div className="flex">
              <input
                ref={barcodeRef}
                type="text"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="Scan or type..."
                className="flex-1 rounded-l-lg border border-border px-3 py-2 bg-input text-sm"
              />
              <button
                type="button"
                onClick={() => setScannerOpen(true)}
                className="rounded-r-lg border border-border bg-muted px-3 flex items-center justify-center hover:bg-muted/80"
                title="Scan with camera"
              >
                <Camera size={18} />
              </button>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full rounded-lg border border-border px-3 py-2 bg-input text-sm"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <MotionButton
            onClick={handleAdd}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
          >
            Add Goods In
          </MotionButton>
        </div>
      </Card>

      {/* Recent Entries */}
      <Card>
        <h3 className="text-lg font-semibold mb-3">Recent Goods In</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Time", "Barcode", "Name", "Qty"].map((h) => (
                  <th key={h} className="p-2 text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id} className="border-b hover:bg-muted/50 transition">
                  <td className="p-2">
                    {new Date(e.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="p-2">{e.barcode}</td>
                  <td className="p-2">{e.name}</td>
                  <td className="p-2">{e.quantity}</td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-muted-foreground">
                    No goods in logged yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Barcode Scanner Modal */}
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
