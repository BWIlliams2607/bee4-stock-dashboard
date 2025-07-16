// app/api/products/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(products)
}

export async function POST(request: Request) {
  const { barcode, name, description } = await request.json()

  if (!barcode || !name) {
    return NextResponse.json(
      { error: "barcode and name are required" },
      { status: 400 }
    )
  }

  try {
    const created = await prisma.product.create({
      data: {
        barcode,
        name,
        description,
      },
    })
    return NextResponse.json(created)
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Could not create product"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
