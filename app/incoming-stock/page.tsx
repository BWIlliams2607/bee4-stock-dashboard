// app/incoming-stock/page.tsx
"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { defaultProducts } from "@/data/products"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/button"
import { CameraBarcodeScanner } from "@/components/CameraBarcodeScanner"
import { toast } from "sonner"

type IncomingStockLog = {
  timestamp: string
  barcode: string
  name: string
  sku: string
  expectedDate: string
  quantity: string
  supplier: string
}

export default function IncomingStockPage() {
  const [barcode, setBarcode] = useState("")
  const [name, setName] = useState("")
  const [sku, setSku] = useState("")
  const [expectedDate, setExpectedDate] = useState("")
  const [quantity, setQuantity] = useState("")
  const [supplier, setSupplier] = useState("")
  const [log, setLog] = useState<IncomingStockLog[]>([])
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
    if (!barcode || !name || !sku || !expectedDate || !quantity || !supplier) {
      toast.error("Please fill all fields")
      return
    }
    setLog([
      {
        timestamp: new Date().toLocaleString(),
        barcode,
        name,
        sku,
        expectedDate,
        quantity,
        supplier,
      },
      ...log,
    ])
    setBarcode("")
    setName("")
    setSku("")
    setExpectedDate("")
    setQuantity("")
    setSupplier("")
    toast.success("Incoming stock logged!")
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
        <span className="rounded-lg bg-purple-700/80 text-white p-2 shadow-sm">
          <CheckCircle size={22} />
        </span>
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-400 to-purple-400 bg-clip-text text-transparent">
          Incoming Stock
        </h2>
      </div>

      {/* Incoming Stock Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-muted/70 shadow-xl rounded-2xl p-6 md:p-8 flex flex-col gap-4"
      >
        {/* ... your three-column grid with date, quantity, supplier ... */}
        <Button type="submit" className="mt-2 flex gap-2 items-center">
          Log Incoming <CheckCircle size={20} />
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
        <h3 className="text-lg font-bold mb-2">Incoming Stock Log</h3>
        {/* ... same table structure as above ... */}
      </div>
    </motion.div>
  )
}
