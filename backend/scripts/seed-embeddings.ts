import { PrismaClient } from "@prisma/client";
import { createEmbedding } from "../src/services/embedding.service";

const prisma = new PrismaClient();

async function main() {
  console.log("🔄 A gerar embeddings para chunks existentes...\n");

  const chunks = await prisma.$queryRawUnsafe<Array<{
    id: string;
    content: string;
    document: { title: string; category: string | null };
  }>>(`
    SELECT
      dc.id,
      dc.content,
      json_build_object('title', d.title, 'category', d.category) AS document
    FROM document_chunks dc
    INNER JOIN documents d ON d.id = dc."documentId"
    WHERE dc.embedding IS NULL
  `);

  if (chunks.length === 0) {
    console.log("✅ Todos os chunks já têm embeddings.");
    return;
  }

  console.log(`📊 ${chunks.length} chunks sem embeddings\n`);

  let processed = 0;
  let errors = 0;

  for (const chunk of chunks) {
    try {
      const embedding = await createEmbedding(chunk.content);
      const vector = `[${embedding.join(",")}]`;

      await prisma.$executeRawUnsafe(
        `
        UPDATE document_chunks
        SET embedding = $1::vector
        WHERE id = $2
        `,
        vector,
        chunk.id
      );

      processed++;
      process.stdout.write(
        `\r   A processar: ${processed}/${chunks.length} (${chunk.document.title})`
      );
    } catch (error) {
      errors++;
      console.error(`\n   ❌ Erro no chunk ${chunk.id}: ${error}`);
    }
  }

  console.log(`\n\n🎉 Concluído!`);
  console.log(`   ✅ ${processed} embeddings gerados`);
  if (errors > 0) {
    console.log(`   ❌ ${errors} erros`);
  }
}

main()
  .catch((e) => {
    console.error("❌ Erro:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
