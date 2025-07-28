import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const shelves = await prisma.shelf.findMany();
  return NextResponse.json(shelves);
}
