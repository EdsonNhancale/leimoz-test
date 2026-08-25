const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();

async function main() {
  await p.documentChunk.deleteMany({
    where: { document: { category: "trabalho" } },
  });
  await p.document.deleteMany({
    where: { category: "trabalho" },
  });
  console.log("Documentos de trabalho apagados");
  await p.$disconnect();
}

main();
