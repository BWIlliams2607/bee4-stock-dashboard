import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }) {
  const printer = await prisma.printer.findUnique({ where: { id: +params.id }});
  return NextResponse.json(printer);
}

export async function PATCH(req: Request, { params }) {
  const data = await req.json();
  const upd = await prisma.printer.update({
    where: { id: +params.id },
    data: {
      name: data.name,
      model: data.model,
      location: data.location,
      status: data.status,
      lastSeen: new Date(data.lastSeen),
    },
  });
  return NextResponse.json(upd);
}

export async function DELETE(_: Request, { params }) {
  await prisma.printer.delete({ where: { id: +params.id } });
  return NextResponse.json({ ok: true });
}
