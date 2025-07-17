// File: app/api/products/[id]/route.ts

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"  // adjust this path if your client lives elsewhere

// Note: First arg is the standard Web Request, second is a context object
// with exactly { params: { id: string } } and an explicit return type.
export async function DELETE(
  request: Request,
  context: { params: { id: string } }
): Promise<NextResponse> {
  // pull the id out of context.params
  const { id } = context.params

  try {
    // delete the product by ID
    const deleted = await prisma.product.delete({
      where: { id },
    })
    // return the deleted record (200 OK)
    return NextResponse.json(deleted, { status: 200 })
  } catch (err) {
    console.error("Error deleting product:", err)
    // on error, return 500 with a message
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    )
  }
}
