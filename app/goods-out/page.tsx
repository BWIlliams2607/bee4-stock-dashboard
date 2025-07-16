// app/goods-out/page.tsx
"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { defaultProducts } from "@/data/products"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/button"
import { CameraBarcodeScanner } from "@/components/CameraBarcodeScanner"
import { toast } from "sonner"

type GoodsOutLog = {
  timestamp: string
  barcode: string
  name: string
  sku: string
  quantity: string
  location: string
  shelf: string
}

export default function GoodsOutPage() {
  const [barcode, setBarcode] = useState("")
  const [name, setName] = useState("")
  const [sku, setSku] = useState("")
  const [quantity, setQuantity] = useState("")
  const [location, setLocation] = useState("")
  const [shelf, setShelf] = useState("")
  const [log, setLog] = useState<GoodsOutLog[]>([])
  const [scannerOpen, setScannerOpen] = useState(false)
  const barcodeInputRef = useRef<HTMLInputElement>(null)

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
    toast.success("Goods out recorded!")
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
        <span className="rounded-lg bg-rose-700/80 text-white p-2 shadow-sm">
          <CheckCircle size={22} />
        </span>
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-400 to-rose-400 bg-clip-text text-transparent">
          Goods Out
        </h2>
      </div>

      {/* Goods Out Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-muted/70 shadow-xl rounded-2xl p-6 md:p-8 flex flex-col gap-4"
      >
        {/* ... same grid structure as Goods In but button text */}
        <Button type="submit" className="mt-2 flex gap-2 items-center">
          Remove <CheckCircle size={20} />
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
        <h3 className="text-lg font-bold mb-2">Goods Out Log</h3>
        {/* ... same table structure as Goods In ... */}
      </div>
    </motion.div>
  )
}
