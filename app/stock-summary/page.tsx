// app/stock-summary/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";

type Category = { id: number; name: string };
type Product = {
  id: number;
  barcode: string;
  name: string;
  categories: Category[];
};
type GoodsLog = { barcode: string; quantity: number };

export default function StockSummaryPage() {
  const [summary, setSummary] = useState<
    {
      category: Category;
      items: {
        product: Product;
        totalIn: number;
        totalOut: number;
        stock: number;
      }[];
    }[]
  >([]);
  const [catFilter, setCatFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [openCats, setOpenCats] = useState<Record<number, boolean>>({});

  // FETCH & BUILD SUMMARY
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [cats, prods, ins, outs] = await Promise.all([
          fetch("/api/categories").then((r) => r.json()),
          fetch("/api/products").then((r) => r.json()),
          fetch("/api/goods-in").then((r) => r.json()),
          fetch("/api/goods-out").then((r) => r.json()),
        ]);

        const inCounts = (ins as GoodsLog[]).reduce<Record<string, number>>(
          (acc, i) => {
            acc[i.barcode] = (acc[i.barcode] || 0) + i.quantity;
            return acc;
          },
          {}
        );
        const outCounts = (outs as GoodsLog[]).reduce<Record<string, number>>(
          (acc, o) => {
            acc[o.barcode] = (acc[o.barcode] || 0) + o.quantity;
            return acc;
          },
          {}
        );

        const sum = (cats as Category[]).map((cat) => {
          const items = (prods as Product[])
            .filter((p) => p.categories.some((c) => c.id === cat.id))
            .map((p) => {
              const totalIn = inCounts[p.barcode] || 0;
              const totalOut = outCounts[p.barcode] || 0;
              return {
                product: p,
                totalIn,
                totalOut,
                stock: totalIn - totalOut,
              };
            });
          return { category: cat, items };
        });
        setSummary(sum);
        setOpenCats(
          sum.reduce((acc, { category }) => {
            acc[category.id] = true;
            return acc;
          }, {} as Record<number, boolean>)
        );
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // GLOBAL TOTALS
  const totals = useMemo(() => {
    return summary.flatMap((s) => s.items).reduce(
      (acc, { totalIn, totalOut, stock }) => {
        acc.totalIn += totalIn;
        acc.totalOut += totalOut;
        acc.stock += stock;
        return acc;
      },
      { totalIn: 0, totalOut: 0, stock: 0 }
    );
  }, [summary]);

  // CSV EXPORT
  function downloadCSV() {
    const rows = [
      ["Category", "Name", "Barcode", "Stock", "Total In", "Total Out"],
      ...summary.flatMap(({ category, items }) =>
        items.map(({ product, stock, totalIn, totalOut }) => [
          category.name,
          product.name,
          product.barcode,
          String(stock),
          String(totalIn),
          String(totalOut),
        ])
      ),
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(","))
      .join("\r\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stock_summary.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return <div className="p-8 text-center">Loading stock summary…</div>;
  }

  const filtered = summary.filter((s) =>
    s.category.name.toLowerCase().includes(catFilter.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 md:p-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">Stock Summary</h1>
        <div className="flex gap-3">
          <input
            type="text"
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            placeholder="Filter categories…"
            className="w-full md:w-60 rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm placeholder-gray-400 focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={downloadCSV}
            className="whitespace-nowrap rounded-lg bg-green-600 px-4 py-2 text-sm font-medium hover:bg-green-700"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* GLOBAL TOTALS */}
      <div className="flex gap-6 bg-gray-800 rounded-lg p-4 text-white">
        <div>
          <div className="text-xs uppercase text-gray-400">Total Stock</div>
          <div className="text-xl font-semibold">{totals.stock}</div>
        </div>
        <div>
          <div className="text-xs uppercase text-gray-400">Total In</div>
          <div className="text-xl font-semibold">{totals.totalIn}</div>
        </div>
        <div>
          <div className="text-xs uppercase text-gray-400">Total Out</div>
          <div className="text-xl font-semibold">{totals.totalOut}</div>
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="space-y-8">
        {filtered.map(({ category, items }) => (
          <section key={category.id}>
            {/* category header */}
            <button
              onClick={() =>
                setOpenCats((o) => ({ ...o, [category.id]: !o[category.id] }))
              }
              className="flex w-full items-center justify-between bg-gray-900 p-4 rounded-lg hover:bg-gray-800"
            >
              <h2 className="text-2xl font-semibold text-white">
                {category.name}
              </h2>
              <span className="text-xl text-gray-400">
                {openCats[category.id] ? "−" : "+"}
              </span>
            </button>

            {/* table or card list */}
            {openCats[category.id] && (
              <>
                {items.length > 0 ? (
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full table-auto text-sm text-left md:table-fixed">
                      <thead className="bg-gray-900 text-white sticky top-0">
                        <tr>
                          <th className="p-3">Name</th>
                          <th className="p-3 hidden sm:table-cell">Barcode</th>
                          <th className="p-3 text-right">Stock</th>
                          <th className="p-3 text-right hidden md:table-cell">
                            Total In
                          </th>
                          <th className="p-3 text-right hidden lg:table-cell">
                            Total Out
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map(({ product, stock, totalIn, totalOut }) => (
                          <tr
                            key={product.id}
                            className="border-b border-gray-700 hover:bg-gray-800"
                          >
                            <td className="p-3">{product.name}</td>
                            <td className="p-3 hidden sm:table-cell">
                              {product.barcode}
                            </td>
                            <td className="p-3 text-right">{stock}</td>
                            <td className="p-3 text-right hidden md:table-cell">
                              {totalIn}
                            </td>
                            <td className="p-3 text-right hidden lg:table-cell">
                              {totalOut}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="mt-2 p-4 text-gray-400">
                    No products in this category.
                  </div>
                )}
              </>
            )}
          </section>
        ))}

        {filtered.length === 0 && (
          <div className="text-center text-gray-400">
            No matching categories.
          </div>
        )}
      </div>
    </div>
  );
}
