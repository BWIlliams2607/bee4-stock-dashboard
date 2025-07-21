-- CreateTable
CREATE TABLE "PrinterLog" (
    "id" SERIAL NOT NULL,
    "printerId" INTEGER NOT NULL,
    "state" "PrinterState" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "PrinterLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PrinterLog" ADD CONSTRAINT "PrinterLog_printerId_fkey" FOREIGN KEY ("printerId") REFERENCES "Printer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
