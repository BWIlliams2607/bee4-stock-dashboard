// app/api/products/[id]/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id)
  try {
    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: "Delete failed" }, { status: 400 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id)
  const { name, description, categoryIds } = await request.json()
  try {
    const updated = await prisma.product.update({
      where: { id },
      data: {
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
  } catch (e) {
    return NextResponse.json({ error: "Update failed" }, { status: 400 })
  }
}
