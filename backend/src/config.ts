import "dotenv/config";

export const config = {
  port: Number(process.env.PORT || 3000),
  databaseUrl: process.env.DATABASE_URL!,
  ollamaUrl: process.env.OLLAMA_URL || "http://localhost:11434",
  llmModel: process.env.LLM_MODEL || "llama3.2",
  embeddingModel: process.env.EMBEDDING_MODEL || "nomic-embed-text",
  mockMode: process.env.MOCK_MODE === "true" || false,
  embeddingDimension: 768,
  enableWhatsApp: process.env.ENABLE_WHATSAPP === "true" || false,
};
