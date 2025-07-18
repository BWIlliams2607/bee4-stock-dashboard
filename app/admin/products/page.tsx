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
          <h2 className="text-2xl font-semibold text-white mb-4">Categories</h2>
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category name"
              className="flex-1 h-12 rounded-lg border border-gray-700 px-4 bg-gray-700 text-gray-100 text-sm focus:ring-2 focus:ring-green-500"
            />
            <MotionButton
              onClick={handleAddCategory}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="h-12 px-6 rounded-lg bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              <Plus size={16} /> Add Category
            </MotionButton>
          </div>

          <input
            type="text"
            value={catSearch}
            onChange={(e) => setCatSearch(e.target.value)}
            placeholder="Filter categories…"
            className="w-full h-12 mb-6 rounded-lg border border-gray-700 px-4 bg-gray-700 text-gray-100 text-sm focus:ring-2 focus:ring-green-500"
          />

          <ul className="max-h-40 overflow-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 space-y-2">
            {filteredCats.map((c) => (
              <li
                key={c.id}
                className="px-4 py-2 rounded-lg hover:bg-gray-700 cursor-pointer text-gray-100"
              >
                {c.name}
              </li>
            ))}
            {filteredCats.length === 0 && (
              <li className="text-gray-400 text-sm text-center py-2">
                No categories
              </li>
            )}
          </ul>
        </section>

        {/* === Add New Product === */}
        <section className="bg-gray-800 shadow-lg rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Add New Product</h2>
          <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Barcode */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Barcode</label>
              <div className="flex">
                <input
                  ref={barcodeRef}
                  type="text"
                  value={newProdBarcode}
                  onChange={(e) => setNewProdBarcode(e.target.value)}
                  placeholder="Scan or type…"
                  className="flex-1 h-12 rounded-l-lg border border-gray-700 px-4 bg-gray-700 text-gray-100 text-sm focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="button"
                  onClick={() => setScannerOpen(true)}
                  className="h-12 rounded-r-lg border border-gray-700 bg-gray-700 px-4 flex items-center justify-center hover:bg-gray-600"
                  title="Scan with camera"
                >
                  <Camera size={18} />
                </button>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
              <input
                type="text"
                value={newProdName}
                onChange={(e) => setNewProdName(e.target.value)}
                placeholder="Product name"
                className="w-full h-12 rounded-lg border border-gray-700 px-4 bg-gray-700 text-gray-100 text-sm focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <input
                type="text"
                value={newProdDesc}
                onChange={(e) => setNewProdDesc(e.target.value)}
                placeholder="Optional description"
                className="w-full h-12 rounded-lg border border-gray-700 px-4 bg-gray-700 text-gray-100 text-sm focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Categories */}
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-300 mb-1">Categories</label>
              <Combobox
                value={newProdCats}
                onChange={setNewProdCats}
                multiple
              >
                <div className="relative">
                  <Combobox.Input
                    className="w-full h-12 rounded-lg border border-gray-700 bg-gray-700 px-4 pr-10 text-gray-100 text-sm focus:ring-2 focus:ring-green-500"
                    displayValue={(cats: Category[]) =>
                      cats.map((c) => c.name).join(", ")
                    }
                    placeholder="Select categories…"
                  />
                  <Combobox.Button className="absolute inset-y-0 right-3 flex items-center">
                    <ChevronsUpDown size={18} className="text-gray-300" />
                  </Combobox.Button>
                  <Combobox.Options className="absolute mt-1 max-h-48 w-full overflow-auto rounded-lg bg-gray-800 p-2 shadow-lg z-10 text-sm scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                    {categories.map((cat) => (
                      <Combobox.Option
                        key={cat.id}
                        value={cat}
                        className={({ active }) =>
                          `cursor-pointer px-3 py-2 rounded-lg ${
                            active ? "bg-green-600 text-white" : "text-gray-100"
                          }`
                        }
                      >
                        {cat.name}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                </div>
              </Combobox>
            </div>
          </form>

          <div className="mt-8 flex justify-end">
            <MotionButton
              onClick={handleAddProduct}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="h-12 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <Plus size={16} /> Create Product
            </MotionButton>
          </div>
        </section>

        {/* === Product List === */}
        <section>
          <div className="mb-4">
            <input
              type="text"
              value={prodSearch}
              onChange={(e) => setProdSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full h-12 rounded-lg border border-gray-700 px-4 bg-gray-700 text-gray-100 text-sm focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="overflow-x-auto bg-gray-800 p-6 rounded-2xl shadow-lg">
            <table className="min-w-full text-sm text-gray-100">
              <thead>
                <tr className="border-b border-gray-700">
                  {[
                    "Barcode",
                    "Name",
                    "Description",
                    "Categories",
                    "Actions",
                  ].map((h) => (
                    <th key={h} className="p-3 text-left font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProds.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b hover:bg-gray-700 transition-colors"
                  >
                    <td className="p-3">{p.barcode}</td>
                    <td className="p-3">{p.name}</td>
                    <td className="p-3">{p.description || "—"}</td>
                    <td className="p-3">{p.categories.map((c) => c.name).join(", ") || "—"}</td>
                    <td className="p-3 flex gap-4">
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button
                        onClick={() => openEdit(p)}
                        className="text-blue-400 hover:text-blue-600"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredProds.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-6 text-center text-gray-400"
                    >
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
          product={editing}
          onSave={handleSave}
        />
      </div>
    </motion.div>
  )
}
