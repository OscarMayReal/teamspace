-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "descdata" TEXT,
    "extrainfo" TEXT,
    "role" TEXT,
    "password" TEXT NOT NULL
);
INSERT INTO "new_User" ("descdata", "email", "extrainfo", "id", "name", "password", "role") SELECT "descdata", "email", "extrainfo", "id", "name", "password", "role" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
