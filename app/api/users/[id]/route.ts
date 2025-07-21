// app/api/users/[id]/route.ts
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  const { allowedPages } = (await request.json()) as {
    allowedPages: string[];
  };

  const updated = await prisma.user.update({
    where: { id },
    data: { allowedPages },
  });

  return NextResponse.json(updated);
}
