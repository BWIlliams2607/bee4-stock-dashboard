"use server";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { PrinterState } from "@prisma/client";

interface Context {
  params: {
    id: string;
  };
}

export async function GET(
  request: Request,
  { params }: Context
) {
  const logs = await prisma.printerLog.findMany({
    where: { printerId: Number(params.id) },
    orderBy: { timestamp: "desc" },
  });
  return NextResponse.json(logs);
}

export async function POST(
  request: Request,
  { params }: Context
) {
  const { state, notes }: { state: PrinterState; notes?: string } = await request.json();

  const log = await prisma.printerLog.create({
    data: {
      printerId: Number(params.id),
      state,
      notes,
    },
  });

  return NextResponse.json(log);
}
