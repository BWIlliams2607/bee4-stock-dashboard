// app/api/categories/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const cats = await prisma.category.findMany({ orderBy: { name: "asc" } })
  return NextResponse.json(cats)
}

export async function POST(request: Request) {
  const { name } = await request.json()
  if (!name || !name.trim()) {
    return NextResponse.json({ error: "Category name is required" }, { status: 400 })
  }
  const newCat = await prisma.category.create({ data: { name: name.trim() } })
  return NextResponse.json(newCat)
}
