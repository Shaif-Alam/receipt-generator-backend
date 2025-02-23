-- AlterTable
ALTER TABLE "Donation" ALTER COLUMN "deletedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Donor" ALTER COLUMN "deletedAt" DROP DEFAULT;
