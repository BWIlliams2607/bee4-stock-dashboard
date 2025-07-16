// app/stock-summary/page.tsx
"use client"

import { useState, useEffect } from "react"

type Category = { id: number; name: string }
type Product = {
  id: number
  barcode: string
  name: string
  categories: Category[]
}
type GoodsLog = { barcode: string; quantity: number }

export default function StockSummaryPage() {
  const [summary, setSummary] = useState<
    {
      category: Category
      items: {
        product: Product
        totalIn: number
        totalOut: number
        stock: number
      }[]
    }[]
  >([])
  const [catFilter, setCatFilter] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const [cats, prods, ins, outs] = await Promise.all([
          fetch("/api/categories").then((r) => r.json()),
          fetch("/api/products").then((r) => r.json()),
          fetch("/api/goods-in").then((r) => r.json()),
          fetch("/api/goods-out").then((r) => r.json()),
        ])

        // tally ins and outs by barcode using plain objects
        const inCounts: Record<string, number> = {}
        ;(ins as GoodsLog[]).forEach((i) => {
          inCounts[i.barcode] = (inCounts[i.barcode] || 0) + i.quantity
        })

        const outCounts: Record<string, number> = {}
        ;(outs as GoodsLog[]).forEach((o) => {
          outCounts[o.barcode] = (outCounts[o.barcode] || 0) + o.quantity
        })

        // build per-category summary
        const sum = (cats as Category[]).map((cat) => {
          const items = (prods as Product[])
            .filter((p) => p.categories.some((c) => c.id === cat.id))
            .map((p) => {
              const totalIn = inCounts[p.barcode] || 0
              const totalOut = outCounts[p.barcode] || 0
              return {
                product: p,
                totalIn,
                totalOut,
                stock: totalIn - totalOut,
              }
            })
          return { category: cat, items }
        })

        setSummary(sum)
      } catch (e) {
        console.error("Failed to load stock summary", e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return <div className="p-8 text-center">Loading stock summary…</div>
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-8">
      <h1 className="text-2xl font-bold">Stock Summary</h1>

      <input
        type="text"
        value={catFilter}
        onChange={(e) => setCatFilter(e.target.value)}
        placeholder="Filter categories…"
        className="w-full mb-6 rounded-lg border border-border bg-input px-4 py-2 text-sm"
      />

      {summary
        .filter((s) =>
          s.category.name.toLowerCase().includes(catFilter.toLowerCase())
        )
        .map(({ category, items }) => (
          <section
            key={category.id}
            className="bg-muted/70 p-6 rounded-2xl shadow-soft"
          >
            <h2 className="text-xl font-semibold mb-4">{category.name}</h2>

            {items.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="p-2 text-left">Name</th>
                      <th className="p-2 text-left">Barcode</th>
                      <th className="p-2 text-left">Stock</th>
                      <th className="p-2 text-left">Total In</th>
                      <th className="p-2 text-left">Total Out</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(({ product, totalIn, totalOut, stock }) => (
                      <tr
                        key={product.id}
                        className="border-b border-border hover:bg-muted/50"
                      >
                        <td className="p-2">{product.name}</td>
                        <td className="p-2">{product.barcode}</td>
                        <td className="p-2">{stock}</td>
                        <td className="p-2">{totalIn}</td>
                        <td className="p-2">{totalOut}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-muted-foreground">
                No products in this category.
              </div>
            )}
          </section>
        ))}
    </div>
  )
}
