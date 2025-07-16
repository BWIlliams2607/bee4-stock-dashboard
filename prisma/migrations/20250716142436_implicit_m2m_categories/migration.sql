/*
  Warnings:

  - You are about to drop the `GoodsInLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GoodsOutLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IncomingStockLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_categories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "product_categories" DROP CONSTRAINT "product_categories_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "product_categories" DROP CONSTRAINT "product_categories_productId_fkey";

-- DropTable
DROP TABLE "GoodsInLog";

-- DropTable
DROP TABLE "GoodsOutLog";

-- DropTable
DROP TABLE "IncomingStockLog";

-- DropTable
DROP TABLE "product_categories";

-- CreateTable
CREATE TABLE "goods_in_logs" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "barcode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "shelf" TEXT NOT NULL,

    CONSTRAINT "goods_in_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goods_out_logs" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "barcode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "shelf" TEXT NOT NULL,

    CONSTRAINT "goods_out_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incoming_stock_logs" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "barcode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "expectedDate" TIMESTAMP(3) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "supplier" TEXT NOT NULL,

    CONSTRAINT "incoming_stock_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoryToProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CategoryToProduct_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CategoryToProduct_B_index" ON "_CategoryToProduct"("B");

-- AddForeignKey
ALTER TABLE "_CategoryToProduct" ADD CONSTRAINT "_CategoryToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToProduct" ADD CONSTRAINT "_CategoryToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
