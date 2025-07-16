// app/api/products/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"

interface User {
  username: string
  role: "admin" | "warehouse"
}

export async function POST(request: Request) {
  // 1. Grab and parse the cookie (await the promise!)
  const cookieStore = await cookies()
  const userCookie = cookieStore.get("bee4-user")
  if (!userCookie) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  let user: User
  try {
    user = JSON.parse(userCookie.value)
  } catch {
    return NextResponse.json({ error: "Invalid session" }, { status: 400 })
  }

  // 2. Check admin role
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 })
  }

  // 3. Read and validate body
  const { barcode, name, description } = await request.json()
  if (!barcode || !name) {
    return NextResponse.json(
      { error: "barcode and name are required" },
      { status: 400 }
    )
  }

  // 4. Create the product
  try {
    const newProd = await prisma.product.create({
      data: { barcode, name, description },
    })
    return NextResponse.json(newProd)
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Could not create product"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
