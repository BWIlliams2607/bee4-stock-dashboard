// components/admin/ShelfSection.tsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { TextInput } from "@/components/ui/TextInput";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import type { Shelf } from "@/lib/types";

export default function ShelfSection() {
  const [items, setItems] = useState<Shelf[]>([]);
  const [newName, setNewName] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("/api/shelves")
      .then((r) => r.json())
      .then(setItems)
      .catch(() => toast.error("Failed to load shelves"));
  }, []);

  const add = async () => {
    if (!newName.trim()) return;
    const res = await fetch("/api/shelves", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    });
    if (!res.ok) return toast.error("Could not create shelf");
    const sh: Shelf = await res.json();
    setItems((s) => [...s, sh]);
    setNewName("");
    toast.success("Shelf added");
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
          placeholder="New shelf name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <PrimaryButton onClick={add}>+ Add Shelf</PrimaryButton>
      </div>

      <TextInput
        placeholder="Filter shelves…"
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
            No shelves
          </li>
        )}
      </ul>
    </div>
  );
}
