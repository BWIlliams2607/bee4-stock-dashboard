// app/api/printers/[id]/route.ts
"use server";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { PrinterState } from "@prisma/client";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const printer = await prisma.printer.findUnique({
    where: { id: Number(params.id) },
  });
  return NextResponse.json(printer);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const data = await request.json();
  const updated = await prisma.printer.update({
    where: { id: Number(params.id) },
    data: {
      name: data.name,
      model: data.model,
      location: data.location,
      status: data.status as PrinterState,
      lastSeen: new Date(data.lastSeen),
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await prisma.printer.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ ok: true });
}
