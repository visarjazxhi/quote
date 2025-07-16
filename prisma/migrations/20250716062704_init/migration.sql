-- CreateEnum
CREATE TYPE "QuoteStatus" AS ENUM ('DRAFT', 'DOWNLOADED', 'SENT');

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('WITH_OPTIONS', 'FIXED_COST', 'MANUAL_INPUT', 'RND');

-- CreateTable
CREATE TABLE "quotes" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientGroup" TEXT,
    "address" TEXT,
    "contactPerson" TEXT,
    "status" "QuoteStatus" NOT NULL DEFAULT 'DRAFT',
    "discountDescription" TEXT,
    "discountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "feesCharged" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "businessType" TEXT NOT NULL,
    "hasXeroFile" BOOLEAN NOT NULL DEFAULT false,
    "accountingSoftware" TEXT,
    "quoteId" TEXT NOT NULL,

    CONSTRAINT "entities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quote_services" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,
    "serviceType" "ServiceType" NOT NULL,
    "selectedOption" TEXT,
    "quantity" DOUBLE PRECISION,
    "customRate" DOUBLE PRECISION,
    "useCustomRate" BOOLEAN NOT NULL DEFAULT false,
    "fixedValue" DOUBLE PRECISION,
    "customDescription" TEXT,
    "customAmount" DOUBLE PRECISION,
    "customRateManual" DOUBLE PRECISION,
    "rdExpenses" DOUBLE PRECISION,
    "quoteId" TEXT NOT NULL,

    CONSTRAINT "quote_services_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "entities" ADD CONSTRAINT "entities_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "quotes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quote_services" ADD CONSTRAINT "quote_services_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "quotes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
