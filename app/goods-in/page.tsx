// app/goods-in/page.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Camera as CameraIcon } from "lucide-react"
import { toast } from "sonner"

import { Card } from "@/components/Card"
import { MotionButton } from "@/components/button"
import { CameraBarcodeScanner } from "@/components/CameraBarcodeScanner"

type GoodsInEntry = {
  id: string
  timestamp: string
  barcode: string
  name: string
  quantity: number
}

export default function GoodsInPage() {
  const [entries, setEntries] = useState<GoodsInEntry[]>([])
  const [barcode, setBarcode] = useState("")
  const [quantity, setQuantity] = useState<number>(1)
  const [scannerOpen, setScannerOpen] = useState(false)
  const barcodeRef = useRef<HTMLInputElement>(null)

  // Load recent entries
  useEffect(() => {
    fetch("/api/goods-in")
      .then((r) => r.json())
      .then(setEntries)
      .catch(() => toast.error("Failed to load goods‑in log"))
  }, [])

  const handleAdd = async () => {
    if (!barcode || quantity < 1) {
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
      {/* === Goods In Form === */}
      <Card>
        <h2 className="text-2xl font-semibold mb-6">Goods In</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Barcode field */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Barcode
            </label>
            <div className="flex">
              <input
                ref={barcodeRef}
                type="text"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="Scan or type…"
                className="flex-1 h-12 rounded-l-lg border border-gray-600 bg-gray-700 px-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setScannerOpen(true)}
                className="h-12 w-12 rounded-r-lg border border-gray-600 bg-gray-700 flex items-center justify-center hover:bg-gray-600"
                title="Scan with camera"
              >
                <CameraIcon size={18} className="text-white" />
              </button>
            </div>
          </div>

          {/* Quantity field */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Quantity
            </label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full h-12 rounded-lg border border-gray-600 bg-gray-700 px-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <MotionButton
            onClick={handleAdd}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
          >
            Add Goods In
          </MotionButton>
        </div>
      </Card>

      {/* === Recent Goods In === */}
      <Card>
        <h3 className="text-xl font-semibold mb-4">Recent Goods In</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-white text-sm">
            <thead>
              <tr className="border-b border-gray-600">
                {["Time", "Barcode", "Name", "Qty"].map((h) => (
                  <th key={h} className="p-3 text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr
                  key={e.id}
                  className="border-b border-gray-700 hover:bg-gray-700 transition"
                >
                  <td className="p-3">
                    {new Date(e.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="p-3">{e.barcode}</td>
                  <td className="p-3">{e.name}</td>
                  <td className="p-3">{e.quantity}</td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="p-4 text-center text-gray-400"
                  >
                    No goods in logged yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* === Scanner Modal === */}
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
