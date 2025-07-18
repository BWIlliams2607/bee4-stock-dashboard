// app/api/products/[id]/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id)
    const { barcode, name, description, categoryIds } = await req.json()

    if (!barcode || !name) {
      return NextResponse.json(
        { error: "Barcode and name are required" },
        { status: 400 }
      )
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        barcode,
        name,
        description,
        categories: {
          set: Array.isArray(categoryIds)
            ? categoryIds.map((cid: number) => ({ id: cid }))
            : [],
        },
      },
      include: { categories: true },
    })

    return NextResponse.json(updated)
  } catch (err: any) {
    console.error("PATCH /api/products/[id] error:", err)
    return NextResponse.json(
      { error: "Could not update product", detail: err.message },
      { status: 500 }
    )
  }
}
