// // app/api/products/[id]/route.ts

// import { NextResponse } from "next/server"
// import { prisma } from "@/lib/prisma"  // adjust path to your Prisma client

// export async function DELETE(
//   request: Request,
//   context: any         // <-- allow anything here so Next.js won’t complain
// ) {
//   // Grab the dynamic `id` from context.params
//   const id = String(context.params?.id)

//   try {
//     const deleted = await prisma.product.delete({
//       where: { id },
//     })
//     return NextResponse.json(deleted, { status: 200 })
//   } catch (err) {
//     console.error("DELETE /api/products/[id] error:", err)
//     return NextResponse.json(
//       { error: "Failed to delete product" },
//       { status: 500 }
//     )
//   }
// }
