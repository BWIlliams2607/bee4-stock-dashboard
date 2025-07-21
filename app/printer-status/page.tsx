"use client";

import { useEffect, useState } from "react";
import PrinterStatusTable from "@/components/PrinterStatusTable";
import PrinterFormModal from "@/components/PrinterFormModal";
import PrinterLogsModal from "@/components/PrinterLogsModal";
import { Plus } from "lucide-react";
import type { Printer } from "@prisma/client";

export default function PrinterStatusPage() {
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [editing, setEditing] = useState<Printer | null>(null);
  const [logsFor, setLogsFor] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const fetchAll = () =>
    fetch("/api/printers")
      .then((r) => r.json())
      .then(setPrinters);

  useEffect(fetchAll, []);

  const deletePrinter = async (id: number) => {
    await fetch(`/api/printers/${id}`, { method: "DELETE" });
    fetchAll();
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Printer Status</h1>
        <button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={16} /> Add Printer
        </button>
      </div>

      {/* Table */}
      <PrinterStatusTable
        printers={printers}
        onEdit={(p) => {
          setEditing(p);
          setFormOpen(true);
        }}
        onDelete={deletePrinter}
        onViewLogs={(id) => setLogsFor(id)}
      />

      {/* Add / Edit Modal */}
      <PrinterFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        initial={editing || undefined}
        onSave={async (data) => {
          if (editing) {
            await fetch(`/api/printers/${editing.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });
          } else {
            await fetch("/api/printers", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });
          }
          setFormOpen(false);
          fetchAll();
        }}
      />

      {/* Logs Modal */}
      {logsFor !== null && (
        <PrinterLogsModal
          isOpen={logsFor !== null}
          onClose={() => setLogsFor(null)}
          printerId={logsFor}
        />
      )}
    </div>
  );
}
