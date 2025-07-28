// app/api/products/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

interface CreateProductBody {
  barcode: string;
  name: string;
  description?: string;
  categoryIds?: number[];
  supplierId?: number;
  locationId?: number;
  shelfId?: number;
}

export async function POST(request: Request) {
  const {
    barcode,
    name,
    description,
    categoryIds,
    supplierId,
    locationId,
    shelfId,
  } = (await request.json()) as CreateProductBody;

  if (!barcode || !name) {
    return NextResponse.json(
      { error: "Barcode and name are required" },
      { status: 400 }
    );
  }

  const ids = Array.isArray(categoryIds) ? categoryIds : [];

  const newProd = await prisma.product.create({
    data: {
      barcode,
      name,
      description,
      supplierId, // ✅ add these
      locationId,
      shelfId,
      categories: {
        connect: ids.map((id) => ({ id })),
      },
    },
    include: { categories: true },
  });

  return NextResponse.json(newProd);
}
