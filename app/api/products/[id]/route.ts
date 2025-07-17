import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // adjust import path to your Prisma client

interface Params {
  params: {
    id: string;
  };
}

export async function DELETE(
  request: NextRequest,
  { params }: Params
) {
  const { id } = params;

  try {
    const deleted = await prisma.product.delete({
      where: { id },
    });
    return NextResponse.json(deleted, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
