"use client"
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { CameraBarcodeScanner } from "@/components/CameraBarcodeScanner"
import { toast } from "sonner"
import { EditProductModal } from "@/components/EditProductModal"

// Components & Icons
import { Combobox } from "@headlessui/react"
import { MotionButton } from "@/components/button"
import { Plus, Camera, ChevronsUpDown, Trash2, Edit2 } from "lucide-react"

// Types
interface Category { id: number; name: string }

type Product = {
  id: number
  barcode: string
  name: string
  description?: string
  categories: Category[]
}

// ─── Payload for editing ───────────────────────────────────────────────────────
type EditPayload = {
  id: number
  barcode: string
  name: string
  description?: string
  categoryIds: number[]
}

export default function ProductAdminPage() {
  // Data state
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

  // Barcode scanner
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

  // ─── Save edits back to DB ────────────────────────────────────────────────────
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

        {/* Category Management */}
        {/* ... unchanged markup for category section ... */}

        {/* Add New Product */}
        {/* ... unchanged markup for add product section ... */}

        {/* Product List */}
        {/* ... unchanged markup for product list ... */}

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
        <EditProductModal
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
          product={
            editing
              ? {
                  id: editing.id,
                  barcode: editing.barcode,
                  name: editing.name,
                  description: editing.description,
                  categoryIds: editing.categories.map((c) => c.id),
                }
              : null
          }
          onSave={handleSave}
        />
      </div>
    </motion.div>
  )
}
