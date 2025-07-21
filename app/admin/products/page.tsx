// app/admin/products/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Combobox } from "@headlessui/react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { EditProductModal } from "@/components/EditProductModal";
import { MotionButton } from "@/components/button";
import {
  Plus,
  Camera as CameraIcon,
  ChevronsUpDown,
  Trash2,
  Edit2,
  X,
} from "lucide-react";

// Dynamically import so it only runs client‑side
const BarcodeScanner = dynamic(
  () => import("react-qr-barcode-scanner"),
  { ssr: false }
);

interface Category {
  id: number;
  name: string;
}

type Product = {
  id: number;
  barcode: string;
  name: string;
  description?: string;
  categories: Category[];
};

type EditPayload = {
  id: number;
  barcode: string;
  name: string;
  description?: string;
  categoryIds: number[];
};

function CameraBarcodeScanner({
  onDetected,
  onClose,
}: {
  onDetected: (code: string) => void;
  onClose: () => void;
}) {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative bg-gray-800 rounded-xl shadow-2xl p-4 max-w-md w-full">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-300 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 mb-2 text-white text-lg font-bold">
          <CameraIcon size={22} /> Scan Barcode
        </div>

        <div className="w-full overflow-hidden rounded-lg bg-black">
          <BarcodeScanner
            width={320}
            height={240}
            delay={300}
            onError={(err) => {
              const msg = typeof err === "string" ? err : err?.message;
              setError(msg || "Camera error");
            }}
            onUpdate={(err, result) => {
              if (err) {
                setError("No code detected");
              } else if (result) {
                onDetected(result.getText());
              }
            }}
          />
        </div>

        {error && (
          <p className="mt-2 text-rose-500 text-xs text-center">{error}</p>
        )}

        <p className="mt-2 text-xs text-gray-400 text-center">
          Point your camera at a barcode or QR code.
          <br />
          Tap outside or “X” to close.
        </p>
      </div>
    </div>
  );
}

export default function ProductAdminPage() {
  // Data
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // Filters
  const [catSearch, setCatSearch] = useState("");
  const [prodSearch, setProdSearch] = useState("");

  // New category
  const [newCategory, setNewCategory] = useState("");

  // New product
  const [newProdBarcode, setNewProdBarcode] = useState("");
  const [newProdName, setNewProdName] = useState("");
  const [newProdDesc, setNewProdDesc] = useState("");
  const [newProdCats, setNewProdCats] = useState<Category[]>([]);

  // Scanner modal
  const [scannerOpen, setScannerOpen] = useState(false);
  const barcodeRef = useRef<HTMLInputElement>(null);

  // Edit modal
  const [editing, setEditing] = useState<Product | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  // Load data
  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => toast.error("Failed to load categories"));

    fetch("/api/products")
      .then((r) => r.json())
      .then(setProducts)
      .catch(() => toast.error("Failed to load products"));
  }, []);

  // Filter logic
  const filteredCats = catSearch
    ? categories.filter((c) =>
        c.name.toLowerCase().includes(catSearch.toLowerCase())
      )
    : categories;

  const filteredProds = prodSearch
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(prodSearch.toLowerCase()) ||
          p.barcode.includes(prodSearch)
      )
    : products;

  // Handlers
  const handleAddCategory = async (): Promise<void> => {
    if (!newCategory.trim()) return;
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategory.trim() }),
    });
    if (!res.ok) {
      toast.error("Could not create category");
      return;
    }
    const cat: Category = await res.json();
    setCategories((c) => [...c, cat]);
    setNewCategory("");
    toast.success("Category added");
  };

  const handleAddProduct = async (): Promise<void> => {
    if (!newProdBarcode || !newProdName) {
      toast.error("Barcode & name required");
      return;
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
    });
    if (!res.ok) {
      toast.error("Could not create product");
      return;
    }
    const prod: Product = await res.json();
    setProducts((p) => [prod, ...p]);
    setNewProdBarcode("");
    setNewProdName("");
    setNewProdDesc("");
    setNewProdCats([]);
    toast.success("Product added");
    barcodeRef.current?.focus();
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProducts((p) => p.filter((x) => x.id !== id));
      toast.success("Deleted");
    } else {
      toast.error("Delete failed");
    }
  };

  const openEdit = (p: Product): void => {
    setEditing(p);
    setEditOpen(true);
  };

  const handleSave = async (payload: EditPayload): Promise<void> => {
    const res = await fetch(`/api/products/${payload.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      toast.error("Update failed");
      return;
    }
    const saved: Product = await res.json();
    setProducts((list) =>
      list.map((x) => (x.id === saved.id ? saved : x))
    );
    toast.success("Updated");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-900 py-12 px-4"
    >
      <div className="max-w-5xl mx-auto space-y-12">
        <h1 className="text-3xl font-bold text-white">
          Product Administration
        </h1>

        {/* === Category Management === */}
        <section className="bg-gray-800 shadow-lg rounded-2xl p-8">
          {/* …Category UI */}
        </section>

        {/* === Add New Product === */}
        <section className="bg-gray-800 shadow-lg rounded-2xl p-8">
          {/* …New Product UI */}
        </section>

        {/* === Product List === */}
        <section className="space-y-4">
          {/* …Product List UI */}
        </section>

        {/* Scanner Modal */}
        {scannerOpen && (
          <CameraBarcodeScanner
            onDetected={(code) => {
              setNewProdBarcode(code);
              setScannerOpen(false);
              barcodeRef.current?.focus();
            }}
            onClose={() => setScannerOpen(false)}
          />
        )}

        {/* Edit Modal */}
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
      </div>
    </motion.div>
  );
}
