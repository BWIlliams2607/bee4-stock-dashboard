// app/api/goods-out/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const logs = await prisma.goodsOutLog.findMany({
      orderBy: { timestamp: "desc" },
    })
    return NextResponse.json(logs)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch Goods Out logs"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { barcode, name, sku, quantity, location, shelf } = await request.json()
    if (!barcode || !name || !sku || quantity == null) {
      return NextResponse.json(
        { error: "barcode, name, sku and quantity are required" },
        { status: 400 }
      )
    }
    const created = await prisma.goodsOutLog.create({
      data: { barcode, name, sku, quantity: Number(quantity), location, shelf },
    })
    return NextResponse.json(created)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to save Goods Out log"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
