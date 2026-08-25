const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();

async function main() {
  const doc = await p.document.findFirst({
    where: { title: { contains: "Cessação" } },
    include: { chunks: { orderBy: { chunkIndex: "asc" } } },
  });

  if (!doc) {
    console.log("Documento não encontrado");
    await p.$disconnect();
    return;
  }

  console.log("Documento:", doc.title);
  console.log("Total chunks:", doc.chunks.length);
  console.log();

  for (const chunk of doc.chunks) {
    console.log("--- Chunk", chunk.chunkIndex, "---");
    console.log("Length:", chunk.content.length);
    console.log("Content:", chunk.content.substring(0, 1200));
    console.log();
  }

  await p.$disconnect();
}

main();
