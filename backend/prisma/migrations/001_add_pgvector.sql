-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Enable pg_trgm for keyword/trigram search (hybrid search)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add embedding column to document_chunks
-- Dimension 768 matches nomic-embed-text model
ALTER TABLE document_chunks
ADD COLUMN embedding vector(768);

-- Add keywords column for hybrid search
ALTER TABLE document_chunks
ADD COLUMN keywords text;

-- HNSW index for vector similarity search (faster than IVFFlat for most cases)
-- Lists = rows/1000 for IVFFlat, HNSW uses m and ef_construction instead
CREATE INDEX idx_chunk_embedding_hnsw ON document_chunks
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 200);

-- Fallback IVFFlat index (uncomment if HNSW is not available)
-- CREATE INDEX idx_chunk_embedding_ivfflat ON document_chunks
-- USING ivfflat (embedding vector_cosine_ops)
-- WITH (lists = 100);

-- Trigram index on content for keyword search (hybrid search)
CREATE INDEX idx_chunk_content_trgm ON document_chunks
USING gin (content gin_trgm_ops);

-- Trigram index on keywords column
CREATE INDEX idx_chunk_keywords_trgm ON document_chunks
USING gin (keywords gin_trgm_ops);

-- Composite index for category filtering + vector search
CREATE INDEX idx_chunk_document_embedding ON document_chunks
USINg hnsw (embedding vector_cosine_ops)
WHERE embedding IS NOT NULL;

-- Index for document lookup
CREATE INDEX idx_chunk_document_id ON document_chunks (document_id);

-- Index for metadata queries on documents
CREATE INDEX idx_document_category ON documents (category);
CREATE INDEX idx_document_created ON documents (createdAt DESC);
