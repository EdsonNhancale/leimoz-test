import { FastifyInstance } from "fastify";
import {
  startWhatsApp,
  getWhatsAppStatus,
  sendWhatsAppMessage,
  clearUserHistory,
} from "../services/whatsapp.service";

export async function whatsappRoutes(app: FastifyInstance) {
  app.get("/whatsapp/status", async () => {
    return getWhatsAppStatus();
  });

  app.post("/whatsapp/start", async (request, reply) => {
    const status = getWhatsAppStatus();

    if (status.connected) {
      return reply.status(400).send({
        message: "WhatsApp já está conectado",
      });
    }

    try {
      startWhatsApp().catch((err) => {
        console.error("[WhatsApp] Erro ao iniciar:", err);
      });

      return reply.send({
        message: "WhatsApp a iniciar. Escaneie o QR Code no terminal.",
      });
    } catch (err) {
      return reply.status(500).send({
        message: "Erro ao iniciar WhatsApp",
        details: err instanceof Error ? err.message : "Erro desconhecido",
      });
    }
  });

  app.post<{
    Body: { chatId: string; message: string };
  }>(
    "/whatsapp/send",
    {
      schema: {
        body: {
          type: "object",
          required: ["chatId", "message"],
          properties: {
            chatId: { type: "string" },
            message: { type: "string", minLength: 1, maxLength: 4000 },
          },
        },
      },
    },
    async (request, reply) => {
      const { chatId, message } = request.body;
      const status = getWhatsAppStatus();

      if (!status.connected) {
        return reply.status(503).send({
          message: "WhatsApp não está conectado",
        });
      }

      const sent = await sendWhatsAppMessage(chatId, message);

      if (sent) {
        return reply.send({ message: "Mensagem enviada" });
      } else {
        return reply.status(500).send({
          message: "Falha ao enviar mensagem",
        });
      }
    }
  );

  app.post<{
    Body: { chatId: string };
  }>(
    "/whatsapp/clear-history",
    {
      schema: {
        body: {
          type: "object",
          required: ["chatId"],
          properties: {
            chatId: { type: "string" },
          },
        },
      },
    },
    async (request, reply) => {
      const { chatId } = request.body;
      clearUserHistory(chatId);
      return reply.send({ message: "Histórico limpo" });
    }
  );
}
