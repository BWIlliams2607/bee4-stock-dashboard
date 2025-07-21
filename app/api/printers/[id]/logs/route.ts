"use server";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { PrinterState } from "@prisma/client";

// Same helper for grabbing the `{id}` segment
function extractId(request: Request): number {
  const { pathname } = new URL(request.url);
  // pathname === "/api/printers/{id}/logs"
  const parts = pathname.split("/");
  return Number(parts[3]);
}

export async function GET(request: Request) {
  const printerId = extractId(request);
  const logs = await prisma.printerLog.findMany({
    where: { printerId },
    orderBy: { timestamp: "desc" },
  });
  return NextResponse.json(logs);
}

export async function POST(request: Request) {
  const printerId = extractId(request);
  const { state, notes }: { state: PrinterState; notes?: string } =
    await request.json();

  const log = await prisma.printerLog.create({
    data: {
      printerId,
      state,
      notes,
    },
  });

  return NextResponse.json(log);
}
