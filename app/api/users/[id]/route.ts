// app/api/users/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, context: any) {
  // now `context` is explicitly `any`, so no more implicit‑any error
  const id = context.params.id as string;
  const { allowedPages } = (await request.json()) as {
    allowedPages: string[];
  };

  const updated = await prisma.user.update({
    where: { id },
    data: { allowedPages },
  });

  return NextResponse.json(updated);
}
