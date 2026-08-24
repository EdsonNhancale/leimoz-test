# LeiMoz - Plataforma Nacional de Literacia Jurídica

> Conheça os seus direitos. Conheça os seus deveres.

Plataforma digital nacional que permite a qualquer cidadão moçambicano consultar, pesquisar e compreender a legislação nacional em linguagem simples.

## Pré-requisitos

- [Docker](https://www.docker.com/products/docker-desktop/) com Docker Compose
- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/)

## Setup Rápido

### 1. Iniciar PostgreSQL

```bash
docker compose up -d postgres
```

### 2. Configurar Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma db push
```

Executar a migration do pgvector:

```bash
psql -h localhost -U leimoz -d leimoz -f prisma/migrations/001_add_pgvector.sql
```

### 3. Popula a base de dados com dados de teste

```bash
npm run seed
```

### 4. Iniciar Backend (Mock Mode - sem Ollama)

```bash
npm run dev:mock
```

O backend estará disponível em `http://localhost:3000`

### 5. Configurar Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

## Testes Locais (sem Ollama)

O projeto inclui um modo mock que permite testar o pipeline RAG sem necessidade de Ollama:

```bash
cd backend

# Seed da base de dados
npm run seed

# Executar testes do pipeline
npm run test:mock
```

### O que é testado:

- **Embeddings determinísticos** — baseados em hash do texto
- **Pesquisa por similaridade** — cosine distance via pgvector
- **Extração de palavras-chave** — keywords em português
- **Respostas mock** — baseadas em palavras-chave da pergunta
- **Filtro por categoria** — metadata filtering

### Configuração Mock

Copie `.env.mock` para `.env`:

```bash
cp .env.mock .env
```

Variáveis importantes:

| Variável | Descrição |
|----------|-----------|
| `MOCK_MODE=true` | Ativa modo mock (sem Ollama) |
| `MOCK_MODE=false` | Usa Ollama real |

## Setup Completo (com Ollama)

Para usar com IA real:

```bash
# 1. Subir tudo
docker compose up -d

# 2. Baixar modelos
docker exec -it leimoz-ollama ollama pull llama3.2
docker exec -it leimoz-ollama ollama pull nomic-embed-text

# 3. Configurar backend
cd backend
cp .env.example .env
# Editar .env e colocar MOCK_MODE=false
npm install
npx prisma generate
npx prisma db push
psql -h localhost -U leimoz -d leimoz -f prisma/migrations/001_add_pgvector.sql

# 4. Seed com embeddings reais
npm run seed:embeddings

# 5. Iniciar
npm run dev
```

## API Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/health` | Health check |
| POST | `/documents` | Criar documento (title, content, category?) |
| GET | `/documents` | Listar documentos |
| GET | `/documents/:id` | Obter documento por ID |
| DELETE | `/documents/:id` | Eliminar documento |
| GET | `/categories` | Listar categorias |
| GET | `/documents/stats` | Estatísticas (docs, chunks, categorias) |
| POST | `/documents/:id/refresh-embeddings` | Regenerar embeddings de um documento |
| POST | `/documents/refresh-all-embeddings` | Regenerar todos os embeddings |
| POST | `/chat` | Perguntar ao assistente (question, category?, topK?) |

## Estrutura do Projeto

```
leimoz/
├── docker-compose.yml
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── scripts/
│   │   ├── seed.ts
│   │   ├── seed-embeddings.ts
│   │   └── test-rag.ts
│   └── src/
│       ├── server.ts
│       ├── config.ts
│       ├── db.ts
│       ├── routes/
│       │   ├── documents.ts
│       │   └── chat.ts
│       ├── services/
│       │   ├── ollama.service.ts
│       │   ├── embedding.service.ts
│       │   └── rag.service.ts
│       └── utils/
│           └── chunk.ts
└── frontend/
    ├── src/
    │   ├── App.tsx
    │   ├── main.tsx
    │   ├── api/
    │   ├── components/
    │   └── pages/
    ├── index.html
    ├── package.json
    └── vite.config.ts
```

## Best Practices Implementadas

1. **Text Cleaning & Chunking** — chunking por parágrafo/sentença com overlap
2. **HNSW Indexing** — índice vetorial de alta performance
3. **Hybrid Search** — combinação de vector + keyword search
4. **Re-ranking** — score combinado de similaridade + relevância
5. **Metadata Filtering** — filtro por categoria em tempo de query
6. **Embedding Refresh** — regeneração de embeddings
7. **Cosine Distance** — similaridade por cosseno

## Tecnologias

- **Backend:** Fastify, TypeScript, Prisma, pgvector
- **IA:** Ollama (llama3.2 + nomic-embed-text) ou Mock Mode
- **Base de Dados:** PostgreSQL 16 + pgvector + pg_trgm
- **Frontend:** React, Vite, TypeScript

## Licença

Projeto LeiMoz — Moçambique
