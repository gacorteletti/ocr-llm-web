/*
  Warnings:

  - You are about to drop the column `title` on the `documents` table. All the data in the column will be lost.
  - Added the required column `filename` to the `documents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `documents` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_userId_fkey";

-- AlterTable
ALTER TABLE "documents" DROP COLUMN "title",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "filename" TEXT NOT NULL,
ADD COLUMN     "path" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
