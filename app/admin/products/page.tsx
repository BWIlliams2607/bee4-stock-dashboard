// app/admin/products/page.tsx
/* eslint-disable @typescript-eslint/no-unused-vars */
 "use client"

import { useState, useEffect, useRef } from "react"
import { Combobox } from "@headlessui/react"
import { motion } from "framer-motion"
import { BrowserMultiFormatReader, Result } from "@zxing/browser"
import { toast } from "sonner"
import { EditProductModal } from "@/components/EditProductModal"
import { MotionButton } from "@/components/button"
import {
  Plus,
  Camera as CameraIcon,
  ChevronsUpDown,
  Trash2,
  Edit2,
  X,
} from "lucide-react"

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

// ─── Inline ZXing Scanner ───────────────────────────────────────────────────────
function CameraBarcodeScanner({
  onDetected,
  onClose,
}: {
  onDetected: (code: string) => void
  onClose: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const reader = new BrowserMultiFormatReader()
    reader
      .decodeFromConstraints(
        { video: { facingMode: { ideal: "environment" } } },
        videoRef.current!
      )
      .then((res: Result) => {
        onDetected(res.getText())
        reader.reset()
      })
      .catch((e: any) => {
        // keep trying
        setError("Scanning...")
      })

    return () => reader.reset()
  }, [onDetected])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative bg-gray-800 rounded-xl shadow-2xl p-4 max-w-md w-full">
        <button
          onClick={() => onClose()}
          className="absolute right-3 top-3 p-1 text-gray-300 hover:text-white"
        >
          <X size={22} />
        </button>
        <div className="mb-2 text-lg font-bold flex items-center gap-2 text-white">
          <CameraIcon size={22} /> Scan Barcode
        </div>
        <video
          ref={videoRef}
          className="w-full aspect-video rounded-lg bg-black"
          muted
          playsInline
          autoPlay
        />
        {error && (
          <p className="mt-2 text-rose-500 text-xs text-center">{error}</p>
        )}
        <p className="mt-2 text-xs text-gray-400 text-center">
          Point at a barcode (GS1-128, EAN, QR…).<br />
          Tap “X” or outside to close.
        </p>
      </div>
    </div>
  )
}

// ─── Main Admin Page ────────────────────────────────────────────────────────────
export default function ProductAdminPage() {
  // Data
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])

  // Filters
  const [catSearch, setCatSearch] = useState("")
  const [prodSearch, setProdSearch] = useState("")

  // New category
  const [newCategory, setNewCategory] = useState("")

  // New product
  const [newProdBarcode, setNewProdBarcode] = useState("")
  const [newProdName, setNewProdName] = useState("")
  const [newProdDesc, setNewProdDesc] = useState("")
  const [newProdCats, setNewProdCats] = useState<Category[]>([])

  // Scanner modal
  const [scannerOpen, setScannerOpen] = useState(false)
  const barcodeRef = useRef<HTMLInputElement>(null)

  // Edit modal
  const [editing, setEditing] = useState<Product | null>(null)
  const [editOpen, setEditOpen] = useState(false)

  // Load data
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

  // Filter logic
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

  // CRUD handlers (unchanged)
  const handleAddCategory = async () => { /* … */ }
  const handleAddProduct = async () => { /* … */ }
  const handleDelete = async (id: number) => { /* … */ }
  const openEdit = (p: Product) => { /* … */ }
  const handleSave = async (payload: EditPayload) => { /* … */ }

  return (
    <motion.div className="min-h-screen bg-gray-900 py-12 px-4">
      {/* … your full JSX here exactly as before … */}

      {/* Barcode Scanner Modal */}
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

      {/* Edit Product Modal */}
      {editing && (
        <EditProductModal
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
          product={{
            id: editing.id,
            barcode: editing.barcode,
            name: editing.name,
            description: editing.description,
            categoryIds: editing.categories.map((c) => c.id),
          }}
          onSave={handleSave}
        />
      )}
    </motion.div>
  )
}
