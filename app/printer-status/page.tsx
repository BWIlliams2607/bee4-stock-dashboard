"use client"

import { useEffect, useState } from "react";
import PrinterStatusTable from "@/components/PrinterStatusTable";
import type { PrinterStatus } from "@/types/printer";

export default function PrinterStatusPage() {
  const [printers, setPrinters] = useState<PrinterStatus[]>([]);

  useEffect(() => {
    fetch("/api/printers/status")
      .then((r) => r.json())
      .then(setPrinters);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Printer Status</h1>
      <PrinterStatusTable printers={printers} />
    </div>
  );
}
