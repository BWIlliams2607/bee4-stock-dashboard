"use client"

import { useState, useEffect, useRef } from "react"
import { Combobox } from "@headlessui/react"
import { motion } from "framer-motion"
import {
  Plus,
  Camera,
  ChevronsUpDown,
  Trash2,
  Edit2,
} from "lucide-react"
import { MotionButton } from "@/components/button"
import { CameraBarcodeScanner } from "@/components/CameraBarcodeScanner"
import { toast } from "sonner"
import { EditProductModal } from "@/components/EditProductModal"

type Category = { id: number; name: string }
type Product = {
  id: number
  barcode: string
  name: string
  description?: string
  categories: Category[]
}

export default function ProductAdminPage() {
  // fetched data
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])

  // filters
  const [catSearch, setCatSearch] = useState("")
  const [prodSearch, setProdSearch] = useState("")

  // new category
  const [newCategory, setNewCategory] = useState("")

  // new product
  const [newProdBarcode, setNewProdBarcode] = useState("")
  const [newProdName, setNewProdName] = useState("")
  const [newProdDesc, setNewProdDesc] = useState("")
  const [newProdCats, setNewProdCats] = useState<Category[]>([])

  // barcode scanner
  const [scannerOpen, setScannerOpen] = useState(false)
  const barcodeRef = useRef<HTMLInputElement>(null)

  // edit modal
  const [editing, setEditing] = useState<Product | null>(null)
  const [editOpen, setEditOpen] = useState(false)

  // fetch on mount
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

  // filtered lists
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

  // add category
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategory.trim() }),
    })
    if (!res.ok) return toast.error("Could not create category")
    const cat: Category = await res.json()
    setCategories((c) => [...c, cat])
    setNewCategory("")
    toast.success("Category added")
  }

  // add product
  const handleAddProduct = async () => {
    if (!newProdBarcode || !newProdName) {
      return toast.error("Barcode & name required")
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
    if (!res.ok) return toast.error("Could not create product")
    const prod: Product = await res.json()
    setProducts((p) => [prod, ...p])
    setNewProdBarcode("")
    setNewProdName("")
    setNewProdDesc("")
    setNewProdCats([])
    toast.success("Product added")
    barcodeRef.current?.focus()
  }

  // delete on server + client
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
    if (res.ok) {
      setProducts((p) => p.filter((x) => x.id !== id))
      toast.success("Deleted")
    } else {
      toast.error("Delete failed")
    }
  }

  // open edit modal
  const openEdit = (p: Product) => {
    setEditing(p)
    setEditOpen(true)
  }

  // save edits
  const handleSave = async (upd: Product) => {
    const res = await fetch(`/api/products/${upd.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        barcode: upd.barcode,
        name: upd.name,
        description: upd.description,
        categoryIds: upd.categories.map((c) => c.id),
      }),
    })
    if (!res.ok) return toast.error("Update failed")
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
        <section className="bg-gray-800 shadow-lg rounded-2xl p-8">
          {/* ... categories markup ... */}
        </section>

        {/* === Add New Product === */}
        <section className="bg-gray-800 shadow-lg rounded-2xl p-8">
          {/* ... add product markup ... */}
        </section>

        {/* === Product List === */}
        <section>
          {/* ... product list markup ... */}
        </section>

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
              ? { ...editing, categoryIds: editing.categories.map((c) => c.id) }
              : null
          }
          onSave={handleSave}
        />
      </div>
    </motion.div>
  )
}
