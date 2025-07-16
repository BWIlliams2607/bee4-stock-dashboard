// app/api/goods-in/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const logs = await prisma.goodsInLog.findMany({
      orderBy: { timestamp: "desc" },
    })
    return NextResponse.json(logs)
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to fetch logs"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { barcode, name, sku, quantity, location, shelf } =
      await request.json()

    if (!barcode || !name || !sku || quantity == null) {
      return NextResponse.json(
        { error: "barcode, name, sku and quantity are required" },
        { status: 400 }
      )
    }

    const created = await prisma.goodsInLog.create({
      data: {
        barcode,
        name,
        sku,
        quantity: Number(quantity),
        location,
        shelf,
      },
    })
    return NextResponse.json(created)
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to save log"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
