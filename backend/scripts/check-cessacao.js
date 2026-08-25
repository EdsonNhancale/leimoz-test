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
    const has141 = chunk.content.includes("141");
    const hasIndemniza = chunk.content.toLowerCase().includes("indemniza");
    if (has141 || hasIndemniza) {
      console.log("--- Chunk", chunk.chunkIndex, "---");
      console.log(chunk.content.substring(0, 600));
      console.log();
    }
  }

  await p.$disconnect();
}

main();
