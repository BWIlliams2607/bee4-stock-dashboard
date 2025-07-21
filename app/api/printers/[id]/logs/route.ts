import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }) {
  const logs = await prisma.printerLog.findMany({
    where: { printerId: +params.id },
    orderBy: { timestamp: "desc" },
  });
  return NextResponse.json(logs);
}

export async function POST(req: Request, { params }) {
  const { state, notes } = await req.json();
  const log = await prisma.printerLog.create({
    data: { printerId: +params.id, state, notes },
  });
  return NextResponse.json(log);
}
