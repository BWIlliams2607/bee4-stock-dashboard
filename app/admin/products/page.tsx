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

  // remove product (client-side soft delete)
  const handleRemove = (idToRemove: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== idToRemove))
    toast.success("Product removed locally. (Server delete pending.)")
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 max-w-5xl mx-auto py-8"
    >
      <h1 className="text-2xl font-bold">Product Administration</h1>

      {/* Category Management */}
      <section className="bg-muted/70 p-6 rounded-2xl shadow-soft">
        <h2 className="text-lg font-semibold mb-4">Categories</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category name"
            className="flex-1 rounded-lg border border-border px-3 py-2 bg-input text-sm"
          />
          <MotionButton
            onClick={handleAddCategory}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
          >
            <Plus size={16} /> Add Category
          </MotionButton>
        </div>

        <input
          type="text"
          value={catSearch}
          onChange={(e) => setCatSearch(e.target.value)}
          placeholder="Filter categories…"
          className="w-full mb-4 rounded-lg border border-border px-3 py-2 bg-input text-sm"
        />

        <ul className="max-h-40 overflow-auto space-y-1">
          {filteredCats.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted"
            >
              {c.name}
            </li>
          ))}
          {filteredCats.length === 0 && (
            <li className="text-muted-foreground text-sm text-center py-2">
              No categories
            </li>
          )}
        </ul>
      </section>

      {/* Product Creation */}
      <section className="bg-muted/70 p-6 rounded-2xl shadow-soft">
        <h2 className="text-lg font-semibold mb-4">Add New Product</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Barcode */}
          <div className="relative md:col-span-1">
            <label className="block text-sm font-medium mb-1">Barcode</label>
            <div className="flex">
              <input
                ref={barcodeRef}
                type="text"
                value={newProdBarcode}
                onChange={(e) => setNewProdBarcode(e.target.value)}
                placeholder="Scan or type…"
                className="flex-1 rounded-l-lg border border-border px-3 py-2 bg-input text-sm"
              />
              <button
                type="button"
                onClick={() => setScannerOpen(true)}
                className="rounded-r-lg border border-border bg-muted px-3 flex items-center justify-center hover:bg-muted/80"
                title="Scan with camera"
              >
                <Camera size={18} />
              </button>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={newProdName}
              onChange={(e) => setNewProdName(e.target.value)}
              placeholder="Product name"
              className="w-full rounded-lg border border-border px-3 py-2 bg-input text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <input
              type="text"
              value={newProdDesc}
              onChange={(e) => setNewProdDesc(e.target.value)}
              placeholder="Optional description"
              className="w-full rounded-lg border border-border px-3 py-2 bg-input text-sm"
            />
          </div>

          {/* Categories Multi-select */}
          <div>
            <label className="block text-sm font-medium mb-1">Categories</label>
            <Combobox
              value={newProdCats}
              onChange={setNewProdCats}
              multiple
            >
              <div className="relative">
                <Combobox.Input
                  className="w-full rounded-lg border border-border bg-input px-3 py-2 pr-10 text-sm"
                  displayValue={(cats: Category[]) =>
                    cats.map((c) => c.name).join(", ")
                  }
                  placeholder="Select categories…"
                />
                <Combobox.Button className="absolute inset-y-0 right-2 flex items-center">
                  <ChevronsUpDown size={18} />
                </Combobox.Button>
                <Combobox.Options className="absolute mt-1 max-h-48 w-full overflow-auto rounded-lg bg-background p-1 shadow-lg z-10 text-sm">
                  {categories.map((cat) => (
                    <Combobox.Option
                      key={cat.id}
                      value={cat}
                      className={({ active }) =>
                        `cursor-pointer px-3 py-2 rounded ${
                          active ? "bg-blue-600 text-white" : ""
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
        </div>

        <div className="mt-6 flex justify-end">
          <MotionButton
            onClick={handleAddProduct}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={16} /> Create Product
          </MotionButton>
        </div>
      </section>

      {/* Product List & Actions */}
      <section>
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={prodSearch}
            onChange={(e) => setProdSearch(e.target.value)}
            placeholder="Search products…"
            className="flex-1 rounded-lg border border-border px-3 py-2 bg-input text-sm"
          />
        </div>

        <div className="overflow-x-auto bg-muted/70 p-4 rounded-2xl shadow-soft">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {[
                  "Barcode",
                  "Name",
                  "Description",
                  "Categories",
                  "Actions",
                ].map((h) => (
                  <th key={h} className="p-2 text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredProds.map((p) => (
                <tr
                  key={p.id}
                  className="border-b hover:bg-muted/50 transition"
                >
                  <td className="p-2">{p.barcode}</td>
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">{p.description || "—"}</td>
                  <td className="p-2">
                    {p.categories.map((c) => c.name).join(", ") || "—"}
                  </td>
                  <td className="p-2 flex gap-2">
                    {/* Delete */}
                    <button
                      onClick={() => {
                        if (!confirm("Delete this product?")) return
                        handleRemove(p.id)
                      }}
                      className="text-rose-500 hover:text-rose-700"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={async () => {
                        const newName = prompt("New name", p.name)
                        if (newName == null || newName === p.name) return
                        const res = await fetch(`/api/products/${p.id}`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            name: newName,
                            description: p.description,
                            categoryIds: p.categories.map((c) => c.id),
                          }),
                        })
                        if (!res.ok) return toast.error("Update failed")
                        const updated = await res.json()
                        setProducts((list) =>
                          list.map((x) => (x.id === updated.id ? updated : x))
                        )
                        toast.success("Updated")
                      }}
                      className="text-blue-500 hover:text-blue-700"
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
                    className="p-4 text-center text-muted-foreground"
                  >
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

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
    </motion.div>
  )
}
