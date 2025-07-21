import type { PrinterStatus } from "@/types/printer";

export default function PrinterStatusTable({
  printers,
}: {
  printers: PrinterStatus[];
}) {
  return (
    <div className="bg-gray-800 rounded-2xl p-6 shadow-lg overflow-x-auto">
      <table className="min-w-full text-white text-sm">
        <thead>
          <tr className="border-b border-gray-700">
            {["Name", "Model", "Location", "Status", "Last Seen"].map((h) => (
              <th key={h} className="p-3 text-left">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {printers.map((p) => (
            <tr key={p.id} className="border-b hover:bg-gray-700 transition">
              <td className="p-3">{p.name}</td>
              <td className="p-3">{p.model}</td>
              <td className="p-3">{p.location}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    p.status === "online"
                      ? "bg-green-600"
                      : p.status === "offline"
                      ? "bg-red-600"
                      : "bg-yellow-600"
                  }`}
                >
                  {p.status}
                </span>
              </td>
              <td className="p-3">{p.lastSeen}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
