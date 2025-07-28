import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface CreateSupplierBody {
  name: string;
}

export async function GET() {
  const suppliers = await prisma.supplier.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(suppliers);
}

export async function POST(request: Request) {
  const { name } = (await request.json()) as CreateSupplierBody;
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  const newSupplier = await prisma.supplier.create({ data: { name } });
  return NextResponse.json(newSupplier);
}
