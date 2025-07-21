// use server
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const printers = await prisma.printer.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(printers);
}

export async function POST(req: Request) {
  const { name, model, location, status, lastSeen } = await req.json();
  const printer = await prisma.printer.create({
    data: { name, model, location, status, lastSeen: new Date(lastSeen) },
  });
  return NextResponse.json(printer);
}
