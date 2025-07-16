"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/button";
import { toast } from "sonner";

type Product = {
  id: number;
  barcode: string;
  name: string;
  description: string | null;
  createdAt: string;
};

export default function ProductAdminPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [barcode, setBarcode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // load products
  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then(setProducts)
      .catch(() => toast.error("Failed to load products"));
  }, []);

  // handle new product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcode || !name) {
      toast.error("Barcode and name are required");
      return;
    }
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ barcode, name, description }),
    });
    if (!res.ok) {
      const err = await res.json();
      toast.error(err?.error || "Could not add product");
      return;
    }
    const created: Product = await res.json();
    setProducts((p) => [created, ...p]);
    setBarcode("");
    setName("");
    setDescription("");
    toast.success("Product added!");
  };

  if (!user) {
    return <p className="p-4">Please log in to manage products.</p>;
  }
  if (user.role !== "admin") {
    return <p className="p-4 text-red-600">Access denied.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Product Administration</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1 md:col-span-1">
          <label className="block text-sm font-semibold">Barcode</label>
          <input
            required
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            className="w-full rounded border px-3 py-2"
            placeholder="1234567890123"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold">Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border px-3 py-2"
            placeholder="Acme Domed Sticker"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold">Description</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded border px-3 py-2"
            placeholder="Premium UV-resistant domed sticker"
          />
        </div>
        <div className="md:col-span-3">
          <Button type="submit" className="mt-2">
            Add Product
          </Button>
        </div>
      </form>

      <section>
        <h2 className="text-xl font-semibold">Existing Products</h2>
        <ul className="mt-2 space-y-2">
          {products.map((p) => (
            <li key={p.id} className="flex justify-between p-2 border rounded">
              <div>
                <strong>{p.name}</strong> <span className="text-sm text-gray-500">({p.barcode})</span>
                <p className="text-sm">{p.description}</p>
              </div>
              <div className="text-xs text-gray-400">
                {new Date(p.createdAt).toLocaleDateString()}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
