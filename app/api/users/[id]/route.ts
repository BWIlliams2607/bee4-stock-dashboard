// app/api/users/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
) {
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
