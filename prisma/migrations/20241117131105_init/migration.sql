-- CreateTable
CREATE TABLE "Message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "contenttype" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "messagetype" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "Messageref" INTEGER
);
