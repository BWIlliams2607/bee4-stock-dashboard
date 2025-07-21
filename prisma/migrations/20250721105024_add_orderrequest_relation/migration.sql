-- CreateTable
CREATE TABLE "MaintenanceItem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "supplier" TEXT NOT NULL,
    "inStock" INTEGER NOT NULL,
    "threshold" INTEGER NOT NULL,

    CONSTRAINT "MaintenanceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderRequest" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderRequest" ADD CONSTRAINT "OrderRequest_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "MaintenanceItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
