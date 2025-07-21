// app/api/printers/status/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";  // wherever you instantiate your Prisma client

export async function GET() {
  const printers = await prisma.printer.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(printers);
}
