// app/admin/products/page.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import { Combobox } from "@headlessui/react"
import { motion } from "framer-motion"
import { BrowserMultiFormatReader, Result } from "@zxing/browser"
import { toast } from "sonner"
import { EditProductModal } from "@/components/EditProductModal"
import { MotionButton } from "@/components/button"
import { Plus, Camera, ChevronsUpDown, Trash2, Edit2, X } from "lucide-react"

// ─── Types ──────────────────────────────────────────────────────────────────────
interface Category {
  id: number
  name: string
}

type Product = {
  id: number
  barcode: string
  name: string
  description?: string
  categories: Category[]
}

type EditPayload = {
  id: number
  barcode: string
  name: string
  description?: string
  categoryIds: number[]
}

// ─── Inlined ZXing Scanner ──────────────────────────────────────────────────────
function CameraBarcodeScanner({
  onDetected,
  onClose,
}: {
  onDetected: (code: string) => void
  onClose: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader()
    const constraints = { video: { facingMode: { ideal: "environment" } } }

    codeReader
      .decodeFromConstraints(constraints, videoRef.current!)
      .then((result: Result) => {
        onDetected(result.getText())
        codeReader.reset()
      })
      .catch(() => {
        // keep trying until we get a result
        setError("Scanning...")
      })

    return () => {
      codeReader.reset()
    }
  }, [onDetected])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative bg-gray-800 rounded-xl shadow-2xl p-4 max-w-md w-full flex flex-col items-center gap-2">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 p-1 text-gray-300 hover:text-white"
        >
          <X size={22} />
        </button>
        <div className="mb-2 text-lg font-bold flex items-center gap-2 text-white">
          <Camera size={22} /> Scan Barcode
        </div>
        <div className="w-full max-w-xs overflow-hidden rounded-lg bg-black">
          <video
            ref={videoRef}
            className="w-full h-auto"
            muted
            playsInline
            autoPlay
          />
        </div>
        {error && (
          <div className="mt-2 text-rose-500 text-xs text-center">{error}</div>
        )}
        <div className="text-xs text-gray-400 mt-2 text-center">
          Point your camera at a barcode or QR code.
          <br />
          Tap outside or “X” to close.
        </div>
      </div>
    </div>
  )
}

// ─── Main Page Component ────────────────────────────────────────────────────────
export default function ProductAdminPage() {
  // Data
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])

  // Filters
  const [catSearch, setCatSearch] = useState("")
  const [prodSearch, setProdSearch] = useState("")

  // New category
  const [newCategory, setNewCategory] = useState("")

  // New product fields
  const [newProdBarcode, setNewProdBarcode] = useState("")
  const [newProdName, setNewProdName] = useState("")
  const [newProdDesc, setNewProdDesc] = useState("")
  const [newProdCats, setNewProdCats] = useState<Category[]>([])

  // Scanner
  const [scannerOpen, setScannerOpen] = useState(false)
  const barcodeRef = useRef<HTMLInputElement>(null)

  // Edit modal
  const [editing, setEditing] = useState<Product | null>(null)
  const [editOpen, setEditOpen] = useState(false)

  // Fetch on mount
  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => toast.error("Failed to load categories"))

    fetch("/api/products")
      .then((r) => r.json())
      .then(setProducts)
      .catch(() => toast.error("Failed to load products"))
  }, [])

  // Filtered lists
  const filteredCats = catSearch
    ? categories.filter((c) =>
        c.name.toLowerCase().includes(catSearch.toLowerCase())
      )
    : categories

  const filteredProds = prodSearch
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(prodSearch.toLowerCase()) ||
          p.barcode.includes(prodSearch)
      )
    : products

  // Handlers
  const handleAddCategory = async (): Promise<void> => {
    if (!newCategory.trim()) return
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategory.trim() }),
    })
    if (!res.ok) {
      toast.error("Could not create category")
      return
    }
    const cat: Category = await res.json()
    setCategories((c) => [...c, cat])
    setNewCategory("")
    toast.success("Category added")
  }

  const handleAddProduct = async (): Promise<void> => {
    if (!newProdBarcode || !newProdName) {
      toast.error("Barcode & name required")
      return
    }
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        barcode: newProdBarcode,
        name: newProdName,
        description: newProdDesc || undefined,
        categoryIds: newProdCats.map((c) => c.id),
      }),
    })
    if (!res.ok) {
      toast.error("Could not create product")
      return
    }
    const prod: Product = await res.json()
    setProducts((p) => [prod, ...p])
    setNewProdBarcode("")
    setNewProdName("")
    setNewProdDesc("")
    setNewProdCats([])
    toast.success("Product added")
    barcodeRef.current?.focus()
  }

  const handleDelete = async (id: number): Promise<void> => {
    if (!confirm("Delete this product?")) return
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
    if (res.ok) {
      setProducts((p) => p.filter((x) => x.id !== id))
      toast.success("Deleted")
    } else {
      toast.error("Delete failed")
    }
  }

  const openEdit = (p: Product): void => {
    setEditing(p)
    setEditOpen(true)
  }

  // Save edits
  const handleSave = async (payload: EditPayload): Promise<void> => {
    const res = await fetch(`/api/products/${payload.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      toast.error("Update failed")
      return
    }
    const saved: Product = await res.json()
    setProducts((list) =>
      list.map((x) => (x.id === saved.id ? saved : x))
    )
    toast.success("Updated")
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-900 py-12 px-4"
    >
      <div className="max-w-5xl mx-auto space-y-12">
        <h1 className="text-3xl font-bold text-white">Product Administration</h1>

        {/* === Category Management === */}
        {/* ...same as before... */}

        {/* === Add New Product === */}
        <section className="bg-gray-800 shadow-lg rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Add New Product
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Barcode */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Barcode
              </label>
              <div className="flex">
                <input
                  ref={barcodeRef}
                  type="text"
                  value={newProdBarcode}
                  onChange={(e) => setNewProdBarcode(e.target.value)}
                  placeholder="Scan or type…"
                  className="flex-1 h-12 rounded-l-lg border border-gray-700 px-4 bg-gray-700 text-sm placeholder-gray-400 text-white focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="button"
                  onClick={() => setScannerOpen(true)}
                  className="h-12 rounded-r-lg border border-gray-700 bg-gray-700 px-4 flex items-center justify-center hover:bg-gray-600"
                  title="Scan with camera"
                >
                  <Camera size={18} className="text-white" />
                </button>
              </div>
            </div>

            {/* Name, Description, Categories... */}
          </div>
        </section>

        {/* === Product List === */}
        {/* ...same as before... */}

        {/* Barcode Scanner */}
        {scannerOpen && (
          <CameraBarcodeScanner
            onDetected={(code) => {
              setNewProdBarcode(code)
              setScannerOpen(false)
              barcodeRef.current?.focus()
            }}
            onClose={() => setScannerOpen(false)}
          />
        )}

        {/* Edit Modal */}
        {/* ...same as before... */}
      </div>
    </motion.div>
  )
}
