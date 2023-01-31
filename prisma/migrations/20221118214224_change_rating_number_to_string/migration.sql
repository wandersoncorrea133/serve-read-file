-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Reviews" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "rating" TEXT NOT NULL,
    "reviewerName" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "reviewDateTime" TEXT NOT NULL
);
INSERT INTO "new_Reviews" ("id", "productId", "rating", "reviewDateTime", "reviewerName", "text") SELECT "id", "productId", "rating", "reviewDateTime", "reviewerName", "text" FROM "Reviews";
DROP TABLE "Reviews";
ALTER TABLE "new_Reviews" RENAME TO "Reviews";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
