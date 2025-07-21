// components/admin/LocationSection.tsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { TextInput } from "@/components/ui/TextInput";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import type { Location } from "@/lib/types";

export default function LocationSection() {
  const [items, setItems] = useState<Location[]>([]);
  const [newName, setNewName] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("/api/locations")
      .then((r) => r.json())
      .then(setItems)
      .catch(() => toast.error("Failed to load locations"));
  }, []);

  const add = async () => {
    if (!newName.trim()) return;
    const res = await fetch("/api/locations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    });
    if (!res.ok) return toast.error("Could not create location");
    const loc: Location = await res.json();
    setItems((l) => [...l, loc]);
    setNewName("");
    toast.success("Location added");
  };

  const filtered = filter
    ? items.filter((l) =>
        l.name.toLowerCase().includes(filter.toLowerCase())
      )
    : items;

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <TextInput
          placeholder="New location name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <PrimaryButton onClick={add}>+ Add Location</PrimaryButton>
      </div>

      <TextInput
        placeholder="Filter locations…"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <ul className="max-h-40 overflow-auto scrollbar-thin scrollbar-thumb-gray-600 space-y-1">
        {filtered.map((l) => (
          <li
            key={l.id}
            className="px-4 py-2 rounded-lg text-white hover:bg-gray-700 cursor-pointer"
          >
            {l.name}
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="text-gray-400 text-sm text-center py-2">
            No locations
          </li>
        )}
      </ul>
    </div>
  );
}
