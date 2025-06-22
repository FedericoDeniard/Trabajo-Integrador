-- CreateTable
CREATE TABLE "Ticket" (
    "id" SERIAL NOT NULL,
    "user_name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductTicket" (
    "ticket_id" INTEGER NOT NULL,
    "media_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "ProductTicket_pkey" PRIMARY KEY ("ticket_id","media_id")
);

-- AddForeignKey
ALTER TABLE "ProductTicket" ADD CONSTRAINT "ProductTicket_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductTicket" ADD CONSTRAINT "ProductTicket_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
