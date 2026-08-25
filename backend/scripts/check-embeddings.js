const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();
p.$queryRawUnsafe("SELECT count(*)::int as total, count(embedding)::int as with_embedding FROM document_chunks")
  .then(r => { console.log(JSON.stringify(r[0])); return p.$disconnect(); })
  .catch(e => { console.error(e.message); return p.$disconnect(); });
