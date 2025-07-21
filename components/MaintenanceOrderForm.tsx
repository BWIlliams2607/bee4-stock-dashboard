import { useState } from "react";
import type { OrderRequest } from "@/types/maintenance";

export default function MaintenanceOrderForm({
  onSubmit,
}: {
  onSubmit: (order: OrderRequest) => void;
}) {
  const [itemId, setItemId] = useState(0);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Quick Order</h2>
      <div className="space-y-4 text-white">
        <div>
          <label className="block text-sm mb-1">Item ID</label>
          <input
            type="number"
            value={itemId}
            onChange={(e) => setItemId(+e.target.value)}
            className="w-full h-10 rounded-lg bg-gray-700 px-3 text-white placeholder-gray-400"
            placeholder="Enter item ID"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(+e.target.value)}
            className="w-full h-10 rounded-lg bg-gray-700 px-3 text-white placeholder-gray-400"
            placeholder="Enter quantity"
          />
        </div>
        <button
          onClick={() => onSubmit({ itemId, quantity })}
          className="w-full h-12 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
