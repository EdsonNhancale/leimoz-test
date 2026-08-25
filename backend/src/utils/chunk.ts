const SENTENCE_SPLIT = /(?<=[.!?;:])\s+/;
const PARAGRAPH_BREAK = /\n\s*\n/;
const ARTICLE_BREAK = /\n(Artigo\s+\d+)/i;

export interface ChunkOptions {
  chunkSize?: number;
  overlap?: number;
  minChunkSize?: number;
}

export interface ChunkMetadata {
  index: number;
  startChar: number;
  endChar: number;
  sentenceCount: number;
}

export interface ChunkResult {
  content: string;
  metadata: ChunkMetadata;
}

function cleanText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\t/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^\s+|\s+$/gm, "")
    .trim();
}

function splitIntoParagraphs(text: string): string[] {
  return text.split(PARAGRAPH_BREAK).filter((p) => p.trim().length > 0);
}

function splitIntoSentences(text: string): string[] {
  return text.split(SENTENCE_SPLIT).filter((s) => s.trim().length > 0);
}

function joinSentences(sentences: string[]): string {
  return sentences.join(" ").replace(/\s+/g, " ").trim();
}

export function chunkText(
  text: string,
  options: ChunkOptions = {}
): ChunkResult[] {
  const {
    chunkSize = 4000,
    overlap = 500,
    minChunkSize = 100,
  } = options;

  const cleaned = cleanText(text);

  if (!cleaned || cleaned.length < minChunkSize) {
    if (cleaned) {
      return [
        {
          content: cleaned,
          metadata: {
            index: 0,
            startChar: 0,
            endChar: cleaned.length,
            sentenceCount: splitIntoSentences(cleaned).length,
          },
        },
      ];
    }
    return [];
  }

  const articles = cleaned.split(ARTICLE_BREAK);
  const chunks: ChunkResult[] = [];
  let currentChunk = "";
  let currentStart = 0;
  let globalOffset = 0;

  for (let i = 0; i < articles.length; i++) {
    const part = articles[i];
    const isArticleHeader = /^Artigo\s+\d+/i.test(part);

    if (isArticleHeader) {
      if (currentChunk.length + part.length + 2 > chunkSize && currentChunk.length >= minChunkSize) {
        chunks.push({
          content: currentChunk.trim(),
          metadata: {
            index: chunks.length,
            startChar: currentStart,
            endChar: currentStart + currentChunk.length,
            sentenceCount: splitIntoSentences(currentChunk).length,
          },
        });

        const overlapText = currentChunk.slice(-overlap);
        const lastSpace = overlapText.indexOf(" ");
        currentChunk = lastSpace > 0 ? overlapText.slice(lastSpace + 1) : "";
        currentStart = currentStart + currentChunk.length - overlapText.length;
      }

      currentChunk = currentChunk ? currentChunk + "\n" + part : part;
    } else {
      const paragraphs = splitIntoParagraphs(part);

      for (const paragraph of paragraphs) {
        if (currentChunk.length + paragraph.length + 2 > chunkSize && currentChunk.length >= minChunkSize) {
          chunks.push({
            content: currentChunk.trim(),
            metadata: {
              index: chunks.length,
              startChar: currentStart,
              endChar: currentStart + currentChunk.length,
              sentenceCount: splitIntoSentences(currentChunk).length,
            },
          });

          const overlapText = currentChunk.slice(-overlap);
          const lastSpace = overlapText.indexOf(" ");
          currentChunk = lastSpace > 0 ? overlapText.slice(lastSpace + 1) : "";
          currentStart = currentStart + currentChunk.length - overlapText.length;
        }

        if (paragraph.length > chunkSize) {
          const sentences = splitIntoSentences(paragraph);
          let sentenceBuffer = "";

          for (const sentence of sentences) {
            if (sentenceBuffer.length + sentence.length + 1 > chunkSize && sentenceBuffer.length >= minChunkSize) {
              if (currentChunk) {
                currentChunk += " " + sentenceBuffer;
              } else {
                currentChunk = sentenceBuffer;
              }

              if (currentChunk.length >= minChunkSize) {
                chunks.push({
                  content: currentChunk.trim(),
                  metadata: {
                    index: chunks.length,
                    startChar: currentStart,
                    endChar: currentStart + currentChunk.length,
                    sentenceCount: splitIntoSentences(currentChunk).length,
                  },
                });

                const overlapText = currentChunk.slice(-overlap);
                const lastSpace = overlapText.indexOf(" ");
                currentChunk = lastSpace > 0 ? overlapText.slice(lastSpace + 1) : "";
                currentStart = currentStart + currentChunk.length - overlapText.length;
                sentenceBuffer = "";
              } else {
                sentenceBuffer = sentence;
              }
            } else {
              sentenceBuffer = sentenceBuffer ? sentenceBuffer + " " + sentence : sentence;
            }
          }

          if (sentenceBuffer) {
            currentChunk = currentChunk ? currentChunk + " " + sentenceBuffer : sentenceBuffer;
          }
        } else {
          currentChunk = currentChunk ? currentChunk + "\n\n" + paragraph : paragraph;
        }
      }
    }
  }

  if (currentChunk.trim().length >= minChunkSize) {
    chunks.push({
      content: currentChunk.trim(),
      metadata: {
        index: chunks.length,
        startChar: currentStart,
        endChar: currentStart + currentChunk.length,
        sentenceCount: splitIntoSentences(currentChunk).length,
      },
    });
  }

  return chunks.map((chunk, i) => ({
    ...chunk,
    metadata: { ...chunk.metadata, index: i },
  }));
}

export function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    "a", "o", "e", "é", "de", "do", "da", "dos", "das", "em", "no", "na",
    "nos", "nas", "por", "para", "com", "sem", "sob", "sobre", "entre",
    "até", "desde", "como", "que", "se", "ou", "mas", "porque", "quando",
    "onde", "quem", "qual", "quais", "isto", "isso", "este", "esta",
    "esse", "essa", "aquele", "aquela", "um", "uma", "uns", "umas",
    "ao", "aos", "à", "às", "pelo", "pela", "pelos", "pelas",
    "num", "numa", "nuns", "numas", "dum", "duma", "duns", "dumas",
    "tem", "ter", "são", "ser", "foi", "será", "podem", "pode",
    "devem", "deve", "têm", "tinha", "tinha", "era", "está", "estão",
    "artigo", "artigos", "lei", "nº", "número", "alínea", "alíneas",
    "parágrafo", "parágrafos", "inciso", "incisos",
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^\w\sàáâãéêíóôõúüç]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));

  const freq = new Map<string, number>();
  for (const word of words) {
    freq.set(word, (freq.get(word) || 0) + 1);
  }

  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}
