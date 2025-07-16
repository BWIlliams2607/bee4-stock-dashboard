-- CreateTable
CREATE TABLE "GoodsInLog" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "barcode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "shelf" TEXT NOT NULL,

    CONSTRAINT "GoodsInLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoodsOutLog" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "barcode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "shelf" TEXT NOT NULL,

    CONSTRAINT "GoodsOutLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncomingStockLog" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "barcode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "expectedDate" TIMESTAMP(3) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "supplier" TEXT NOT NULL,

    CONSTRAINT "IncomingStockLog_pkey" PRIMARY KEY ("id")
);
