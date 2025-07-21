"use server";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { PrinterState } from "@prisma/client";

// Helper to extract the dynamic `[id]` segment from request.url
function extractId(request: Request): number {
  const { pathname } = new URL(request.url);
  // pathname === "/api/printers/{id}"
  const parts = pathname.split("/");
  return Number(parts[3]);
}

export async function GET(request: Request) {
  const id = extractId(request);
  const printer = await prisma.printer.findUnique({
    where: { id },
  });
  return NextResponse.json(printer);
}

export async function PATCH(request: Request) {
  const id = extractId(request);
  const data = await request.json();
  const updated = await prisma.printer.update({
    where: { id },
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

export async function DELETE(request: Request) {
  const id = extractId(request);
  await prisma.printer.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
