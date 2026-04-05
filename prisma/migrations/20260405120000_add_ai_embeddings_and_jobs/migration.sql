-- Add JSON-backed embeddings and AI workflow tables.
ALTER TABLE "Gemstone"
ADD COLUMN "searchEmbedding" JSONB,
ADD COLUMN "searchEmbeddingModel" TEXT,
ADD COLUMN "searchEmbeddingUpdatedAt" TIMESTAMP(3);

ALTER TABLE "KnowledgeBase"
ADD COLUMN "searchEmbedding" JSONB,
ADD COLUMN "searchEmbeddingModel" TEXT,
ADD COLUMN "searchEmbeddingUpdatedAt" TIMESTAMP(3);

CREATE TABLE "AiJob" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "entityType" TEXT,
    "entityId" TEXT,
    "locale" TEXT,
    "input" JSONB,
    "output" JSONB,
    "error" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiJob_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AiSuggestion" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "suggestionType" TEXT NOT NULL,
    "model" TEXT,
    "input" JSONB,
    "output" JSONB NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiSuggestion_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AiJob_type_status_idx" ON "AiJob"("type", "status");
CREATE INDEX "AiJob_entityType_entityId_idx" ON "AiJob"("entityType", "entityId");
CREATE INDEX "AiJob_locale_idx" ON "AiJob"("locale");
CREATE INDEX "AiSuggestion_entityType_entityId_idx" ON "AiSuggestion"("entityType", "entityId");
CREATE INDEX "AiSuggestion_suggestionType_idx" ON "AiSuggestion"("suggestionType");
