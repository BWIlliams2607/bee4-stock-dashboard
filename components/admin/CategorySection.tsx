// components/admin/CategorySection.tsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { TextInput } from "@/components/ui/TextInput";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import type { Category } from "@/lib/types";

export default function CategorySection() {
  const [items, setItems] = useState<Category[]>([]);
  const [newName, setNewName] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setItems)
      .catch(() => toast.error("Failed to load categories"));
  }, []);

  const add = async () => {
    if (!newName.trim()) return;
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    });
    if (!res.ok) return toast.error("Could not create category");
    const cat: Category = await res.json();
    setItems((c) => [...c, cat]);
    setNewName("");
    toast.success("Category added");
  };

  const filtered = filter
    ? items.filter((c) =>
        c.name.toLowerCase().includes(filter.toLowerCase())
      )
    : items;

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <TextInput
          placeholder="New category name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <PrimaryButton onClick={add}>+ Add Category</PrimaryButton>
      </div>

      <TextInput
        placeholder="Filter categories…"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <ul className="max-h-40 overflow-auto scrollbar-thin scrollbar-thumb-gray-600 space-y-1">
        {filtered.map((c) => (
          <li
            key={c.id}
            className="px-4 py-2 rounded-lg text-white hover:bg-gray-700 cursor-pointer"
          >
            {c.name}
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="text-gray-400 text-sm text-center py-2">
            No categories
          </li>
        )}
      </ul>
    </div>
  );
}
