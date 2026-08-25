import { FastifyInstance } from "fastify";
import { prisma } from "../db";
import { chunkText, extractKeywords } from "../utils/chunk";
import { createEmbedding } from "../services/embedding.service";

export async function documentRoutes(app: FastifyInstance) {
  app.post("/documents", async (request, reply) => {
    const body = request.body as {
      title: string;
      content: string;
      category?: string;
      metadata?: Record<string, unknown>;
    };

    if (!body.title || !body.content) {
      return reply
        .status(400)
        .send({ message: "title e content são obrigatórios" });
    }

    const document = await prisma.document.create({
      data: {
        title: body.title,
        content: body.content,
        category: body.category || null,
        metadata: body.metadata,
      },
    });

    const chunkResults = chunkText(body.content);

    for (const chunk of chunkResults) {
      const embedding = await createEmbedding(chunk.content);
      const vector = `[${embedding.join(",")}]`;
      const keywords = extractKeywords(chunk.content).join(", ");

      await prisma.$executeRawUnsafe(
        `
        INSERT INTO document_chunks
          (id, "documentId", content, "chunkIndex", embedding, keywords)
        VALUES
          (gen_random_uuid(), $1, $2, $3, $4::vector, $5)
        `,
        document.id,
        chunk.content,
        chunk.metadata.index,
        vector,
        keywords
      );
    }

    return reply.send({
      id: document.id,
      title: document.title,
      category: document.category,
      chunks: chunkResults.length,
    });
  });

  app.get("/documents", async () => {
    return prisma.document.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        category: true,
        metadata: true,
        createdAt: true,
      },
    });
  });

  app.get("/documents/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        chunks: {
          orderBy: { chunkIndex: "asc" },
          select: {
            id: true,
            content: true,
            chunkIndex: true,
          },
        },
      },
    });

    if (!document) {
      return reply.status(404).send({ message: "Documento não encontrado" });
    }

    return document;
  });

  app.delete("/documents/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    await prisma.document.delete({ where: { id } });

    return reply.send({ success: true });
  });

  app.get("/categories", async () => {
    const categories = await prisma.document.findMany({
      select: { category: true },
      distinct: ["category"],
      where: { category: { not: null } },
    });

    return categories.map((c) => c.category);
  });

  app.post("/documents/:id/refresh-embeddings", async (request, reply) => {
    const { id } = request.params as { id: string };

    const document = await prisma.document.findUnique({
      where: { id },
      include: { chunks: true },
    });

    if (!document) {
      return reply.status(404).send({ message: "Documento não encontrado" });
    }

    let refreshed = 0;

    for (const chunk of document.chunks) {
      const embedding = await createEmbedding(chunk.content);
      const vector = `[${embedding.join(",")}]`;
      const keywords = extractKeywords(chunk.content).join(", ");

      await prisma.$executeRawUnsafe(
        `
        UPDATE document_chunks
        SET embedding = $1::vector, keywords = $2
        WHERE id = $3
        `,
        vector,
        keywords,
        chunk.id
      );
      refreshed++;
    }

    return reply.send({
      documentId: document.id,
      title: document.title,
      chunksRefreshed: refreshed,
    });
  });

  app.post("/documents/refresh-all-embeddings", async (request, reply) => {
    const documents = await prisma.document.findMany({
      include: { chunks: true },
    });

    let totalRefreshed = 0;

    for (const doc of documents) {
      for (const chunk of doc.chunks) {
        const embedding = await createEmbedding(chunk.content);
        const vector = `[${embedding.join(",")}]`;
        const keywords = extractKeywords(chunk.content).join(", ");

        await prisma.$executeRawUnsafe(
          `
          UPDATE document_chunks
          SET embedding = $1::vector, keywords = $2
          WHERE id = $3
          `,
          vector,
          keywords,
          chunk.id
        );
        totalRefreshed++;
      }
    }

    return reply.send({
      documentsProcessed: documents.length,
      chunksRefreshed: totalRefreshed,
    });
  });

  app.get("/documents/stats", async () => {
    const totalDocs = await prisma.document.count();
    const totalChunks = await prisma.documentChunk.count();
    const categories = await prisma.document.groupBy({
      by: ["category"],
      _count: true,
      where: { category: { not: null } },
    });

    return {
      totalDocuments: totalDocs,
      totalChunks,
      categories: categories.map((c) => ({
        category: c.category,
        count: c._count,
      })),
    };
  });
}
