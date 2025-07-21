import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";    // <-- named import

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { allowedPages } = (await request.json()) as { allowedPages: string[] };

  const updated = await prisma.user.update({
    where: { id: params.id },
    data: { allowedPages },
  });

  return NextResponse.json(updated);
}
