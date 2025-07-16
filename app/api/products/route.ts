// app/api/products/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(products)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch products"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { barcode, name, description } = await request.json()
    if (!barcode || !name) {
      return NextResponse.json(
        { error: "barcode and name are required" },
        { status: 400 }
      )
    }
    const created = await prisma.product.create({
      data: { barcode, name, description },
    })
    return NextResponse.json(created)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create product"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
