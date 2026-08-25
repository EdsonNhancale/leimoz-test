import Fastify from "fastify";
import cors from "@fastify/cors";

import { config } from "./config";
import { documentRoutes } from "./routes/documents";
import { chatRoutes } from "./routes/chat";
import { whatsappRoutes } from "./routes/whatsapp";
import { prisma } from "./db";
import { checkOllamaHealth } from "./services/ollama.service";
import { startWhatsApp } from "./services/whatsapp.service";

const app = Fastify({
  logger: {
    level: process.env.NODE_ENV === "production" ? "warn" : "info",
  },
  bodyLimit: 10 * 1024 * 1024,
  requestTimeout: 300_000,
});

async function checkDatabaseConnection(): Promise<{ ok: boolean; message?: string }> {
  try {
    await prisma.$queryRawUnsafe("SELECT 1 AS alive");
    return { ok: true, message: "Postgres e Prisma OK" };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Erro ao conectar com a base de dados",
    };
  }
}

async function bootstrap() {
  const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((s) => s.trim())
    : true;

  await app.register(cors, {
    origin: allowedOrigins,
    credentials: false,
    maxAge: 86400,
  });

  app.addHook("onRequest", async (request, reply) => {
    reply.header("X-Content-Type-Options", "nosniff");
    reply.header("X-Frame-Options", "DENY");
    reply.header("Referrer-Policy", "strict-origin-when-cross-origin");
  });

  app.get("/health", async (request, reply) => {
    const [db, ollama] = await Promise.all([
      checkDatabaseConnection(),
      checkOllamaHealth(),
    ]);

    const everythingOk = db.ok && ollama.ok;

    return reply.status(everythingOk ? 200 : 503).send({
      status: everythingOk ? "ok" : "degraded",
      service: "LeiMoz API",
      version: "1.1.0",
      environment: process.env.NODE_ENV || "development",
      mockMode: config.mockMode,
      timestamp: new Date().toISOString(),
      components: {
        database: db.ok
          ? { status: "online", message: db.message }
          : { status: "offline", message: db.message },
        ollama: {
          status: ollama.status,
          message: ollama.message,
          models: ollama.models || [],
          required: {
            llm: config.llmModel,
            embedding: config.embeddingModel,
          },
        },
      },
    });
  });

  app.get("/", async () => ({
    name: "LeiMoz API",
    version: "1.1.0",
    docs: {
      health: "/health",
      chat: "POST /chat",
      documents: "GET /documents | POST /documents | GET /documents/:id",
      categories: "GET /categories",
      stats: "GET /documents/stats",
    },
  }));

  await app.register(documentRoutes, { prefix: "/" });
  await app.register(chatRoutes, { prefix: "/" });
  await app.register(whatsappRoutes, { prefix: "/" });

  try {
    await app.listen({ port: config.port, host: "0.0.0.0" });
    app.log.info(`
╔══════════════════════════════════════════════════╗
║  LeiMoz API online                               ║
╠══════════════════════════════════════════════════╣
║  🚀 Porta:        ${config.port}
║  🧪 Modo Mock:    ${config.mockMode ? "SIM" : "NÃO"}
║  🧠 Modelo LLM:   ${config.llmModel}
║  🔢 Embedding:    ${config.embeddingModel}
║  🐘 Postgres:     OK
║  🦙 Ollama URL:   ${config.ollamaUrl}
║  📱 WhatsApp:     ${config.enableWhatsApp ? "A iniciar..." : "Desactivado"}
╚══════════════════════════════════════════════════╝
    `);

    if (config.enableWhatsApp) {
      startWhatsApp().catch((err) => {
        app.log.error({ err }, "Erro ao iniciar WhatsApp");
      });
    }
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

const shutdown = async (signal: string) => {
  app.log.info(`${signal} recebido. A encerrar graciosamente...`);
  try {
    await app.close();
    await prisma.$disconnect();
    app.log.info("Serviços encerrados.");
    process.exit(0);
  } catch (err) {
    app.log.error(err, "Erro no encerramento");
    process.exit(1);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("unhandledRejection", (reason) => {
  app.log.error({ reason }, "Unhandled Rejection");
});
process.on("uncaughtException", (err) => {
  app.log.error({ err }, "Uncaught Exception");
  process.exit(1);
});

bootstrap();
