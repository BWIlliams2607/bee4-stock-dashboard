// app/api/products/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const prods = await prisma.product.findMany({
    include: { categories: true },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(prods)
}

export async function POST(request: Request) {
  const { barcode, name, description, categoryIds } = await request.json()
  if (!barcode || !name) {
    return NextResponse.json({ error: "Barcode and name are required" }, { status: 400 })
  }
  const newProd = await prisma.product.create({
    data: {
      barcode,
      name,
      description,
      categories: {
        connect: Array.isArray(categoryIds)
          ? categoryIds.map((id: number) => ({ id }))
          : [],
      },
    },
    include: { categories: true },
  })
  return NextResponse.json(newProd)
}
