-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Channel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "desc" TEXT,
    "icon" TEXT,
    "type" TEXT,
    "extradata" TEXT
);
INSERT INTO "new_Channel" ("desc", "extradata", "icon", "id", "name", "type") SELECT "desc", "extradata", "icon", "id", "name", "type" FROM "Channel";
DROP TABLE "Channel";
ALTER TABLE "new_Channel" RENAME TO "Channel";
CREATE TABLE "new_Group" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "desc" TEXT,
    "extradata" TEXT
);
INSERT INTO "new_Group" ("desc", "extradata", "id", "name") SELECT "desc", "extradata", "id", "name" FROM "Group";
DROP TABLE "Group";
ALTER TABLE "new_Group" RENAME TO "Group";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "descdata" TEXT,
    "extrainfo" TEXT,
    "role" TEXT,
    "password" TEXT NOT NULL
);
INSERT INTO "new_User" ("descdata", "email", "extrainfo", "id", "password", "role") SELECT "descdata", "email", "extrainfo", "id", "password", "role" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
