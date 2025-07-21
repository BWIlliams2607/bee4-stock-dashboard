import { NextResponse } from "next/server";
import type { MaintenanceItem, OrderRequest } from "@/types/maintenance";

// mock catalog
const mockCatalog: MaintenanceItem[] = [
  { id: 1, name: "Ink Cartridge", category: "Inks", supplier: "Supplier A", inStock: 5, threshold: 2 },
  { id: 2, name: "Cleaning Kit",  category: "Printers", supplier: "Supplier B", inStock: 1, threshold: 1 },
];

export async function GET() {
  return NextResponse.json(mockCatalog);
}

export async function POST(request: Request) {
  const order: OrderRequest = await request.json();
  console.log("New maintenance order:", order);
  // here you’d insert into your DB or forward to supplier
  return NextResponse.json({ ok: true });
}
