// app/incoming-stock/page.tsx
"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { defaultProducts } from "@/data/products"
import { CheckCircle, Camera } from "lucide-react"
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
      {/* …rest of your JSX unchanged… */}
    </motion.div>
  )
}
