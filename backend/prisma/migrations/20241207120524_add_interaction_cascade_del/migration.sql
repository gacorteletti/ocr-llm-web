-- DropForeignKey
ALTER TABLE "Interaction" DROP CONSTRAINT "Interaction_documentId_fkey";

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
