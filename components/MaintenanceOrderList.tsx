import type { MaintenanceItem, OrderRequest } from "@/types/maintenance";

export default function MaintenanceOrderList({
  items,
  onOrder,
}: {
  items: MaintenanceItem[];
  onOrder: (order: OrderRequest) => void;
}) {
  return (
    <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Catalog</h2>
      <table className="min-w-full text-white text-sm">
        <thead>
          <tr className="border-b border-gray-700">
            {["Name", "Category", "Supplier", "In Stock", "Action"].map((h) => (
              <th key={h} className="p-2 text-left">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b hover:bg-gray-700 transition">
              <td className="p-2">{item.name}</td>
              <td className="p-2">{item.category}</td>
              <td className="p-2">{item.supplier}</td>
              <td className="p-2">{item.inStock}</td>
              <td className="p-2">
                <button
                  onClick={() => onOrder({ itemId: item.id, quantity: 1 })}
                  className="text-green-500 hover:text-green-400"
                >
                  Order 1
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
