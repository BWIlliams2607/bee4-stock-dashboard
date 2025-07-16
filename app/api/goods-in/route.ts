// app/api/goods-in/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const logs = await prisma.goodsInLog.findMany({
    orderBy: { timestamp: 'desc' },
  })
  return NextResponse.json(logs)
}

export async function POST(request: Request) {
  const { barcode, name, sku, quantity, location, shelf } =
    await request.json()
  const created = await prisma.goodsInLog.create({
    data: {
      barcode,
      name,
      sku,
      quantity: parseInt(quantity, 10),
      location,
      shelf,
    },
  })
  return NextResponse.json(created)
}
