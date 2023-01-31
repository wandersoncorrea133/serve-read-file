-- CreateTable
CREATE TABLE "Reviews" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "rating" REAL NOT NULL,
    "reviewerName" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "reviewDateTime" TEXT NOT NULL
);
