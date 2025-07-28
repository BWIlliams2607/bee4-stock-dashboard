// components/admin/ProductSection.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Combobox } from "@headlessui/react";
import { toast } from "sonner";
import { TextInput } from "@/components/ui/TextInput";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import type {
  Category,
  Supplier,
  Location,
  Shelf,
  ProductWithRelations,
  EditPayload,
} from "@/lib/types";
import { EditProductModal } from "@/components/EditProductModal";
import dynamic from "next/dynamic";
import { X, Camera as CameraIcon, ChevronsUpDown } from "lucide-react";

const BarcodeScanner = dynamic(
  () => import("react-qr-barcode-scanner"),
  { ssr: false }
);

export default function ProductSection() {
  // ─── State ────────────────────────────────────────────────────────────────
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [products, setProducts] = useState<ProductWithRelations[]>([]);
  const [editing, setEditing] = useState<ProductWithRelations | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const [barcode, setBarcode] = useState("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [cats, setCats] = useState<Category[]>([]);
  const [supId, setSupId] = useState<number>();
  const [locId, setLocId] = useState<number>();
  const [shId, setShId] = useState<number>();

  const [filter, setFilter] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // ─── Data Load ─────────────────────────────────────────────────────────────
  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then((r) => r.json()).then(setCategories),
      fetch("/api/suppliers").then((r) => r.json()).then(setSuppliers),
      fetch("/api/locations").then((r) => r.json()).then(setLocations),
      fetch("/api/shelves").then((r) => r.json()).then(setShelves),
      fetch("/api/products").then((r) => r.json()).then(setProducts),
    ]).catch(() => toast.error("Failed to load admin data"));
  }, []);

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const addProduct = async () => {
    if (!barcode || !name) return toast.error("Barcode & name required");
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        barcode,
        name,
        description: desc || undefined,
        categoryIds: cats.map((c) => c.id),
        supplierId: supId,
        locationId: locId,
        shelfId: shId,
      } as EditPayload),
    });
    if (!res.ok) return toast.error("Could not create product");
    const p = await res.json();
    setProducts((ps) => [p, ...ps]);
    setBarcode("");
    setName("");
    setDesc("");
    setCats([]);
    setSupId(undefined);
    setLocId(undefined);
    setShId(undefined);
    toast.success("Product added");
    inputRef.current?.focus();
  };

  const deleteProduct = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProducts((ps) => ps.filter((x) => x.id !== id));
      toast.success("Deleted");
    } else {
      toast.error("Delete failed");
    }
  };

  const openEdit = (p: ProductWithRelations) => {
    setEditing(p);
    setEditOpen(true);
  };

  const saveEdit = async (payload: EditPayload) => {
    const res = await fetch(`/api/products/${payload.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return toast.error("Update failed");
    const updated = await res.json();
    setProducts((ps) => ps.map((x) => (x.id === updated.id ? updated : x)));
    toast.success("Updated");
  };

  // ─── Derived Data ─────────────────────────────────────────────────────────
  const filtered = filter
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(filter.toLowerCase()) ||
          p.barcode.includes(filter)
      )
    : products;

  // Build edit payload outside of JSX for clarity
  const editingPayload: EditPayload | null = editing
    ? {
        id: editing.id,
        barcode: editing.barcode,
        name: editing.name,
        description: editing.description || undefined,
        categoryIds: editing.categories.map((c) => c.id),
        supplierId: editing.defaultSupplier?.id,
        locationId: editing.defaultLocation?.id,
        shelfId: editing.defaultShelf?.id,
      }
    : null;

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* New Product Form */}
{/* New Product Form Panel */}
<div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-xl p-6 space-y-6">
  <h2 className="text-2xl font-semibold text-white">Add New Product</h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {/* Barcode */}
    <div>
      <label className="block text-sm text-gray-400 mb-1">Barcode</label>
      <div className="flex rounded-lg overflow-hidden">
        <TextInput
          ref={inputRef}
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          placeholder="Scan or type…"
          className="rounded-none rounded-l-lg"
        />
        <button
          onClick={() => setScannerOpen(true)}
          className="h-12 px-3 bg-gray-700 hover:bg-gray-600 border-l border-gray-600"
        >
          <CameraIcon className="text-white" />
        </button>
      </div>
    </div>

    {/* Name */}
    <div>
      <label className="block text-sm text-gray-400 mb-1">Name</label>
      <TextInput
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Product name"
      />
    </div>

    {/* Description */}
    <div>
      <label className="block text-sm text-gray-400 mb-1">Description</label>
      <TextInput
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Optional description"
      />
    </div>
  </div>

  {/* Categories Combobox */}
  <div>
    <label className="block text-sm text-gray-400 mb-1">Categories</label>
    <Combobox value={cats} onChange={setCats} multiple>
      <div className="relative">
        <Combobox.Input
          displayValue={(v: Category[]) => v.map((x) => x.name).join(", ")}
          placeholder="Select categories…"
          className="h-12 w-full rounded-lg border border-gray-700 bg-gray-800 px-4 text-white placeholder-gray-400"
        />
        <Combobox.Button className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <ChevronsUpDown className="text-white" />
        </Combobox.Button>
        <Combobox.Options className="absolute mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg max-h-48 overflow-auto z-10">
          {categories.map((cat) => (
            <Combobox.Option
              key={cat.id}
              value={cat}
              className={({ active }) =>
                `cursor-pointer px-4 py-2 ${
                  active ? "bg-green-600 text-white" : "text-gray-200"
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

  {/* Supplier / Location / Shelf */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {[
      { label: "Default Supplier", value: supId, setValue: setSupId, list: suppliers },
      { label: "Default Location", value: locId, setValue: setLocId, list: locations },
      { label: "Default Shelf", value: shId, setValue: setShId, list: shelves },
    ].map(({ label, value, setValue, list }) => (
      <div key={label}>
        <label className="block text-sm text-gray-400 mb-1">{label}</label>
        <select
          value={value ?? ""}
          onChange={(e) => setValue(e.target.value ? +e.target.value : undefined)}
          className="h-12 w-full rounded-lg border border-gray-700 bg-gray-800 text-white px-4"
        >
          <option value="">— none —</option>
          {list.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </select>
      </div>
    ))}
  </div>

  <div className="flex justify-end">
    <PrimaryButton onClick={addProduct} className="px-6 py-3">
      + Create Product
    </PrimaryButton>
  </div>
</div>


      {/* Search & List */}
      <div className="space-y-2">
        <TextInput
          placeholder="Search products…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <div className="overflow-x-auto bg-gray-800 rounded-2xl p-4">
          <table className="min-w-full text-white text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                {[
                  "Barcode",
                  "Name",
                  "Description",
                  "Categories",
                  "Supplier",
                  "Location",
                  "Shelf",
                  "Actions",
                ].map((h) => (
                  <th key={h} className="p-2 text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-700">
                  <td className="p-2">{p.barcode}</td>
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">{p.description || "—"}</td>
                  <td className="p-2">
                    {p.categories.map((c) => c.name).join(", ")}
                  </td>
                  <td className="p-2">
                    {p.defaultSupplier?.name || "—"}
                  </td>
                  <td className="p-2">
                    {p.defaultLocation?.name || "—"}
                  </td>
                  <td className="p-2">
                    {p.defaultShelf?.name || "—"}
                  </td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => openEdit(p)}
                      className="text-blue-400"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-gray-400">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Barcode Scanner Modal */}
      {scannerOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-gray-800 p-4 rounded-xl">
            <button
              onClick={() => setScannerOpen(false)}
              className="text-gray-300 mb-2"
            >
              <X />
            </button>
            <BarcodeScanner
              width={320}
              height={240}
              onUpdate={(err, result) => {
                if (result) {
                  setBarcode(result.getText());
                  setScannerOpen(false);
                  inputRef.current?.focus();
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editing && editingPayload && (
        <EditProductModal
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
          product={editingPayload}
          onSave={saveEdit}
        />
      )}
    </div>
  );
}
