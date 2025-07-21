-- CreateEnum
CREATE TYPE "PrinterState" AS ENUM ('online', 'offline', 'maintenance');

-- CreateTable
CREATE TABLE "Printer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "status" "PrinterState" NOT NULL DEFAULT 'online',
    "lastSeen" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Printer_pkey" PRIMARY KEY ("id")
);
