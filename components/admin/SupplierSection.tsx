// components/admin/SupplierSection.tsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { TextInput } from "@/components/ui/TextInput";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import type { Supplier } from "@/lib/types";

export default function SupplierSection() {
  const [items, setItems] = useState<Supplier[]>([]);
  const [newName, setNewName] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("/api/suppliers")
      .then((r) => r.json())
      .then(setItems)
      .catch(() => toast.error("Failed to load suppliers"));
  }, []);

  const add = async () => {
    if (!newName.trim()) return;
    const res = await fetch("/api/suppliers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    });
    if (!res.ok) return toast.error("Could not create supplier");
    const sup: Supplier = await res.json();
    setItems((s) => [...s, sup]);
    setNewName("");
    toast.success("Supplier added");
  };

  const filtered = filter
    ? items.filter((s) =>
        s.name.toLowerCase().includes(filter.toLowerCase())
      )
    : items;

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <TextInput
          placeholder="New supplier name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <PrimaryButton onClick={add}>+ Add Supplier</PrimaryButton>
      </div>

      <TextInput
        placeholder="Filter suppliers…"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <ul className="max-h-40 overflow-auto scrollbar-thin scrollbar-thumb-gray-600 space-y-1">
        {filtered.map((s) => (
          <li
            key={s.id}
            className="px-4 py-2 rounded-lg text-white hover:bg-gray-700 cursor-pointer"
          >
            {s.name}
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="text-gray-400 text-sm text-center py-2">
            No suppliers
          </li>
        )}
      </ul>
    </div>
  );
}
