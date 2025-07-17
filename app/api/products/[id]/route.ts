import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"  // adjust path if needed

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params

  try {
    const deleted = await prisma.product.delete({
      where: { id },
    })
    return NextResponse.json(deleted, { status: 200 })
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error)
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    )
  }
}
