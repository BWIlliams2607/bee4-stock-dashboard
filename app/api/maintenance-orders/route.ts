// app/api/maintenance-orders/route.ts
"use server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";    // wherever your Prisma client is instantiated
import type { MaintenanceItem, OrderRequest } from "@/types/maintenance";

export async function GET() {
  const items = await prisma.maintenanceItem.findMany();
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const { itemId, quantity }: OrderRequest = await request.json();
  const order = await prisma.orderRequest.create({
    data: { itemId, quantity },
  });
  // Optionally decrement stock:
  await prisma.maintenanceItem.update({
    where: { id: itemId },
    data: { inStock: { decrement: quantity } },
  });
  return NextResponse.json(order);
}
