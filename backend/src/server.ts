import Fastify from "fastify";
import cors from "@fastify/cors";

import { config } from "./config";
import { documentRoutes } from "./routes/documents";
import { chatRoutes } from "./routes/chat";

const app = Fastify({
  logger: true,
});

async function bootstrap() {
  await app.register(cors, { origin: true });

  await app.register(documentRoutes);
  await app.register(chatRoutes);

  app.get("/health", async () => {
    return { status: "ok", service: "LeiMoz API" };
  });

  await app.listen({ port: config.port, host: "0.0.0.0" });
}

bootstrap().catch((error) => {
  app.log.error(error);
  process.exit(1);
});
