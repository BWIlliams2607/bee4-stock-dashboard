"use client"

import { Plus, Minus, ClipboardList } from "lucide-react"
import { useRouter } from "next/navigation"

export function QuickActions() {
  const router = useRouter()
  return (
    <div className="flex space-x-2 mb-6">
      <button
        onClick={() => router.push("/goods-in")}
        className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm transition"
      >
        <Plus size={16} /> Add Stock
      </button>
      <button
        onClick={() => router.push("/goods-out")}
        className="flex items-center gap-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-md shadow-sm transition"
      >
        <Minus size={16} /> Remove Stock
      </button>
      <button
        onClick={() => router.push("/order-requests")}
        className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-md shadow-sm transition"
      >
        <ClipboardList size={16} /> New Order
      </button>
    </div>
  )
}
