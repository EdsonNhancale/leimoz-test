import { generateEmbedding } from "./ollama.service";

export async function createEmbedding(text: string): Promise<number[]> {
  return generateEmbedding(text);
}
