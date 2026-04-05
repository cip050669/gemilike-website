DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'AiJobType') THEN
    CREATE TYPE "AiJobType" AS ENUM (
      'GEMSTONE_REINDEX',
      'KNOWLEDGE_REINDEX',
      'GEMSTONE_SUGGESTION',
      'IMAGE_ANALYSIS'
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'AiJobStatus') THEN
    CREATE TYPE "AiJobStatus" AS ENUM (
      'PENDING',
      'RUNNING',
      'COMPLETED',
      'FAILED'
    );
  END IF;
END $$;

ALTER TABLE "AiJob"
  ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "AiJob"
  ALTER COLUMN "type" TYPE "AiJobType" USING "type"::"AiJobType",
  ALTER COLUMN "status" TYPE "AiJobStatus" USING "status"::"AiJobStatus";

ALTER TABLE "AiJob"
  ALTER COLUMN "status" SET DEFAULT 'PENDING';
