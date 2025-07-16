// app/api/goods-out/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const logs = await prisma.goodsOutLog.findMany({
    orderBy: { timestamp: "desc" },
  })
  return NextResponse.json(logs)
}

export async function POST(request: Request) {
  const { barcode, name, sku, quantity, location, shelf } =
    await request.json()

  if (!barcode || !name || !sku) {
    return NextResponse.json(
      { error: "barcode, name and sku are required" },
      { status: 400 }
    )
  }

  try {
    const created = await prisma.goodsOutLog.create({
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
    const msg = error instanceof Error ? error.message : "Could not create log"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
