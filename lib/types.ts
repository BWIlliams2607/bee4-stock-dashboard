// lib/types.ts

/**
 * Mirror of your Prisma models, but without pulling in @prisma/client
 * (so safe to import in client components)
 */
export type Category = {
  id: number
  name: string
}

export type Supplier = {
  id: number
  name: string
}

export type Location = {
  id: number
  name: string
}

export type Shelf = {
  id: number
  name: string
}

/**
 * The shape your /api/products and PATCH/POST routes return,
 * matching your Prisma schema’s relations.
 */
export type ProductWithRelations = {
  id: number
  barcode: string
  name: string
  description: string | null
  createdAt: string     // JSON‑serialized Date
  updatedAt: string     // JSON‑serialized Date
  categories: Category[]
  defaultSupplier?: Supplier
  defaultLocation?: Location
  defaultShelf?: Shelf
}

// payload you send to your PATCH route
export type EditPayload = {
  id: number
  barcode: string
  name: string
  description?: string
  categoryIds: number[]
  supplierId?: number
  locationId?: number
  shelfId?: number
}
