"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { defaultProducts, Product } from "@/data/products"
import { Settings, XCircle, CheckCircle, Camera } from "lucide-react"
import { Button } from "@/components/button"
import { CameraBarcodeScanner } from "@/components/CameraBarcodeScanner"
import { toast } from "sonner"

type LogEntry = {
  time: string
  barcode: string
  name: string
  sku: string
  action?: "ADDED" | "REMOVED"
}

export default function ProductAdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [barcode, setBarcode] = useState("")
  const [name, setName] = useState("")
  const [sku, setSku] = useState("")
  const [log, setLog] = useState<LogEntry[]>([])
  const [scannerOpen, setScannerOpen] = useState(false)
  const barcodeInputRef = useRef<HTMLInputElement>(null)

  // Load products from localStorage, or use defaults
  useEffect(() => {
    const stored = localStorage.getItem("bee4-products")
    if (stored) {
      setProducts(JSON.parse(stored))
    } else {
      setProducts([...defaultProducts])
    }
  }, [])

  // Save products to localStorage whenever they change
  useEffect(() => {
    if (products.length) {
      localStorage.setItem("bee4-products", JSON.stringify(products))
    }
  }, [products])

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!barcode || !name || !sku) return
    if (products.some(p => p.barcode === barcode)) {
      toast.error("Barcode already exists")
      return
    }
    const newProduct: Product = { barcode, name, sku }
    setProducts([newProduct, ...products])
    setLog([
      { time: new Date().toLocaleString(), barcode, name, sku, action: "ADDED" },
      ...log,
    ])
    setBarcode("")
    setName("")
    setSku("")
    toast.success("Product added!")
    barcodeInputRef.current?.focus()
  }

  const handleRemove = (idx: number) => {
    const removed = products[idx]
    setProducts(products.filter((_, i) => i !== idx))
    setLog([
      { time: new Date().toLocaleString(), barcode: removed.barcode, name: removed.name, sku: removed.sku, action: "REMOVED" },
      ...log,
    ])
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-12"
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="rounded-lg bg-gray-700/90 text-white p-2 shadow-sm">
          <Settings size={22} />
        </span>
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-400 to-purple-400 bg-clip-text text-transparent">
          Product Admin
        </h2>
      </div>

      {/* Add Product Form */}
      <form
        onSubmit={handleAdd}
        className="max-w-2xl mx-auto bg-muted/70 shadow-xl rounded-2xl p-6 md:p-8 flex flex-col gap-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Barcode with camera */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold">Barcode</label>
            <div className="flex items-center gap-2">
              <input
                required
                value={barcode}
                ref={barcodeInputRef}
                onChange={e => setBarcode(e.target.value)}
                className="px-4 py-2 rounded-lg bg-background text-foreground border border-border flex-1"
                placeholder="Enter or scan barcode"
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
            <span className="text-xs text-muted-foreground mt-1">
              Type, paste, scan with a device, or use the camera.
            </span>
          </div>
          {/* Product Name */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold">Product Name</label>
            <input
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="px-4 py-2 rounded-lg bg-background text-foreground border border-border"
              placeholder="Enter name"
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
              placeholder="Enter SKU"
            />
          </div>
        </div>
        <Button type="submit" className="mt-2 flex gap-2 items-center">
          Add Product <CheckCircle size={20} />
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

      {/* Product List */}
      <div className="max-w-2xl mx-auto bg-muted/70 shadow-xl rounded-2xl p-6 md:p-8">
        <h3 className="text-lg font-bold mb-2">Products</h3>
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="p-2 text-left font-semibold">Barcode</th>
                <th className="p-2 text-left font-semibold">Name</th>
                <th className="p-2 text-left font-semibold">SKU</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-3 text-center text-muted-foreground">
                    No products yet
                  </td>
                </tr>
              ) : (
                products.map((row, i) => (
                  <tr key={i} className="border-b border-border hover:bg-background/80">
                    <td className="p-2">{row.barcode}</td>
                    <td className="p-2">{row.name}</td>
                    <td className="p-2">{row.sku}</td>
                    <td className="p-2">
                      <button
                        onClick={() => handleRemove(i)}
                        className="text-rose-500 hover:text-rose-700"
                        title="Remove"
                      >
                        <XCircle size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Change Log */}
      <div className="max-w-2xl mx-auto bg-muted/70 shadow-xl rounded-2xl p-6 md:p-8">
        <h3 className="text-lg font-bold mb-2">Product Admin Log</h3>
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="p-2 text-left">Time</th>
                <th className="p-2 text-left">Barcode</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">SKU</th>
                <th className="p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {log.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-3 text-center text-muted-foreground">
                    No changes yet
                  </td>
                </tr>
              ) : (
                log.map((row, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="p-2">{row.time}</td>
                    <td className="p-2">{row.barcode}</td>
                    <td className="p-2">{row.name}</td>
                    <td className="p-2">{row.sku}</td>
                    <td className="p-2">
                      {row.action === "REMOVED"
                        ? <span className="text-rose-600 font-bold">REMOVED</span>
                        : <span className="text-green-600 font-bold">ADDED</span>}
                    </td>
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
