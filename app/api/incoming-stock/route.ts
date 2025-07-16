// app/api/incoming-stock/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const logs = await prisma.incomingStockLog.findMany({
    orderBy: { timestamp: "desc" },
  })
  return NextResponse.json(logs)
}

export async function POST(request: Request) {
  const { barcode, name, sku, expectedDate, quantity, supplier } =
    await request.json()

  if (!barcode || !name || !sku) {
    return NextResponse.json(
      { error: "barcode, name and sku are required" },
      { status: 400 }
    )
  }

  try {
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
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Could not create log"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
