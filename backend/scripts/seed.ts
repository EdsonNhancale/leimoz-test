import { PrismaClient } from "@prisma/client";
import { chunkText, extractKeywords } from "../src/utils/chunk";

const prisma = new PrismaClient();

const LEGAL_DOCUMENTS = [
  {
    title: "Lei do Trabalho — Férias",
    category: "trabalho",
    content: `Artigo 50.º — Direito a férias
1. O trabalhador tem direito a um período de férias anuais remuneradas de 30 dias úteis.
2. O direito a férias adquire-se após um período de serviço efectivo de 12 meses.
3. As férias são gozadas no período que coincida com as férias anuais, salvo motivo justificado.

Artigo 51.º — Marcação de férias
1. As férias são marcadas pelo empregador, ouvida a comissão de trabalhadores.
2. O trabalhador pode solicitar a marcação de férias com 30 dias de antecedência.
3. Em caso de urgência, o trabalhador pode gozar férias imediatamente.

Artigo 52.º — Remuneração de férias
1. O trabalhador que não gozar a totalidade das férias tem direito à remuneração correspondente aos dias não gozados.
2. A remuneração de férias é paga até 5 dias antes do início do período de férias.
3. Em caso de cessação do contrato, o trabalhador tem direito à remuneração dos dias de férias não gozados.

Artigo 53.º — Férias suplementares
1. Trabalhadores com mais de 10 anos de serviço têm direito a 2 dias extras de férias por cada ano de serviço excedente.
2. O máximo de férias suplementares é de 10 dias.`,
  },
  {
    title: "Lei do Trabalho — Licença de Maternidade",
    category: "trabalho",
    content: `Artigo 76.º — Licença de maternidade
1. A trabalhadora tem direito a uma licença de maternidade de 60 dias, com remuneração integral.
2. A licença pode ser alargada em caso de complicações pós-parto, mediante atestado médico.
3. A trabalhadora deve comunicar ao empregador a gravidez com 30 dias de antecedência.

Artigo 77.º — Licença de paternidade
1. O trabalhador tem direito a uma licença de paternidade de 5 dias úteis.
2. A licença deve ser gozada nos 30 dias seguintes ao nascimento do filho.

Artigo 78.º — Protecção contra despedimento
1. A trabalhadora não pode ser despedida durante o período de licença de maternidade.
2. Esta protecção estende-se por 90 dias após o retorno ao trabalho.
3. O despedimento durante este período é nulo de pleno direito.

Artigo 79.º — Amamentação
1. A trabalhadora tem direito a dois períodos de pausa para amamentação de 30 minutos cada, durante o primeiro ano de vida do filho.`,
  },
  {
    title: "Lei do Trabalho — Despedimento",
    category: "trabalho",
    content: `Artigo 144.º — Cessação do contrato
1. O contrato de trabalho pode cessar por: acordo, justa causa, caducidade ou denúncia.
2. O despedimento só pode ser feito por justa causa ou mediante aviso prévio.

Artigo 145.º — Justa causa
1. Constituem justa causa de despedimento:
   a) Instruções ou procedimentos inadequados do trabalhador que causem prejuízos ao empregador;
   b) Desobediência ou indisciplina no trabalho;
   c) Embriaguez habitual ou em serviço;
   d) Violação de segredo profissional;
   e) Lesão de interesses patrimoniais do empregador;
   f) Condenação por crime punível com prisão;
   g) Abandono do posto de trabalho;
   h) Redução voluntária e injustificada de rendimento.

Artigo 146.º — Aviso prévio
1. O trabalhador que deseje rescindir o contrato deve dar aviso prévio de 30 dias.
2. O empregador que deseje rescindir o contrato deve dar aviso prévio de 30 dias.
3. A falta de aviso prévio obriga ao pagamento de uma indemnização equivalente à remuneração do período correspondente.

Artigo 147.º — Indemnização por despedimento
1. Em caso de despedimento sem justa causa, o trabalhador tem direito a uma indemnização de 3 meses de remuneração.
2. A indemnização é calculada com base na remuneração média dos últimos 12 meses.`,
  },
  {
    title: "Código de Estrada — Condução sem Carta",
    category: "transito",
    content: `Artigo 145.º — Condução sem carta de condução
1. Conduzir veículos automóveis sem possuir carta de condução válida constitui contra-ordenação grave.
2. A multa para conduzir sem carta é de 10.000 a 50.000 metros.2. Em caso de reincidência, a multa é duplicada.

Artigo 146.º — Carta de condução falsa
1. Utilizar carta de condução falsa ou alheia constitui crime.
2. Pena: prisão de até 2 anos ou multa até 200.000 metros.

Artigo 147.º — Apreensão do veículo
1. Em caso de condução sem carta, o veículo pode ser apreendido.
2. A apreensão pode durar até 30 dias.
3. O proprietário é responsável pelas despesas de guarda do veículo.

Artigo 148.º — Menores de idade
1. É proibido conduzir veículos automóveis a menores de 18 anos.
2. A infracção é punida com multa de 5.000 a 25.000 metros.`,
  },
  {
    title: "Código de Estrada — Velocidade",
    category: "transito",
    content: `Artigo 120.º — Limites de velocidade
1. Nas zonas urbanas, a velocidade máxima é de 50 km/h.
2. Nas estradas nacionais, a velocidade máxima é de 80 km/h.
3. Nas autoestradas, a velocidade máxima é de 120 km/h.

Artigo 121.º — Multas por excesso de velocidade
1. Exceder a velocidade máxima em até 20 km/h: multa de 1.000 a 5.000 metros.
2. Exceder a velocidade máxima em 20 a 40 km/h: multa de 5.000 a 15.000 metros.
3. Exceder a velocidade máxima em mais de 40 km/h: multa de 15.000 a 50.000 metros e apreensão da carta.

Artigo 122.º — Reincidência
1. Em caso de reincidência dentro de 12 meses, as multas são duplicadas.
2. A terceira reincidência dentro de 24 meses pode levar à suspensão da carta.`,
  },
  {
    title: "Lei da Família — Casamento",
    category: "familia",
    content: `Artigo 15.º — Idade mínima para casamento
1. A idade mínima para casar é de 18 anos para ambos os sexos.
2. Excepcionalmente, pode ser autorizado o casamento de menores de 16 anos em caso de gravidez.

Artigo 16.º — Consentimento
1. O casamento requer o consentimento livre de ambos os cônjuges.
2. É nulo o casamento celebrado sem consentimento.

Artigo 17.º — Registo do casamento
1. O casamento deve ser registado nos 30 dias seguintes à celebração.
2. O registo é obrigatório para produzir efeitos legais.

Artigo 18.º — Regime de bens
1. Os cónjuges podem escolher entre regime de comunhão de bens ou separação de bens.
2. Na ausência de escolha, aplica-se o regime de comunhão de bens.`,
  },
  {
    title: "Lei da Família — Divórcio",
    category: "familia",
    content: `Artigo 40.º — Divórcio por mútuo consentimento
1. O divórcio pode ser requerido por mútuo consentimento após 1 ano de casamento.
2. Os cónjuges devem apresentar acordo sobre:
   a) Partilha de bens;
   b) Guarda dos filhos;
   c) Pensão de alimentos.

Artigo 41.º — Divórcio por culpa
1. O divórcio pode ser requerido por um dos cónjuges em caso de:
   a) Adultério;
   b) Maus-tratos;
   c) Abandono do lar;
   d) Injúria grave.

Artigo 42.º — Pensão de alimentos
1. O cônjuge que necessite de alimentos pode requerer pensão do outro cônjuge.
2. A pensão é fixada em função das necessidades do credor e da capacidade do devedor.

Artigo 43.º — Guarda dos filhos
1. A guarda dos filhos é atribuída ao cônjuge que melhor assegure o seu bem-estar.
2. Em caso de acordo, a guarda pode ser partilhada.`,
  },
  {
    title: "Lei de Saúde — Direitos dos Doentes",
    category: "saude",
    content: `Artigo 5.º — Direitos dos doentes
1. Todo o cidadão tem direito à saúde.
2. Os doentes têm direito:
   a) À informação sobre o seu estado de saúde;
   b) Ao consentimento livre e esclarecido;
   c) À confidencialidade dos dados clínicos;
   d) À dignidade e respeito.

Artigo 6.º — Acesso a cuidados de saúde
1. O acesso aos cuidados de saúde é universal e gratuito nos serviços públicos.
2. Os cidadãos não podem ser discriminados no acesso a cuidados de saúde.

Artigo 7.º — Consentimento informado
1. Qualquer acto médico requer o consentimento informado do doente.
2. O consentimento deve ser obtido após informação clara sobre:
   a) O diagnóstico;
   b) O tratamento proposto;
   c) Os riscos e benefícios;
   d) As alternativas terapêuticas.`,
  },
  {
    title: "Lei de Saúde — Serviços Públicos",
    category: "saude",
    content: `Artigo 10.º — Serviços públicos de saúde
1. Os serviços públicos de saúde são financiados pelo Estado.
2. O acesso é gratuito para:
   a) Consultas médicas;
   b) Medicamentos essenciais;
   c) Internamentos;
   d) Cirurgias urgentes.

Artigo 11.º — Emergência
1. Os serviços de emergência são obrigatórios em todos os estabelecimentos de saúde.
2. Nenhum doente pode ser recusado em caso de emergência.

Artigo 12.º — Referenciação
1. O doente pode ser referenciado para outro estabelecimento de saúde quando necessário.
2. A referenciação deve ser documentada e acompanhada do historial clínico.`,
  },
  {
    title: "Código do Processo Penal — Prisão Preventiva",
    category: "penal",
    content: `Artigo 200.º — Requisitos da prisão preventiva
1. A prisão preventiva pode ser decretada quando:
   a) Existam indícios suficientes de prática de crime;
   b) Haja perigo de fuga;
   c) Haja perigo de destruição de provas;
   d) Haja perigo de perturbação do processo.

Artigo 201.º — Prazo da prisão preventiva
1. A prisão preventiva não pode exceder 6 meses.
2. Em casos excepcionais, pode ser prorrogada por mais 6 meses.

Artigo 202.º — Revisão da prisão preventiva
1. O juiz deve rever a necessidade da prisão preventiva a cada 30 dias.
2. O arguido pode solicitar a revisão a qualquer momento.

Artigo 203.º — Liberdade provisória
1. O arguido pode solicitar liberdade provisória mediante:
   a) Termo de identidade e residência;
   b) Fiança;
   c) Outras medidas de coacção.`,
  },
  {
    title: "Lei Orgânica do Ministério Público",
    category: "administracao",
    content: `Artigo 3.º — Funções do Ministério Público
1. O Ministério Público tem por funções:
   a) Exercer a acção penal;
   b) Defender a legalidade democrática;
   c) Promover a defesa dos direitos e interesses colectivos e difusos.

Artigo 4.º — Independência
1. O Ministério Público é independente na exercício das suas funções.
2. Os membros do Ministério Público só estão sujeitos à lei e à sua consciência.

Artigo 5.º — Princípios orientadores
1. No exercício das suas funções, o Ministério Público observa:
   a) O princípio da legalidade;
   b) O princípio da igualdade;
   c) O princípio da imparcialidade;
   d) O princípio da真相.`,
  },
];

async function main() {
  console.log("🌱 A iniciar seed da base de dados LeiMoz...\n");

  const existingDocs = await prisma.document.count();
  if (existingDocs > 0) {
    console.log(`⚠️  Já existem ${existingDocs} documentos na base de dados.`);
    console.log("   A eliminar documentos existentes...\n");
    await prisma.documentChunk.deleteMany();
    await prisma.document.deleteMany();
  }

  let totalChunks = 0;

  for (const doc of LEGAL_DOCUMENTS) {
    console.log(`📄 A processar: ${doc.title}`);

    const document = await prisma.document.create({
      data: {
        title: doc.title,
        content: doc.content,
        category: doc.category,
      },
    });

    const chunkResults = chunkText(doc.content);

    for (const chunk of chunkResults) {
      const keywords = extractKeywords(chunk.content).join(", ");

      await prisma.$executeRawUnsafe(
        `
        INSERT INTO document_chunks
          (id, "documentId", content, "chunkIndex", keywords)
        VALUES
          (gen_random_uuid(), $1, $2, $3, $4)
        `,
        document.id,
        chunk.content,
        chunk.metadata.index,
        keywords
      );
      totalChunks++;
    }

    console.log(`   ✅ ${chunkResults.length} chunks criados`);
  }

  console.log(`\n🎉 Seed concluído!`);
  console.log(`   📚 ${LEGAL_DOCUMENTS.length} documentos criados`);
  console.log(`   📝 ${totalChunks} chunks indexados`);
  console.log(`\n⚠️  Nota: Embeddings não foram gerados (mock mode).`);
  console.log(`   Para gerar embeddings reais, execute:`);
  console.log(`   MOCK_MODE=false npm run seed:embeddings`);
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
