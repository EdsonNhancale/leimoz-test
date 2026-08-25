const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();

async function main() {
  const chunks = await p.$queryRawUnsafe(`
    SELECT dc.content, d.title, 
           1 - (dc.embedding <=> (SELECT embedding FROM document_chunks WHERE content ILIKE '%indemniza%' LIMIT 1)::vector) AS similarity
    FROM document_chunks dc
    JOIN documents d ON d.id = dc."documentId"
    WHERE d.category = 'trabalho'
    ORDER BY dc.embedding <=> (SELECT embedding FROM document_chunks WHERE content ILIKE '%indemniza%' LIMIT 1)::vector
    LIMIT 5
  `);

  chunks.forEach((c, i) => {
    console.log("--- CHUNK", i + 1, "---");
    console.log("Title:", c.title);
    console.log("Similarity:", c.similarity);
    console.log("Content:", c.content.substring(0, 800));
    console.log();
  });

  await p.$disconnect();
}

main();
