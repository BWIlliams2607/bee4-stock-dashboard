// components/PrinterStatusTable.tsx
import type { Printer } from "@prisma/client";
import { Edit2, Trash2, Clipboard as ClipboardIcon } from "lucide-react";

export default function PrinterStatusTable({
  printers,
  onEdit,
  onDelete,
  onViewLogs,
}: {
  printers: Printer[];
  onEdit: (p: Printer) => void;
  onDelete: (id: number) => void;
  onViewLogs: (id: number) => void;
}) {
  return (
    <div className="bg-gray-800 rounded-2xl p-6 shadow-lg overflow-x-auto">
      <table className="min-w-full text-white text-sm">
        <thead>
          <tr className="border-b border-gray-700">
            {["Name", "Model", "Location", "Status", "Last Seen", "Actions"].map(
              (h) => (
                <th key={h} className="p-3 text-left">
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {printers.map((p) => (
            <tr
              key={p.id}
              className="border-b hover:bg-gray-700 transition"
            >
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
                  } text-white`}
                >
                  {p.status}
                </span>
              </td>
              <td className="p-3">
                {new Date(p.lastSeen).toLocaleString()}
              </td>
              <td className="p-3 flex items-center gap-2">
                <button
                  onClick={() => onViewLogs(p.id)}
                  className="text-yellow-400 hover:text-yellow-300"
                  title="View logs"
                >
                  <ClipboardIcon size={16} />
                </button>
                <button
                  onClick={() => onEdit(p)}
                  className="text-blue-400 hover:text-blue-300"
                  title="Edit printer"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => onDelete(p.id)}
                  className="text-red-400 hover:text-red-300"
                  title="Delete printer"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
