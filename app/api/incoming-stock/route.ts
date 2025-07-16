// app/api/incoming-stock/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const logs = await prisma.incomingStockLog.findMany({
      orderBy: { timestamp: "desc" },
    })
    return NextResponse.json(logs)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch Incoming Stock logs"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { barcode, name, sku, expectedDate, quantity, supplier } = await request.json()
    if (!barcode || !name || !sku || expectedDate == null || quantity == null) {
      return NextResponse.json(
        { error: "barcode, name, sku, expectedDate and quantity are required" },
        { status: 400 }
      )
    }
    const created = await prisma.incomingStockLog.create({
      data: {
        barcode,
        name,
        sku,
        expectedDate: new Date(expectedDate),
        quantity: Number(quantity),
        supplier,
      },
    })
    return NextResponse.json(created)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to save Incoming Stock log"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
