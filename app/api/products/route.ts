// app/api/products/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

interface CreateProductBody {
  barcode: string
  name: string
  description?: string
  categoryIds?: number[]
}

export async function GET() {
  const prods = await prisma.product.findMany({
    include: { categories: true },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(prods)
}

export async function POST(request: Request) {
  const {
    barcode,
    name,
    description,
    categoryIds,
  } = (await request.json()) as CreateProductBody

  if (!barcode || !name) {
    return NextResponse.json(
      { error: "Barcode and name are required" },
      { status: 400 }
    )
  }

  const ids = Array.isArray(categoryIds) ? categoryIds : []

  const newProd = await prisma.product.create({
    data: {
      barcode,
      name,
      description,
      categories: {
        connect: ids.map((id) => ({ id })),
      },
    },
    include: { categories: true },
  })

  return NextResponse.json(newProd)
}
