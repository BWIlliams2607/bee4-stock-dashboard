import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface CreateLocationBody {
  name: string;
}

export async function GET() {
  const locations = await prisma.location.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(locations);
}

export async function POST(request: Request) {
  const { name } = (await request.json()) as CreateLocationBody;
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  const newLocation = await prisma.location.create({ data: { name } });
  return NextResponse.json(newLocation);
}
