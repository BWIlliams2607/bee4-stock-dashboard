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
  const barcodeRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch("/api/goods-in")
      .then((r) => r.json())
      .then(setEntries)
      .catch(() => toast.error("Failed to load goods‑in log"))
  }, [])

  const handleAdd = async () => {
    if (!barcode || !name || quantity < 1) {
      return toast.error("Barcode, name and quantity are required")
    }
    const res = await fetch("/api/goods-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        barcode,
        name,
        sku,
        quantity,
        location,
        shelf,
      }),
    })
    if (!res.ok) {
      toast.error("Failed to register goods in")
    } else {
      const entry: GoodsInEntry = await res.json()
      setEntries((e) => [entry, ...e])
      toast.success("Goods in logged!")
      // reset
      setBarcode("")
      setName("")
      setSku("")
      setQuantity(1)
      setLocation("")
      setShelf("")
      barcodeRef.current?.focus()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-8"
    >
      <Card>
        <h2 className="text-2xl font-semibold mb-6">Goods In</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Barcode + Scanner */}
          <div className="md:col-span-3">
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
                className="flex-1 rounded-l-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => setScannerOpen(true)}
                className="h-10 w-10 rounded-r-lg border border-gray-600 bg-gray-700 flex items-center justify-center hover:bg-gray-600"
                title="Scan"
              >
                <CameraIcon className="text-white" size={18} />
              </button>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Item name"
              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* SKU */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              SKU
            </label>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="SKU"
              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Quantity
            </label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Shelf */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Shelf
            </label>
            <input
              type="text"
              value={shelf}
              onChange={(e) => setShelf(e.target.value)}
              placeholder="Shelf"
              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
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

      <Card>
        <h3 className="text-xl font-semibold mb-4">Recent Goods In</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-white text-sm">
            <thead>
              <tr className="border-b border-gray-600">
                {["Time", "Barcode", "Name", "SKU", "Qty", "Location", "Shelf"].map(
                  (h) => (
                    <th key={h} className="p-2 text-left">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr
                  key={e.id}
                  className="border-b border-gray-700 hover:bg-gray-700"
                >
                  <td className="p-2">
                    {new Date(e.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="p-2">{e.barcode}</td>
                  <td className="p-2">{e.name}</td>
                  <td className="p-2">{e.sku}</td>
                  <td className="p-2">{e.quantity}</td>
                  <td className="p-2">{e.location}</td>
                  <td className="p-2">{e.shelf}</td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-gray-400">
                    No goods in logged yet
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
