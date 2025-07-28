import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const { name } = await request.json();
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  const updated = await prisma.supplier.update({
    where: { id },
    data: { name },
  });
  return NextResponse.json(updated);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  await prisma.supplier.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
