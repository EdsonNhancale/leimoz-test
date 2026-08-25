import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  WASocket,
  proto,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import path from "path";
import fs from "fs";
import pino from "pino";
import qrcode from "qrcode-terminal";
import { answerQuestion } from "./rag.service";

const SESSION_DIR = path.join(process.cwd(), "whatsapp-session");
const HISTORY_MAX = 10;
const logger = pino({ level: "silent" });

type ChatHistory = {
  role: "user" | "assistant";
  content: string;
}[];

const userHistories = new Map<string, ChatHistory>();

function getUserHistory(jid: string): ChatHistory {
  if (!userHistories.has(jid)) {
    userHistories.set(jid, []);
  }
  return userHistories.get(jid)!;
}

function addToHistory(jid: string, role: "user" | "assistant", content: string) {
  const history = getUserHistory(jid);
  history.push({ role, content });
  if (history.length > HISTORY_MAX) {
    history.splice(0, history.length - HISTORY_MAX);
  }
}

function isGroupJid(jid: string): boolean {
  return jid.endsWith("@g.us");
}

function extractMessageText(message: proto.IWebMessageInfo): string {
  const msg = message.message;
  if (!msg) return "";

  if (msg.conversation) return msg.conversation;
  if (msg.extendedTextMessage?.text) return msg.extendedTextMessage.text;
  if (msg.buttonsResponseMessage?.selectedButtonId) {
    return msg.buttonsResponseMessage.selectedButtonId;
  }
  if (msg.listResponseMessage?.singleSelectReply?.selectedRowId) {
    return msg.listResponseMessage.singleSelectReply.selectedRowId;
  }

  return "";
}

function formatResponse(answer: string): string {
  let cleaned = answer
    .replace(/\*\*\*(.*?)\*\*\*/g, "_*$1*_")
    .replace(/\*\*(.*?)\*\*/g, "*$1*")
    .replace(/#{1,6}\s/g, "")
    .replace(/^\s*[-•]\s/gm, "• ")
    .trim();

  if (cleaned.length > 4000) {
    cleaned = cleaned.substring(0, 3950) + "\n\n...(resposta truncada)";
  }

  return cleaned;
}

let sock: WASocket | null = null;
let connectionState: "connecting" | "open" | "close" = "close";

export async function startWhatsApp(): Promise<void> {
  if (sock) {
    console.log("[WhatsApp] Já está em execução");
    return;
  }

  if (!fs.existsSync(SESSION_DIR)) {
    fs.mkdirSync(SESSION_DIR, { recursive: true });
  }

  const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);
  const { version } = await fetchLatestBaileysVersion();

  console.log(`[WhatsApp] Versão do WhatsApp Web: ${version.join(".")}`);

  sock = makeWASocket({
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
    version,
    logger,
    browser: ["LeiMoz Bot", "Safari", "3.0"],
    generateHighQualityLinkPreview: false,
    syncFullHistory: false,
    markOnlineOnConnect: true,
    connectTimeoutMs: 60000,
    defaultQueryTimeoutMs: undefined,
    keepAliveIntervalMs: 30000,
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("\n╔══════════════════════════════════════╗");
      console.log("║  Escaneie o QR Code com WhatsApp     ║");
      console.log("╚══════════════════════════════════════╝\n");
      qrcode.generate(qr, { small: true });
      console.log("");
    }

    if (connection === "close") {
      connectionState = "close";
      const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

      console.log(`[WhatsApp] Ligação fechada. Motivo: ${statusCode}`);

      if (shouldReconnect) {
        console.log("[WhatsApp] A reconectar em 5 segundos...");
        sock = null;
        setTimeout(() => startWhatsApp(), 5000);
      } else {
        console.log("[WhatsApp] Sessão encerrada. Execute novamente para escanear o QR.");
        sock = null;
      }
    }

    if (connection === "open") {
      connectionState = "open";
      console.log("\n╔══════════════════════════════════════╗");
      console.log("║  ✓ WhatsApp conectado com sucesso!   ║");
      console.log("╚══════════════════════════════════════╝\n");
    }
  });

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;

    for (const message of messages) {
      if (message.key.fromMe) continue;
      if (!message.message) continue;

      const jid = message.key.remoteJid!;
      if (isGroupJid(jid)) continue;
      if (jid === "status@broadcast") continue;

      const text = extractMessageText(message);
      if (!text || text.trim().length === 0) continue;

      const question = text.trim();
      console.log(`[WhatsApp] Mensagem recebida de ${jid}: ${question}`);

      try {
        await sock!.sendPresenceUpdate("composing", jid);

        const history = getUserHistory(jid);

        const result = await answerQuestion(question, {
          history: history.slice(-6),
        });

        addToHistory(jid, "user", question);
        addToHistory(jid, "assistant", result.answer);

        const response = formatResponse(result.answer);

        await sock!.sendMessage(jid, { text: response });

        console.log(`[WhatsApp] Resposta enviada para ${jid}`);
      } catch (err) {
        console.error(`[WhatsApp] Erro ao processar mensagem:`, err);

        try {
          await sock!.sendMessage(jid, {
            text: "Desculpe, ocorreu um erro ao processar a sua pergunta. Por favor, tente novamente.",
          });
        } catch {}
      }
    }
  });

  console.log("[WhatsApp] A iniciar ligação...");
  connectionState = "connecting";
}

export function getWhatsAppStatus() {
  return {
    connected: connectionState === "open",
    state: connectionState,
    sessionDir: SESSION_DIR,
  };
}

export async function sendWhatsAppMessage(jid: string, text: string): Promise<boolean> {
  if (!sock || connectionState !== "open") {
    console.error("[WhatsApp] Não é possível enviar mensagem: não conectado");
    return false;
  }

  try {
    await sock.sendMessage(jid, { text });
    return true;
  } catch (err) {
    console.error("[WhatsApp] Erro ao enviar mensagem:", err);
    return false;
  }
}

export function clearUserHistory(jid: string) {
  userHistories.delete(jid);
}
