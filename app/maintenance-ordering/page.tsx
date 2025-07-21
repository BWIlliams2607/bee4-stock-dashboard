"use client"

import { useEffect, useState } from "react";
import MaintenanceOrderList from "@/components/MaintenanceOrderList";
import MaintenanceOrderForm from "@/components/MaintenanceOrderForm";
import type { MaintenanceItem, OrderRequest } from "@/types/maintenance";

export default function MaintenanceOrderingPage() {
  const [items, setItems] = useState<MaintenanceItem[]>([]);
  
  useEffect(() => {
    fetch("/api/maintenance-orders")
      .then((r) => r.json())
      .then(setItems);
  }, []);

  const handleOrder = (order: OrderRequest) => {
    // optimistically add or display toast
    fetch("/api/maintenance-orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Maintenance Ordering</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <MaintenanceOrderList items={items} onOrder={handleOrder} />
        <MaintenanceOrderForm onSubmit={handleOrder} />
      </div>
    </div>
  );
}
