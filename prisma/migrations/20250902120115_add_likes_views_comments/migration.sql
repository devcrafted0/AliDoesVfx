-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Video" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "youtubeUrl" TEXT NOT NULL,
    "description" TEXT,
    "thumbnail" TEXT,
    "publishedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,
    "comments" JSONB
);
INSERT INTO "new_Video" ("createdAt", "description", "id", "publishedAt", "thumbnail", "title", "youtubeUrl") SELECT "createdAt", "description", "id", "publishedAt", "thumbnail", "title", "youtubeUrl" FROM "Video";
DROP TABLE "Video";
ALTER TABLE "new_Video" RENAME TO "Video";
CREATE UNIQUE INDEX "Video_youtubeUrl_key" ON "Video"("youtubeUrl");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
