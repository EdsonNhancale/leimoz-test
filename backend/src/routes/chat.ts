import { FastifyInstance } from "fastify";
import { answerQuestion } from "../services/rag.service";

export async function chatRoutes(app: FastifyInstance) {
  app.post("/chat", async (request, reply) => {
    const body = request.body as {
      question: string;
      category?: string;
      topK?: number;
    };

    if (!body.question?.trim()) {
      return reply
        .status(400)
        .send({ message: "question é obrigatória" });
    }

    try {
      const result = await answerQuestion(body.question, {
        category: body.category || undefined,
        topK: body.topK || 8,
      });
      return reply.send(result);
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({
        message: "Erro ao processar a pergunta. Tente novamente.",
      });
    }
  });
}
