import { NextResponse } from "next/server";
import type { PrinterStatus } from "@/types/printer";

const mockStatuses: PrinterStatus[] = [
  { id: 1, name: "Printer A", model: "HP LaserJet 5000", location: "Bay 1", status: "online",      lastSeen: "2025-07-21 11:00" },
  { id: 2, name: "Laminator X", model: "LamiPro 200",  location: "Bay 2", status: "offline",     lastSeen: "2025-07-21 10:45" },
  { id: 3, name: "Printer B", model: "Epson WorkForce", location: "Bay 3", status: "maintenance", lastSeen: "2025-07-20 16:30" },
];

export async function GET() {
  return NextResponse.json(mockStatuses);
}
