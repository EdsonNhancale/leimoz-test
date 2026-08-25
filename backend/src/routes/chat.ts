import { FastifyInstance } from "fastify";
import { answerQuestion } from "../services/rag.service";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function chatRoutes(app: FastifyInstance) {
  app.post<{
    Body: {
      question: string;
      category?: string;
      topK?: number;
      history?: ChatMessage[];
    };
  }>("/chat", {
    schema: {
      body: {
        type: "object",
        required: ["question"],
        properties: {
          question: { type: "string", minLength: 1, maxLength: 2000 },
          category: { type: "string" },
          topK: { type: "integer", minimum: 1, maximum: 20 },
          history: {
            type: "array",
            maxItems: 20,
            items: {
              type: "object",
              properties: {
                role: { type: "string", enum: ["user", "assistant"] },
                content: { type: "string", maxLength: 5000 },
              },
              required: ["role", "content"],
            },
          },
        },
      },
    },
  }, async (request, reply) => {
    const body = request.body;
    const question = (body.question || "").trim();

    if (!question) {
      return reply
        .status(400)
        .send({ message: "question é obrigatória e não pode estar vazia" });
    }

    if (question.length > 2000) {
      return reply
        .status(400)
        .send({ message: "question excede o tamanho máximo permitido (2000 caracteres)" });
    }

    try {
      const result = await answerQuestion(question, {
        category: body.category || undefined,
        topK: Math.min(20, Math.max(1, body.topK || 8)),
        history: Array.isArray(body.history)
          ? body.history
              .filter((m) => m && m.role && typeof m.content === "string")
              .slice(-12)
              .map((m) => ({ role: m.role, content: m.content }))
          : [],
      });

      return reply.send(result);
    } catch (error) {
      request.log.error({ err: error, question }, "Erro ao processar pergunta");
      const errMsg = error instanceof Error ? error.message : "Erro desconhecido";
      return reply.status(500).send({
        message: "Erro ao processar a pergunta. Tente novamente.",
        details: process.env.NODE_ENV === "development" ? errMsg : undefined,
      });
    }
  });
}
