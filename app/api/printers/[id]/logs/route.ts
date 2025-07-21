// app/api/printers/[id]/logs/route.ts
"use server";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { PrinterState } from "@prisma/client";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const logs = await prisma.printerLog.findMany({
    where: { printerId: Number(params.id) },
    orderBy: { timestamp: "desc" },
  });
  return NextResponse.json(logs);
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { state, notes }: { state: PrinterState; notes?: string } =
    await request.json();

  const log = await prisma.printerLog.create({
    data: {
      printerId: Number(params.id),
      state,
      notes,
    },
  });

  return NextResponse.json(log);
}
