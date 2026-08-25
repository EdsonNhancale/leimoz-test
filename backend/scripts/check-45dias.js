const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();

async function main() {
  const chunks = await p.$queryRawUnsafe(`
    SELECT dc.content, d.title
    FROM document_chunks dc
    JOIN documents d ON d.id = dc."documentId"
    WHERE dc.content LIKE '%45 dias%' AND dc.content LIKE '%salário%'
    LIMIT 5
  `);

  chunks.forEach((c, i) => {
    console.log("--- CHUNK", i + 1, "---");
    console.log("Title:", c.title);
    console.log("Content:", c.content.substring(0, 1500));
    console.log();
  });

  await p.$disconnect();
}

main();
