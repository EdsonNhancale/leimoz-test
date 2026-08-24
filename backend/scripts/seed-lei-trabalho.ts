import { PrismaClient } from "@prisma/client";
import { chunkText, extractKeywords } from "../src/utils/chunk";

const prisma = new PrismaClient();

const LEI_DO_TRABALHO = [
  {
    title: "Lei n.º 13/2023 — Disposições Gerais, Objecto e Âmbito",
    category: "trabalho",
    content: `Lei n.º 13/2023, de 25 de Agosto
Lei do Trabalho e revoga a Lei n.º 23/2007, de 1 de Agosto.

CAPÍTULO I
Disposições Gerais

SECÇÃO I
Objecto, Âmbito, Regimes Especiais e Definições

Artigo 1
(Objecto)
A presente Lei define os princípios gerais e estabelece o regime jurídico aplicável às relações individuais e colectivas de trabalho subordinado, prestado por conta de outrem e mediante remuneração.

Artigo 2
(Âmbito)
1. A presente Lei aplica-se às relações jurídicas de trabalho subordinado estabelecidas entre empregador e trabalhador, nacional e estrangeiro de todos os ramos de actividade, que exerçam a sua actividade no País.
2. A presente Lei aplica-se também às relações jurídicas de trabalho constituídas entre pessoas colectivas de Direito Público e os seus trabalhadores, que não sejam funcionários do Estado ou cuja relação não seja regulada por legislação específica.
3. A presente Lei aplica-se ainda, com as necessárias adaptações, às associações, organizações não-governamentais, sector cooperativo, no que respeita ao trabalhador assalariado, missões diplomáticas e consulares em relação ao trabalhador localmente contratado, organizações internacionais e outras pessoas singulares ou colectivas de Direito Privado.
4. São reguladas por legislação específica:
a) as relações jurídicas de trabalho do funcionário e agente do Estado;
b) as relações jurídicas de trabalho da pessoa ao serviço das entidades descentralizadas.

Artigo 3
(Regimes especiais)
1. São regidos por legislação especial, nomeadamente, os seguintes tipos de trabalho:
a) artístico;
b) desportivo;
c) doméstico;
d) no domicílio;
e) marítimo;
f) mineiro;
g) pesqueiro;
h) petrolífero;
i) portuário;
j) rural;
k) segurança privada.
2. São regidos por legislação especial, nomeadamente, as seguintes modalidades de prestação de trabalho:
a) avença;
b) empreitada;
c) intermitente;
d) regime livre;
e) sazonal;
f) teletrabalho;
g) agenciamento privado de emprego.
3. As relações de trabalho previstas nos números 1 e 2 do presente artigo, bem como as de outros sectores cujas actividades requeiram regimes especiais, são reguladas pela presente Lei, em tudo o que se mostrar adaptado à sua natureza e características particulares.

Artigo 4
(Definições)
Os termos usados na presente Lei constam do glossário, em anexo, que é parte integrante.`,
  },
  {
    title: "Lei n.º 13/2023 — Princípios Gerais e Protecção do Trabalhador",
    category: "trabalho",
    content: `SECÇÃO II
Princípios gerais

Subsecção I
Princípios fundamentais

Artigo 5
(Princípios e interpretação do Direito do Trabalho)
1. A interpretação e aplicação das normas da presente Lei obedecem, entre outros, ao princípio do direito ao trabalho, da estabilidade no emprego e no posto de trabalho, da alteração das circunstâncias e da não discriminação em razão da cor, raça, sexo, origem étnica, lugar de nascimento, religião, posição social e opção política.
2. Sempre que houver uma contradição entre uma norma da presente Lei ou de outros diplomas que regulam as relações de trabalho, prevalece o conteúdo que resultar da interpretação que se conforma com os princípios aqui definidos.
3. A violação culposa de qualquer princípio definido na presente Lei torna nulo e de nenhum efeito o acto jurídico praticado nessas circunstâncias, sem prejuízo da responsabilidade civil e criminal do infractor.

Subsecção II
Protecção da dignidade do trabalhador

Artigo 6
(Direito ao trabalho)
1. Todos os cidadãos têm direito ao trabalho livremente escolhido, com igualdade de oportunidades, sem discriminação de qualquer natureza, tendo por princípios básicos a capacidade e a aptidão profissional do indivíduo na escolha da profissão ou tipo de trabalho.
2. O direito ao trabalho está ligado ao dever de trabalhar, sem prejuízo das limitações decorrentes da redução da capacidade para o trabalho em virtude de doença profissional ou comum ou ainda de invalidez.
3. O trabalho deve ser realizado com estrito respeito aos direitos e garantias fundamentais do trabalhador, protegendo a sua saúde e assegurando que realizem a actividade em condições de trabalho seguro e digno.
4. É proibido o trabalho compulsivo, excepto o trabalho realizado no quadro da legislação penal.

Artigo 7
(Direitos de personalidade)
1. O empregador obriga-se a respeitar os direitos de personalidade do trabalhador.
2. Os direitos de personalidade compreendem, nomeadamente, o direito à vida, integridades física e moral, honra, bom nome, privacidade e imagem.
3. O direito à privacidade diz respeito ao acesso e divulgação de aspectos relacionados com a vida íntima e pessoal do trabalhador, como a vida familiar, afectiva, sexual, estado de saúde, convicções políticas e religiosas.
4. O exercício dos direitos e liberdades referidos no presente artigo tem por base o respeito pela ordem constitucional e pela dignidade da pessoa humana.

Artigo 8
(Protecção de dados pessoais)
1. O empregador não pode exigir ao trabalhador, no acto de contratação ou durante a execução do contrato de trabalho, a prestação de informação relativa à sua vida privada, excepto quando particulares exigências inerentes à natureza da actividade profissional o exijam por força da lei ou dos usos de cada profissão, e seja previamente fornecida, por escrito, a respectiva fundamentação.
2. A utilização dos ficheiros e o acesso informático relativo aos dados pessoais do candidato a emprego ou do trabalhador é regulada por legislação específica.
3. Os dados pessoais do trabalhador, obtidos pelo empregador sob reserva de confidencialidade, bem como qualquer informação cuja divulgação viola a privacidade daquele, não podem ser fornecidos a terceiros sem o seu consentimento expresso, salvo se razões legais assim o determinarem.

Artigo 9
(Testes e exames médicos)
1. O empregador pode, para efeitos de admissão ou de execução do contrato, exigir ao candidato ao emprego ou ao trabalhador a realização ou apresentação de teste ou exame médico, para comprovação da sua condição física ou psíquica, salvo disposição legal em contrário.
2. O médico responsável pelos testes ou exames médicos não pode comunicar ao empregador qualquer outra informação senão a que diga disser respeito à capacidade ou falta desta para o trabalho.
3. É proibida a realização de testes e exames médicos ao candidato a emprego ou ao trabalhador, visando apurar o seu estado sobre o HIV/SIDA.

Artigo 10
(Meios de vigilância à distância)
1. O empregador não deve dispor de meios de vigilância à distância no local de trabalho, mediante a utilização de equipamento tecnológico, com a finalidade de controlar o desempenho profissional do trabalhador.
2. O disposto no número 1 do presente artigo não abrange as situações que se destinem à protecção e segurança de pessoas e bens, bem como quando a sua utilização integre o processo produtivo normal da empresa ou do sector, devendo, neste caso, o empregador informar ao trabalhador, por escrito, sobre a existência e finalidade dos referidos meios, valendo estes como meio de prova.
3. Todas as provas adquiridas com violação do disposto nos números 1 e 2 do presente artigo são nulas.

Artigo 11
(Direito à confidencialidade da correspondência)
1. A correspondência de natureza pessoal do trabalhador, efectuada por qualquer meio de comunicação privada, designadamente, cartas e mensagens electrónicas, é inviolável, salvo nos casos expressamente previstos na lei.
2. O empregador pode, no regulamento interno da empresa, estabelecer regras e limites de utilização das tecnologias de informação.`,
  },
  {
    title: "Lei n.º 13/2023 — Protecção da Maternidade e Paternidade",
    category: "trabalho",
    content: `Subsecção III
Protecção da maternidade e da paternidade

Artigo 12
(Protecção da maternidade e da paternidade)
1. O Estado garante a protecção aos pais, tutores ou família de acolhimento no exercício da sua função social de manutenção, educação e cuidados de saúde dos filhos, tutelados e acolhidos sem prejuízo da sua realização profissional.
2. São garantidos à mãe trabalhadora, ao pai, ao tutor ou acolhedor, direitos especiais relacionados com a maternidade, a paternidade e o cuidado dos filhos, tutelados e acolhidos na sua infância.
3. O exercício dos direitos previstos nesta subsecção pela trabalhadora grávida, puérpera e lactante, depende da informação do respectivo estado ao empregador, podendo este solicitar os meios comprovativos do mesmo.
4. Considera-se, para efeitos do gozo dos direitos da presente subsecção:
a) trabalhadora grávida - toda a trabalhadora que informe, por escrito, ao empregador do seu estado de gestação;
b) trabalhadora puérpera - toda a trabalhadora parturiente e durante o prazo de 90 dias imediatamente a seguir ao parto, desde que informe, por escrito, ao empregador do seu estado;
c) trabalhadora lactante - toda a trabalhadora que amamenta o filho e informa o empregador do seu estado, por escrito.

Artigo 13
(Direitos especiais da mulher trabalhadora)
1. São assegurados à trabalhadora, durante o período de gravidez e após o parto, os seguintes direitos:
a) não realizar, sem diminuição da remuneração, trabalhos que sejam clinicamente desaconselháveis ao seu estado de gravidez;
b) não prestar trabalho nocturno, excepcional ou extraordinário, ou ser transferida do local habitual de trabalho, a partir do terceiro mês de gravidez, salvo a seu pedido ou se tal for necessário para a sua saúde ou a do nascituro;
c) interromper o trabalho diário para amamentação da criança, em dois períodos de meia hora, ou em período de uma hora, em caso de horário de trabalho contínuo, sem perda de remuneração, até ao máximo de um ano contado após o termo da licença por maternidade;
d) não cessar o contrato de trabalho, com excepção da caducidade e despedimento, durante a gravidez, até um ano após o termo da licença.
2. É proibido ao empregador ocupar mulheres em trabalhos que sejam prejudiciais à sua saúde ou à sua função reprodutora.
3. A mulher trabalhadora deve ser respeitada e qualquer acto contra a sua dignidade é punido por lei.
4. O trabalhador que no local de trabalho praticar actos que atentem contra a dignidade de uma mulher trabalhadora é sujeito a procedimento disciplinar.
5. É vedado ao empregador despedir, aplicar sanções ou por qualquer forma prejudicar a mulher trabalhadora por motivo de discriminação ou de exclusão.

Artigo 14
(Licença por maternidade)
1. A trabalhadora tem direito, além das férias normais, a uma licença por maternidade de 90 dias consecutivos, que pode ter início 20 dias antes da data provável do parto.
2. A licença de 90 dias, referida no número 1 do presente artigo, aplica-se também aos casos de parto a termo ou prematuro, independentemente de ter sido um nado vivo ou morto.
3. É suspensa a licença por maternidade em caso de internamento hospitalar da mãe ou da criança.
4. Por prescrição médica, pelo período de tempo necessário, para prevenir qualquer tipo de risco clínico, a trabalhadora grávida goza do direito à dispensa, sem prejuízo da licença por maternidade.
5. A remuneração da trabalhadora que esteja em licença de maternidade é regulada pelo regime da segurança social obrigatória.

Artigo 15
(Licença por paternidade)
1. O trabalhador tem direito a uma licença por paternidade de sete dias, iniciada no dia seguinte ao do nascimento da criança.
2. O trabalhador não pode aceder à licença por paternidade no período de um ano e seis meses após a anterior licença gozada.
3. A licença por paternidade é concedida por 60 dias nos casos de morte ou incapacidade da progenitora, quando comprovada por entidade sanitária competente.
4. Aos cônjuges que trabalhem para o mesmo empregador, ainda que em estabelecimentos diferentes, pode ser concedida a faculdade de comutação da licença por maternidade ou por paternidade, no interesse do trabalho.
5. O gozo da licença por paternidade é comunicado, por escrito, ao empregador.`,
  },
  {
    title: "Lei n.º 13/2023 — Contrato de Trabalho e Sujeitos",
    category: "trabalho",
    content: `CAPÍTULO III
Relação Individual de Trabalho

SECÇÃO I
Disposições gerais

Artigo 21
(Noção de contrato de trabalho)
Entende-se por contrato de trabalho o acordo pelo qual uma pessoa, trabalhador, se obriga a prestar a sua actividade a outra pessoa, empregador, sob a autoridade e direcção desta, mediante remuneração.

Artigo 22
(Presunção da relação jurídica de trabalho)
1. Relação de trabalho é o conjunto de condutas, direitos e deveres estabelecidos entre o empregador e o trabalhador, relacionados com a actividade laboral ou actividade prestada, ou que deve ser prestada, e modo como essa prestação deve ser efectivada.
2. A relação jurídica de trabalho presume-se existente sempre que o trabalhador esteja a prestar actividade remunerada, com conhecimento e sem oposição do empregador, ou quando aquele esteja na situação de subordinação económica deste.
3. Considera-se subordinação económica, para efeitos do número 2 do presente artigo, a situação em que o prestador de actividade depende do rendimento obtido do beneficiário da prestação para a sua subsistência.
4. A relação jurídica de trabalho referida no número 2 do presente artigo presume-se que foi estabelecida por tempo indeterminado.

Artigo 23
(Contratos equiparados ao contrato de trabalho)
1. Consideram-se contratos equiparados ao contrato de trabalho os contratos de prestação de serviços que, embora realizados com autonomia, colocam o prestador na situação de subordinação económica perante o empregador.
2. São convertidos em contratos de trabalho, os contratos de prestação de serviços celebrados para a realização de actividades correspondentes às vagas do quadro de pessoal da empresa.

SECÇÃO II
Sujeitos da relação individual de trabalho

Artigo 25
(Tipo de empregadores)
1. O empregador, tendo em conta o número de trabalhadores, pode ter as seguintes categorias:
a) micro empregador - o que emprega até 10 trabalhadores;
b) pequeno empregador - o que emprega 11 a 30 trabalhadores;
c) médio empregador - o que emprega 30 e um até 100 trabalhadores;
d) grande empregador - o que emprega mais de 100 trabalhadores.
2. O número de trabalhadores referido no número 1 do presente artigo corresponde à média dos existentes no ano civil em curso.
3. No primeiro ano de actividade é considerado o número de trabalhadores o do dia do início de actividade.

Artigo 29
(Admissão ao trabalho)
1. A idade mínima de admissão para o trabalho é de 18 anos.
2. Excepcionalmente, o empregador pode admitir ao trabalho o menor que tenha completado 15 anos de idade, mediante autorização do seu representante legal.
3. Nos termos do número 2 do presente artigo, o empregador não deve ocupar o menor, com idade inferior a 18 anos, em tarefas insalubres, perigosas ou as que requeiram grande esforço físico, definidas pelas autoridades competentes após consulta às organizações sindicais e de empregadores.
4. O período normal de trabalho do menor cuja idade esteja compreendida entre 15 e 18 anos não deve exceder a 25 horas semanais e cinco horas diárias.
5. Por diploma específico, o Conselho de Ministros define a natureza e condições em que, a prestação de trabalho pode ser realizada por menores com idade compreendida entre os 15 a 18 anos.`,
  },
  {
    title: "Lei n.º 13/2023 — Duração do Contrato e Período Probatório",
    category: "trabalho",
    content: `SECÇÃO IV
Duração da relação de trabalho

Artigo 42
(Duração do contrato de trabalho)
1. O contrato de trabalho pode ser celebrado por tempo indeterminado ou a prazo certo ou incerto.
2. Presume-se celebrado por tempo indeterminado o contrato de trabalho em que não se indique a respectiva duração, podendo o empregador ilidir essa presunção mediante a comprovação da temporalidade ou transitoriedade das tarefas ou actividades que constituam o objecto do contrato de trabalho.

Artigo 43
(Limites do contrato a prazo certo)
1. O contrato de trabalho a prazo certo é celebrado por um período não superior a dois anos, podendo ser renovado por duas vezes, mediante acordo das partes, sem prejuízo do regime dos micro, pequenos e médios empregadores.
2. Considera-se celebrado por tempo indeterminado o contrato de trabalho a prazo certo em que sejam excedidos os períodos da sua duração máxima ou o número de renovações previstas no número 1, podendo as partes optar pelo regime do número 4 do presente artigo.
3. Os micro, pequenos e médios empregadores podem livremente celebrar contratos a prazo certo, nos primeiros oito anos da sua actividade.
4. A celebração de contratos a prazo certo fora dos casos, especialmente, previstos no artigo 41 da presente Lei ou em violação dos limites previstos neste artigo converte-os para contrato por tempo indeterminado.

Artigo 44
(Renovação do contrato a prazo certo)
1. O contrato de trabalho a prazo certo renova-se, no final do prazo estabelecido, pelo tempo que as partes nele tiverem estabelecido expressamente.
2. Na falta da declaração expressa a que se refere o número 1 do presente artigo, o contrato de trabalho a prazo certo renova-se por período igual ao inicial, salvo estipulação contratual em contrário.
3. Considera-se como único o contrato de trabalho a prazo certo cujo período inicialmente acordado seja renovado nos termos do número 1 do presente artigo.

SECÇÃO V
Período probatório

Artigo 47
(Noção)
1. O período probatório corresponde ao tempo inicial de execução do contrato cuja duração obedece ao estipulado no artigo 48 do presente artigo.
2. No decurso do período probatório, as partes devem agir no sentido de permitir a adaptação e conhecimento recíproco, por forma a avaliar o interesse na manutenção do contrato de trabalho.

Artigo 48
(Duração do período probatório)
1. O contrato de trabalho por tempo indeterminado pode estar sujeito a um período probatório que não excede a dois meses para os trabalhadores não previstos nas alíneas seguintes:
a) três meses para os técnicos de nível médio;
b) seis meses para os técnicos de nível superior e os trabalhadores que exerçam cargos de chefia e direcção.
2. O contrato de trabalho a prazo pode estar sujeito a um período probatório que não excede a:
a) três meses nos contratos a prazo certo com duração superior a um ano;
b) um mês nos contratos a prazo certo com duração superior a seis meses e inferior a um ano;
c) 15 dias nos contratos a prazo certo com duração até seis meses;
d) 15 dias nos contratos a termo incerto quando se preveja a duração igual ou superior a 90 dias.

Artigo 49
(Redução ou exclusão do período probatório)
1. A duração do período probatório pode ser reduzida por instrumento de regulamentação colectiva de trabalho ou por contrato individual de trabalho.
2. Na falta de estipulação, por escrito, do período probatório, presume-se que as partes pretenderam excluir do contrato de trabalho.
3. Com a redução do período probatório, não é permitido o estabelecimento de um novo prazo quer para o completar, o reduzido ou para prorrogar o estabelecido.

Artigo 50
(Contagem do período probatório)
1. O período probatório é contado a partir do início da execução do contrato de trabalho.
2. Durante o período probatório, não se consideram, para efeitos de avaliação do trabalhador, os dias de faltas, ainda que justificadas, de licença ou de dispensa, bem como os de suspensão contratual, sem prejuízo do direito à remuneração, antiguidade e férias do trabalhador.

Artigo 51
(Denúncia do contrato no período probatório)
1. No decurso do período probatório, salvo estipulação em contrário, qualquer das partes pode denunciar o contrato sem necessidade de invocação de justa causa e sem direito a indemnização.
2. Para efeitos do disposto no número 1 do presente artigo, qualquer dos contratantes obriga-se a dar um aviso prévio, por escrito, à contraparte, com antecedência mínima de sete dias.
3. Para o contrato cuja duração do período probatório é de 15 dias, o pré-aviso deve ser de três dias.`,
  },
  {
    title: "Lei n.º 13/2023 — Direitos, Deveres e Remuneração",
    category: "trabalho",
    content: `SECÇÃO VII
Direitos e deveres das partes

Artigo 55
(Direitos do trabalhador)
1. Ao trabalhador é assegurada a igualdade de direitos no trabalho, independentemente da sua origem étnica, lugar de nascimento, língua, cor, raça, sexo, género, estado civil, idade, nos limites fixados por lei, condição social, ideias religiosas ou políticas.
2. São admissíveis as medidas de discriminação positiva destinadas a certos grupos vulneráveis com vista a corrigir ou a prevenir situações de desigualdade.
3. Ao trabalhador são reconhecidos direitos que não podem ser objecto de qualquer transacção, renúncia ou limitação, sem prejuízo do regime da modificação dos contratos por força da alteração das circunstâncias.
4. Compete ao Estado assegurar a eficácia dos meios preventivos e coercivos que inviabilizem e penalizem civil e criminalmente toda a violação dos direitos do trabalhador.
5. Ao trabalhador é, nomeadamente, reconhecido o direito a:
a) apresentar a sua defesa antes da aplicação de qualquer sanção disciplinar;
b) ser avaliado, periodicamente, pelo trabalho que desempenha;
c) ser tratado com correcção e respeito, sendo punidos por lei os actos que atentem contra a sua honra, bom nome, imagem pública, vida privada e dignidade;
d) ser remunerado pontualmente nos termos previstos no contrato, em função da quantidade e qualidade do trabalho que presta;
e) poder concorrer para o acesso a categorias superiores, em função da sua qualificação, experiência, resultados obtidos no trabalho, avaliações e necessidades do local de trabalho;
f) ter assegurado o descanso diário, semanal e férias anuais remuneradas;
g) beneficiar de medidas apropriadas de protecção, segurança e higiene no trabalho para assegurar a sua integridade física, moral e mental;
h) beneficiar de assistência médica e medicamentosa e de indemnização em caso de acidente de trabalho ou doença profissional;
i) dirigir-se à Inspecção Geral do Trabalho ou aos órgãos da jurisdição laboral, sempre que se vir prejudicado nos seus direitos ou denunciar actos ilícitos;
j) associar-se livremente em organizações profissionais ou sindicatos, conforme o previsto na Constituição da República;
k) beneficiar das condições adequadas de assistência em caso de incapacidade e na velhice, de acordo com a lei;
l) beneficiar de ajudas de custo ou de alimentação e alojamento diários em caso de deslocação para fora do local habitual por motivo de serviço numa distância de igual ou superior a 30 km e por um período igual ou superior a 8 horas.
6. São nulas as cláusulas do contrato de trabalho e instrumentos de regulamentação colectiva de trabalho que visam a renúncia dos direitos acima referidos.

Artigo 60
(Deveres do empregador)
1. O empregador tem, em relação ao trabalhador, em especial, os seguintes deveres:
a) respeitar os direitos e garantias, cumprindo, integralmente, todas as obrigações decorrentes do contrato de trabalho e das normas que o regem;
b) observar as normas de higiene e segurança no trabalho, bem como prevenir acidentes de trabalho e doenças profissionais e investigar as causas quando ocorram;
c) tratar com correcção e urbanidade;
d) proporcionar boas condições físicas e morais;
e) pagar uma remuneração justa em função da quantidade e qualidade do trabalho prestado;
f) atribuir uma categoria profissional correspondente às funções ou actividades que desempenha;
g) manter a categoria profissional atribuída;
h) garantir o local e o horário de trabalho previstos no contrato individual de trabalho ou nos instrumentos de regulamentação colectiva;
i) permitir o exercício da actividade sindical e não prejudicar pelo exercício de cargos sindicais;
j) não obrigar o trabalhador a adquirir bens ou a utilizar serviços fornecidos pelo empregador ou por pessoa por ele indicada;
k) promover boas práticas de saúde e nutrição no local de trabalho.
2. Ao empregador incumbe contribuir para a saúde física e psíquica do trabalhador, devendo garantir a promoção de actividades culturais e desportivas, sendo obrigatórias para os médios e grandes empregadores.

SECÇÃO XI
Remuneração do trabalho

Artigo 117
(Conceito e princípios gerais)
1. Considera-se remuneração o que, nos termos do contrato individual ou colectivo ou dos usos, o trabalhador tem direito como contrapartida do seu trabalho.
2. A remuneração compreende o salário base e todas as prestações regulares e periódicas feitas directa ou indirectamente, em dinheiro ou em espécie.
3. O empregador deve garantir a elevação do nível salarial dos trabalhadores na medida do crescimento da produção, da produtividade, do rendimento do trabalho e do desenvolvimento económico do País.
4. O Governo, ouvida a Comissão Consultiva de Trabalho, estabelece o salário ou os salários mínimos nacionais aplicáveis aos trabalhadores integrados em sectores de actividade.

Artigo 125
(Remuneração do trabalho extraordinário, excepcional e nocturno)
1. O trabalho extraordinário deve ser pago com uma importância correspondente à remuneração do trabalho normal, acrescida de cinquenta por cento, se prestado até às 24 horas, e de cem por cento, para além das 20 horas até à hora de início do período normal de trabalho do dia seguinte.
2. O trabalho excepcional deve ser pago com uma importância correspondente à remuneração do trabalho normal, acrescida de cem por cento.
3. O trabalho nocturno deve ser retribuído com um acréscimo de vinte e cinco por cento relativamente à remuneração do trabalho correspondente prestado durante o dia.
4. O presente regime de remunerações também se aplica ao trabalho em turnos, com as necessárias adaptações.`,
  },
  {
    title: "Lei n.º 13/2023 — Férias, Descanso e Ausências",
    category: "trabalho",
    content: `SECÇÃO X
Interrupção da prestação do trabalho

Artigo 104
(Descanso semanal)
1. O trabalhador tem direito a descanso semanal de, pelo menos, 24 horas consecutivas em dia que, normalmente, é domingo.
2. O dia de descanso semanal pode deixar de coincidir com o domingo em caso de:
a) ser necessário ter trabalhador para assegurar a continuidade dos serviços que não podem ser interrompidos;
b) trabalhadores de estabelecimentos de venda ao público ou de prestação de serviços;
c) pessoal dos serviços de limpeza e de trabalhos preparatórios e complementares que devem ser efectuados no dia de descanso dos restantes trabalhadores;
d) trabalhadores cuja actividade, pela sua natureza, se deva exercer ao domingo.

Artigo 105
(Feriados obrigatórios)
1. Os feriados nacionais são dias de suspensão do trabalho para os trabalhadores em todo o território nacional.
2. São considerados feriados, sem prejuízo de outros que forem fixados por lei, os seguintes:
a) 1 de Janeiro – Ano novo;
b) 3 de Fevereiro – Dia dos Heróis Moçambicanos;
c) 7 de Abril – Dia da Mulher Moçambicana;
d) 1 de Maio – Dia Internacional do Trabalhador;
e) 25 de Junho – Dia da Independência Nacional;
f) 7 de Setembro – Dia dos Acordos de Lusaka;
g) 25 de Setembro – Dia das Forças Armadas;
h) 4 de Outubro – Dia da Paz e Reconciliação Nacional;
i) 25 de Dezembro – Dia da Família.

Artigo 107
(Direito a férias)
1. O direito do trabalhador a férias remuneradas é irrenunciável e em nenhum caso lhe pode ser negado.
2. Sem prejuízo do disposto no artigo 109, as férias podem ser gozadas no decurso do ano civil a que se referem ou no ano seguinte.
3. Excepcionalmente, as férias podem ser substituídas por uma remuneração suplementar, por conveniência do empregador ou do trabalhador, mediante acordo de ambos, devendo o trabalhador gozar, pelo menos, seis dias úteis.

Artigo 108
(Duração do período de férias)
1. O trabalhador tem direito a 12 dias de férias remuneradas no primeiro ano de trabalho efectivo e a 30 dias nos anos subsequentes.
2. Considera-se serviço efectivo a duração do período normal de trabalho acrescida do tempo correspondente aos dias feriados, de descanso semanal, de férias, das faltas justificadas, complementares e de tolerância de ponto.
3. A duração do período de férias de trabalhadores com contrato a prazo certo inferior a um ano e superior a três meses, corresponde a um dia por cada mês de serviço efectivo.
4. Os períodos de férias abrangem os dias de antecipação, adiamento e acumulação de férias.
5. As férias contam em dias de calendário.

Artigo 112
(Conceito e tipo de faltas)
1. Considera-se falta, a ausência do trabalhador no local de trabalho e durante o período a que está obrigado a prestar a sua actividade.
2. As faltas podem ser justificadas ou injustificadas.
3. São consideradas faltas justificadas, as seguintes:
a) cinco dias, por motivo de casamento;
b) cinco dias, por motivo de falecimento de cônjuge, companheira ou companheiro da união de facto, pai, mãe, filhos, enteados, irmãos, avós, netos, padrasto, madrasta, sogros, genros e noras;
c) dois dias, por motivo de falecimento de tios, primos, sobrinhos, netos e cunhados;
d) em caso de impossibilidade de prestar trabalho devido a facto não imputável ao trabalhador, nomeadamente doença ou acidente;
e) as dadas por trabalhadores como mães e/ou pais acompanhantes dos seus próprios filhos ou outros menores sob a sua responsabilidade internados em estabelecimento hospitalar;
f) as dadas por convalescença de mulheres trabalhadoras em caso de aborto antes de sete meses anteriores ao parto previsível;
g) as ausências do trabalhador para prestar assistência a cônjuge, companheira ou companheiro da união de facto, filhos tutelados e acolhidos, pai, mãe, enteados, irmãos, avós, padrasto, madrasta, sogros, genros e noras, em caso de doença ou acidente;
h) outras, prévia ou posteriormente autorizadas pelo empregador, para participação em actividades desportivas e culturais.
4. São consideradas injustificadas todas as faltas não previstas no número 3 do presente artigo.
5. As faltas justificadas quando previsíveis, devem ser obrigatoriamente comunicadas ao empregador com antecedência mínima de dois dias.

Artigo 115
(Efeitos das faltas e ausências injustificadas)
1. As faltas injustificadas determinam sempre a perda da remuneração correspondente ao período de ausência, o qual é igualmente descontado nas férias e na antiguidade do trabalhador, sem prejuízo de eventual procedimento disciplinar.
2. As faltas injustificadas por três dias consecutivos ou seis dias interpolados num semestre ou a alegação de um motivo justificativo comprovadamente falso podem ser objecto de procedimento disciplinar.
3. A ausência não justificada por 15 dias consecutivos constitui presunção de abandono do posto de trabalho, dando lugar ao procedimento disciplinar.`,
  },
  {
    title: "Lei n.º 13/2023 — Cessação do Contrato e Indemnização",
    category: "trabalho",
    content: `CAPÍTULO IV
Suspensão e Cessação da Relação de Trabalho

SECÇÃO II
Cessação da relação de trabalho

Artigo 135
(Formas de cessação do contrato de trabalho)
1. O contrato de trabalho pode cessar por:
a) caducidade;
b) acordo revogatório;
c) denúncia por qualquer das partes;
d) rescisão por qualquer das partes contratantes com justa causa.
2. A cessação da relação de trabalho determina a extinção das obrigações das partes relativas ao cumprimento do vínculo laboral e a constituição de direitos e deveres, nos casos especialmente previstos na lei.
3. A cessação do contrato de trabalho produz efeitos jurídicos a partir do conhecimento da mesma por parte do outro contratante, mediante documento escrito.

Artigo 138
(Justa causa de rescisão do contrato de trabalho)
1. Considera-se, em geral, justa causa para rescisão do contrato de trabalho os factos ou circunstâncias graves que impossibilitem, moral ou materialmente, a subsistência da relação contratual estabelecida.
2. O empregador ou o trabalhador pode invocar justa causa para rescindir o contrato de trabalho, reconhecendo à contraparte o direito de impugnar a justa causa, dentro do prazo de seis meses a contar da data do conhecimento da rescisão.
3. A justa causa invocada pelo empregador extingue a relação individual ou colectiva de trabalho.
4. Constituem, em especial, justa causa, por parte do empregador:
a) a manifesta inaptidão do trabalhador para o serviço ajustado, verificada após o período probatório;
b) a violação culposa e grave dos deveres laborais pelo trabalhador;
c) a detenção ou prisão se, devido à natureza das funções do trabalhador, prejudicar o normal funcionamento dos serviços;
d) a rescisão do contrato por motivos económicos da empresa, que podem ser tecnológicos, estruturais ou de mercado, previstos no artigo 139 da presente Lei.
5. Constituem, em especial, justa causa, por parte do trabalhador:
a) a necessidade de cumprir quaisquer obrigações legais incompatíveis com a continuação no serviço e não confere direito à indemnização;
b) a ocorrência de comportamento do empregador que viole culposamente os direitos e garantias legais e convencionais do trabalhador.

Artigo 139
(Rescisão do contrato com justa causa por iniciativa do trabalhador)
1. O trabalhador pode rescindir o contrato de trabalho, com justa causa, mediante comunicação prévia de, pelo menos, sete dias, indicando, expressa e inequivocamente, os factos que a fundamentam.
2. A rescisão do contrato de trabalho por tempo indeterminado, com justa causa por parte do trabalhador, confere-lhe o direito à indemnização correspondente a 45 dias de salário por cada ano de serviço e, de forma rateada, por fracção de tempo inferior a 12 meses.
3. A rescisão do contrato de trabalho a prazo certo, com justa causa por parte do trabalhador, confere-lhe o direito à indemnização correspondente às remunerações que se venceriam entre a data da cessação e a convencionada para o fim do prazo do contrato.
4. O trabalhador que infringir o prazo fixado no número 1, do presente artigo, deve pagar ao empregador uma multa correspondente a sete dias de salário, a deduzir da indemnização a que tem direito.

Artigo 141
(Rescisão do contrato por iniciativa do empregador com aviso prévio)
1. O empregador pode rescindir um ou mais contratos de trabalho, com aviso prévio, desde que essa medida se funde em motivos estruturais, tecnológicos, ou de mercado e se mostre essencial à competitividade, saneamento económico, reorganização administrativa ou produtiva da empresa.
2. Para efeitos da presente Lei, considera-se:
a) motivos estruturais - os que se reportam à reorganização ou reestruturação da produção, à mudança de actividade ou à falta de recursos económicos e financeiros de que podem resultar um excesso de postos de trabalho;
b) motivos tecnológicos – os referentes à introdução de nova tecnologia, novos processos ou métodos de trabalho ou à informatização de serviços que pode obrigar à redução de pessoal;
c) motivos de mercado – aqueles que têm a ver com dificuldades de colocação dos bens ou serviços no mercado ou com a redução da actividade da empresa.
3. A rescisão do contrato de trabalho, com fundamento nos motivos previstos no número 2 do presente artigo, confere ao trabalhador o direito a indemnização, equivalente a:
a) 30 dias de salário por cada ano de serviço, se o salário base do trabalhador, incluindo o bónus de antiguidade, corresponder ao valor compreendido entre um a sete salários mínimos do sector de actividade;
b) 15 dias de salário por cada ano de serviço, se o salário base do trabalhador, incluindo o bónus de antiguidade, corresponder ao valor compreendido entre mais de sete a dezoito salários mínimos do sector de actividade;
c) cinco dias de salário por cada ano de serviço, se o salário base do trabalhador, incluindo o bónus de antiguidade, corresponder ao valor de mais de 18 salários mínimos do sector de actividade.

Artigo 143
(Despedimento colectivo)
Considera-se despedimento colectivo sempre que o empregador, simultanea ou sucessivamente, no período de 3 meses, invocando motivos estruturais, económicos, tecnológicos e de mercado, fazer cessar mais de oito contratos de trabalho, nas micro e pequenas empresas e mais de 10 contratos de trabalho nas médias e grandes empresas.

Artigo 146
(Efeitos da improcedência da rescisão)
1. A decisão judicial ou arbitral de nulidade da rescisão do contrato de trabalho com justa causa, por iniciativa do trabalhador, constitui obrigação de pagar ao empregador uma indemnização correspondente à metade da indemnização prevista nos números 2 e 3 do artigo 139 da presente Lei.
2. Declarados judicialmente ou por entidade equiparável improcedentes os fundamentos invocados para a rescisão do contrato de trabalho, o trabalhador é reintegrado no posto de trabalho com direito ao pagamento do valor correspondente às remunerações vencidas entre a data da cessação do contrato e a da efectiva reintegração, até ao máximo de seis meses, deduzido o valor que houver recebido, se for o caso, a título de indemnização no momento do despedimento.
3. Por opção expressa do trabalhador ou quando circunstâncias objectivas impossibilitem a sua reintegração, o empregador fica obrigado a pagar uma indemnização calculada nos termos do artigo 139 da presente Lei, contando para a antiguidade todo o tempo decorrido entre a data da cessação e a da sentença que declarou a sua nulidade, até ao máximo de seis meses.

Artigo 147
(Certificado de trabalho)
1. Sempre que cesse a relação de trabalho, independentemente do motivo da cessação, o empregador deve emitir ao trabalhador um certificado de trabalho onde conste a indicação do período durante o qual este esteve ao seu serviço, nível de capacidade profissional adquirida e o cargo ou cargos que desempenhou.
2. O certificado não pode conter quaisquer outras referências, salvo pedido escrito do trabalhador nesse sentido.
3. Se o trabalhador não estiver de acordo com o teor da informação, pode, no prazo de 30 dias, recorrer aos órgãos competentes para que se façam as modificações apropriadas, se for caso disso.`,
  },
  {
    title: "Lei n.º 13/2023 — Higiene, Segurança e Acidentes de Trabalho",
    category: "trabalho",
    content: `CAPÍTULO VI
Higiene, Saúde e Segurança no Trabalho

SECÇÃO I
Saúde e segurança no trabalho

Artigo 220
(Princípios gerais)
1. Todos os trabalhadores têm direito à prestação de trabalho em condições de higiene, saúde e segurança, incumbindo ao empregador a criação e desenvolvimento de meios adequados à protecção da sua integridade física e mental e à constante melhoria das condições de trabalho.
2. O empregador deve proporcionar aos seus trabalhadores boas condições físicas, ambientais e morais de trabalho, informar sobre os riscos do seu posto de trabalho e instruir sobre o adequado cumprimento das regras de higiene e segurança no trabalho.
3. Os trabalhadores devem velar pela sua própria segurança e saúde e a de outras pessoas que podem ser afectadas pelos seus actos e omissões no trabalho, assim como devem colaborar com o seu empregador em matéria de higiene e segurança no trabalho, quer individualmente, quer através da comissão de segurança no trabalho ou de outras estruturas adequadas.
4. O trabalhador que viole de forma culposa as regras de higiene e segurança no trabalho incorre em responsabilidade disciplinar nos termos da presente Lei.
5. A responsabilidade disciplinar referida no número 4 do presente artigo deve ser graduada tendo em conta o risco que o trabalhador criou no local de trabalho.
6. O empregador deve adoptar todas as precauções adequadas para garantir que todos os postos de trabalho, assim como os seus acessos e saídas sejam seguros e estejam isentos de riscos para a segurança e saúde dos trabalhadores.
7. Sempre que necessário, o empregador deve fornecer equipamentos de protecção e roupas de trabalho apropriados com vista a prevenir os riscos de acidentes ou efeitos prejudiciais à saúde dos trabalhadores.
8. O empregador e os trabalhadores são obrigados a cumprir pontual e rigorosamente as normas legais e regulamentares, bem como as directivas e instruções das entidades competentes em matéria de higiene e segurança no trabalho.
9. A falta de adopção de medidas de higiene e segurança no trabalho, nas actividades com risco excepcional, por parte do empregador, é qualificado como contravenção laboral grave e é punida com multa e suspensão da actividade nos termos da regulamentação específica.
10. Dentro dos limites da lei, as empresas podem estabelecer políticas de prevenção e combate ao HIV/SIDA e outras doenças endémicas, no local de trabalho, devendo respeitar, entre outros, o princípio do consentimento do trabalhador para o efeito de testes de seroprevalência.

SECÇÃO III
Acidentes de trabalho e doenças profissionais

Artigo 226
(Noção)
1. Acidente de trabalho é o sinistro que se verifica, no local e durante o tempo do trabalho, desde que produza, directa ou indirectamente, no trabalhador subordinado lesão corporal, perturbação funcional ou doença de que resulte a morte ou redução na capacidade de trabalho ou de ganho.
2. Considera-se ainda acidente de trabalho o que ocorra:
a) na ida ou regresso do local de trabalho, quando utilizado meio de transporte fornecido pelo empregador, ou quando o acidente seja consequência de particular perigo do percurso normal ou de outras circunstâncias que tenham agravado o risco do mesmo percurso;
b) antes ou depois da prestação do trabalho, desde que directamente relacionado com a preparação ou termo dessa prestação;
c) por ocasião da prestação de trabalho fora do local e tempo do trabalho normal, se verificar enquanto o trabalhador executa ordens ou realiza serviços sob direcção e autoridade do empregador;
d) na execução de serviços, ainda que não profissionais, fora do local e tempo de trabalho, prestados espontaneamente pelo trabalhador ao empregador de que possa resultar proveito económico para este;
e) outras actividades organizadas pela entidade empregadora.
3. Se a lesão resultante do acidente de trabalho ou doença profissional não for reconhecida imediatamente, compete à vítima ou aos beneficiários legais provar o nexo de causalidade.

Artigo 232
(Dever de assistência)
1. Em caso de acidente de trabalho ou doença profissional, o empregador deve prestar ao trabalhador sinistrado ou doente os primeiros socorros e fornecer-lhe transporte para um centro médico ou hospitalar onde possa ser tratado.
2. O trabalhador sinistrado tem direito à assistência médica e medicamentosa e outros cuidados necessários, bem como ao fornecimento e renovação normal dos aparelhos de prótese e ortopedia, de acordo com a natureza da lesão sofrida, por conta do empregador ou instituições de seguros contra acidentes ou doenças profissionais.
3. São por conta do empregador os custos de transporte, alojamento e alimentação, dentro ou fora do País do acompanhante do trabalhador sinistrado.
4. A fim de acorrer às necessidades imprevistas, por virtude do seu estado, o trabalhador sinistrado pode, a seu pedido, beneficiar de um adiantamento do valor correspondente a um mês de indemnização ou pensão.
5. O empregador suporta os encargos resultantes do funeral do trabalhador sinistrado.

Artigo 233
(Direito à reparação)
1. Todo o trabalhador por conta de outrem tem direito à reparação, em caso de acidente de trabalho ou doença profissional, salvo quando resulte de embriaguez, de estado de drogado ou de intoxicação voluntária da vítima.
2. O direito à reparação, por virtude de acidente de trabalho ou doença profissional, pressupõe um esforço do empregador para ocupar o trabalhador sinistrado num posto de trabalho compatível com a sua capacidade residual.
3. Na impossibilidade de enquadrar o trabalhador nos termos descritos no número 2 do presente artigo, o empregador pode rescindir o contrato, devendo neste caso indemnizar o trabalhador nos termos do artigo 139 da presente Lei.
4. A predisposição patológica do sinistrado, a regular em legislação específica, não exclui o direito à reparação, se for conhecida do empregador.

Artigo 235
(Seguro colectivo por risco profissional)
O empregador deve possuir um seguro colectivo dos seus trabalhadores, para cobertura dos respectivos acidentes de trabalho e doenças profissionais.

Artigo 236
(Pensões e indemnizações)
1. Quando o acidente de trabalho ou doença profissional ocasionar incapacidade de trabalho, o trabalhador tem direito a:
a) uma pensão no caso de incapacidade permanente absoluta ou parcial;
b) uma indemnização no caso de incapacidade temporária absoluta ou parcial.
2. É concedido um suplemento de indemnização às vítimas de acidente de trabalho ou doença profissional de que resulte incapacidade e que necessitem da assistência constante de outra pessoa.
3. Se do acidente de trabalho ou doença profissional resultar a morte do trabalhador, há lugar à pensão de sobrevivência.
4. Nos casos de incapacidade permanente absoluta, a pensão paga ao trabalhador sinistrado não deve nunca ser inferior à pensão de reforma a que teria direito por limite de idade.
5. O regime jurídico de pensões e indemnizações é regulado nos termos da legislação específica.`,
  },
  {
    title: "Lei n.º 13/2023 — Período Normal de Trabalho e Horário",
    category: "trabalho",
    content: `SECÇÃO IX
Duração da prestação do trabalho

Artigo 92
(Período normal de trabalho)
1. Considera-se período normal de trabalho o número de horas de trabalho efectivo a que o trabalhador se obriga a prestar ao empregador.
2. Considera-se duração efectiva de trabalho o tempo durante o qual o trabalhador presta serviço efectivo ao empregador ou se encontra à disposição deste.

Artigo 93
(Limites do período normal de trabalho)
1. O período normal de trabalho não pode ser superior a 48 horas por semana e 8 horas por dia.
2. Sem prejuízo do disposto no número 1 do presente artigo, o período normal de trabalho pode ser alargado até 9 horas, sempre que ao trabalhador seja concedido meio-dia de descanso complementar por semana, além do dia de descanso semanal prescrito no artigo 104 da presente Lei.
3. Por instrumento de regulamentação colectiva de trabalho, o período normal de trabalho diário pode ser, excepcionalmente, aumentado até ao máximo de quatro horas sem que a duração do trabalho semanal exceda 56 horas, não contando para este limite o trabalho excepcional e extraordinário prestado por motivo de força maior.
4. A duração média de 48 horas de trabalho semanal deve ser apurada por referência a períodos máximos de seis meses.
5. O apuramento da duração média do trabalho semanal, referido no número 4 do presente artigo, pode ser obtido por meio de compensação das horas anteriormente prestadas pelo trabalhador, através da redução do horário de trabalho, diário ou semanal.
6. Os estabelecimentos que se dediquem a actividades industriais, com excepção dos que laborem em regime de turnos, podem adoptar o limite de duração do trabalho normal de 45 horas semanais a cumprir em cinco dias da semana.
7. Todos os estabelecimentos, com excepção dos serviços e actividades destinados à satisfação de necessidades essenciais da sociedade, previstos no número 4 do artigo 105 da presente Lei, bem como os estabelecimentos de venda directa ao público, podem, por motivos de condicionamento económico ou outros, adoptar a prática de horário único.
8. O empregador deve dar conhecimento de novos horários de trabalho ao Ministério que superintende a área do Trabalho através da sua representação mais próxima até ao dia 15 do mês posterior ao da sua adopção, observando as normas definidas na presente Lei e demais legislação em vigor sobre a matéria.

Artigo 97
(Interrupção do trabalho)
1. O período normal de trabalho diário deve ser interrompido por um intervalo de duração não inferior a meia hora nem superior a duas horas, sem prejuízo dos serviços prestados em regime de turnos.
2. Os instrumentos de regulamentação colectiva podem estabelecer duração e frequência superiores para o intervalo de descanso referido no número 1 do presente artigo.
3. No horário de trabalho contínuo é obrigatoriamente respeitado um intervalo de descanso não inferior a meia hora, que é contabilizado como duração efectiva do trabalho.

Artigo 98
(Trabalho excepcional)
1. Considera-se trabalho excepcional o que é realizado em dia de descanso semanal, complementar, feriado ou de tolerância de ponto.
2. É obrigatória a prestação de trabalho excepcional, em casos de força maior para fazer face a um acidente passado ou iminente, para efectuar trabalhos urgentes e imprevistos em máquinas e materiais indispensáveis ao normal funcionamento da empresa ou estabelecimento.
3. O empregador é obrigado a possuir um registo do trabalho excepcional, onde, antes do início da prestação de trabalho e após o seu termo, faz as respectivas anotações, além da indicação expressa do fundamento da prestação de trabalho excepcional, devendo ser visado pelo trabalhador que o prestou.
4. A prestação de trabalho em dia de descanso semanal, complementar, feriado ou tolerância de ponto, sem prejuízo do horário de trabalho em regime de alternância, confere direito a um dia completo de descanso compensatório em um dos três dias seguintes, salvo quando a prestação de trabalho não ultrapasse um período de cinco horas consecutivas ou alternadas, caso em que é compensado com meio-dia de descanso.

Artigo 99
(Trabalho extraordinário)
1. Considera-se extraordinário, o trabalho prestado fora do horário normal de trabalho.
2. O trabalho extraordinário só pode ser prestado:
a) quando o empregador tenha de fazer face a acréscimos de trabalho que não justifiquem a admissão de trabalhador em regime de contrato a prazo ou por tempo indeterminado;
b) quando se verifiquem motivos ponderosos.
3. Cada trabalhador pode prestar até 96 horas de trabalho extraordinário por trimestre, não podendo realizar mais de oito horas de trabalho extraordinário por semana, nem exceder 200 horas por ano.
4. Não se considera trabalho extraordinário o prestado pelo trabalhador isento de horário de trabalho e o prestado para compensar os períodos de ausência por iniciativa do trabalhador.
5. O empregador deve, em todos os casos, possuir um sistema de registo do trabalho extraordinário prestado.

Artigo 100
(Trabalho nocturno)
1. Considera-se trabalho nocturno o que for prestado entre as vinte horas de um dia e a hora de início do período normal de trabalho do dia seguinte, exceptuando-se o trabalho realizado em regime de turnos, previsto no artigo seguinte.
2. Os instrumentos de regulamentação colectiva podem considerar como nocturno o trabalho prestado em sete das nove horas compreendidas entre as vinte horas de um dia e as cinco horas do dia seguinte.

Artigo 101
(Trabalho em turnos)
1. Considera-se trabalho em turnos a prestação de trabalho por equipas de trabalhadores que, sucessivamente e em períodos de referência fixos, executam o mesmo trabalho ou trabalho da mesma natureza durante horas diferentes do dia.
2. A rotação de turnos deve processar-se, em regra, por forma a que cada trabalhador permaneça no mesmo posto de trabalho durante um período não superior a duas semanas.
3. No trabalho em turnos, cada trabalhador tem direito a um período de descanso de, pelo menos, 11 horas consecutivas entre dois dias de trabalho.
4. O trabalhador em regime de turnos não pode prestar mais de 48 horas de trabalho semanal.

SECÇÃO IX-A
Trabalho a tempo parcial

Artigo 101-A
(Noção)
1. Considera-se trabalho a tempo parcial o trabalho cuja duração semanal é inferior à duração normal de trabalho fixada por contrato de trabalho ou por instrumento de regulamentação colectiva.
2. O contrato de trabalho a tempo parcial deve ser celebrado por escrito e deve indicar a duração semanal ou mensal do trabalho.

Artigo 101-B
(Direitos do trabalhador a tempo parcial)
1. O trabalhador a tempo parcial tem direito a:
a) remuneração proporcional ao trabalho prestado;
b) férias remuneradas iguais às do trabalhador a tempo completo;
c) descanso semanal e feriados;
d) licença por maternidade e paternidade;
e) outros direitos previstos na lei e em instrumentos de regulamentação colectiva.
2. A discriminação do trabalhador a tempo parcial, em razão da duração do tempo de trabalho, é proibida.

CAPÍTULO IV
Suspensão e Cessação da Relação de Trabalho

SECÇÃO I
Suspensão da relação de trabalho

Artigo 131
(Cessação temporária do contrato de trabalho)
1. A prestação de trabalho pode ser temporariamente suspensa por motivo de força maior que determine a impossibilidade definitiva ou temporária da execução do contrato, sem que tenha havido culpa de qualquer das partes, nomeadamente em caso de destruição total ou parcial do estabelecimento ou dos meios de produção.
2. Nos casos previstos no número 1, o empregador deve comunicar, por escrito, ao trabalhador e à Inspecção-Geral do Trabalho, a suspensão do contrato de trabalho, no prazo de cinco dias a contar do conhecimento do facto.
3. A suspensão do contrato de trabalho por força maior não pode exceder 30 dias no período de 12 meses.

Artigo 132
(Suspensão provisória do contrato de trabalho)
1. O empregador pode, mediante comunicação prévia ao trabalhador e à Inspecção-Geral do Trabalho, suspender provisoriamente o contrato de trabalho, quando, por motivos económicos, se verifique a diminuição temporária da actividade.
2. A suspensão provisória do contrato de trabalho não pode exceder 30 dias no período de 12 meses.
3. Durante o período de suspensão, o trabalhador tem direito a uma remuneração correspondente a 50% da remuneração base.

Artigo 133
(Suspensão do contrato de trabalho por doenca)
1. O contrato de trabalho é suspenso quando o trabalhador se encontre incapacitado para o trabalho por doença, acidente de trabalho ou doença profissional, durante o período máximo de 12 meses.
2. Findo o período previsto no número 1, o contrato de trabalho caduca, salvo se o trabalhador estiver capacitado para o trabalho.
3. Durante o período de suspensão, o trabalhador tem direito à remuneração devida pela segurança social.

SECÇÃO II
Cessação da relação de trabalho

Artigo 135
(Formas de cessação do contrato de trabalho)
1. O contrato de trabalho pode cessar por:
a) caducidade;
b) acordo revogatório;
c) denúncia por qualquer das partes;
d) rescisão por qualquer das partes contratantes com justa causa.
2. A cessação da relação de trabalho determina a extinção das obrigações das partes relativas ao cumprimento do vínculo laboral e a constituição de direitos e deveres, nos casos especialmente previstos na lei.
3. A cessação do contrato de trabalho produz efeitos jurídicos a partir do conhecimento da mesma por parte do outro contratante, mediante documento escrito.

Artigo 136
(Caducidade do contrato de trabalho)
1. O contrato de trabalho a prazo certo caduca com a chegada do dia marcado para a sua duração.
2. O contrato de trabalho por tempo indeterminado caduca com a morte do trabalhador.
3. O contrato de trabalho caduca com a incapacidade permanente e absoluta do trabalhador para o exercício da actividade a que estava afecto.
4. O contrato de trabalho a prazo certo caduca com a cessação da actividade do empregador, salvo se houver contrato de prestação de serviços com terceiro para a continuidade da actividade.

Artigo 137
(Acordo revogatório)
1. O contrato de trabalho pode ser revogado por acordo entre o empregador e o trabalhador, mediante documento escrito.
2. O acordo revogatório deve indicar as condições da revogação, nomeadamente a data da cessação e a indemnização, se for caso disso.

Artigo 138
(Justa causa de rescisão do contrato de trabalho)
1. Considera-se, em geral, justa causa para rescisão do contrato de trabalho os factos ou circunstâncias graves que impossibilitem, moral ou materialmente, a subsistência da relação contratual estabelecida.
2. O empregador ou o trabalhador pode invocar justa causa para rescindir o contrato de trabalho, reconhecendo à contraparte o direito de impugnar a justa causa, dentro do prazo de seis meses a contar da data do conhecimento da rescisão.
3. A justa causa invocada pelo empregador extingue a relação individual ou colectiva de trabalho.
4. Constituem, em especial, justa causa, por parte do empregador:
a) a manifesta inaptidão do trabalhador para o serviço ajustado, verificada após o período probatório;
b) a violação culposa e grave dos deveres laborais pelo trabalhador;
c) a detenção ou prisão se, devido à natureza das funções do trabalhador, prejudicar o normal funcionamento dos serviços;
d) a rescisão do contrato por motivos económicos da empresa, que podem ser tecnológicos, estruturais ou de mercado, previstos no artigo 139 da presente Lei.
5. Constituem, em especial, justa causa, por parte do trabalhador:
a) a necessidade de cumprir quaisquer obrigações legais incompatíveis com a continuação no serviço e não confere direito à indemnização;
b) a ocorrência de comportamento do empregador que viole culposamente os direitos e garantias legais e convencionais do trabalhador.

Artigo 139
(Rescisão do contrato com justa causa por iniciativa do trabalhador)
1. O trabalhador pode rescindir o contrato de trabalho, com justa causa, mediante comunicação prévia de, pelo menos, sete dias, indicando, expressa e inequivocamente, os factos que a fundamentam.
2. A rescisão do contrato de trabalho por tempo indeterminado, com justa causa por parte do trabalhador, confere-lhe o direito à indemnização correspondente a 45 dias de salário por cada ano de serviço e, de forma rateada, por fracção de tempo inferior a 12 meses.
3. A rescisão do contrato de trabalho a prazo certo, com justa causa por parte do trabalhador, confere-lhe o direito à indemnização correspondente às remunerações que se venceriam entre a data da cessação e a convencionada para o fim do prazo do contrato.
4. O trabalhador que infringir o prazo fixado no número 1, do presente artigo, deve pagar ao empregador uma multa correspondente a sete dias de salário, a deduzir da indemnização a que tem direito.

Artigo 140
(Despedimento por justa causa)
1. O empregador pode rescindir o contrato de trabalho sem aviso prévio e sem indemnização quando o trabalhador praticar falta grave.
2. Constituem faltas graves, entre outras:
a) a indisciplina ou a insubordinação;
b) a violação culposa e grave dos deveres laborais;
c) o abandono do posto de trabalho;
d) a prática de actos de violência, injúrias ou ameaças contra o empregador, representantes ou superiores hierárquicos;
e) a prática de actos de violência, injúrias ou ameaças contra colegas de trabalho;
f) a detenção ou prisão que prejudique o normal funcionamento dos serviços.

Artigo 141
(Rescisão do contrato por iniciativa do empregador com aviso prévio)
1. O empregador pode rescindir um ou mais contratos de trabalho, com aviso prévio, desde que essa medida se funde em motivos estruturais, tecnológicos, ou de mercado e se mostre essencial à competitividade, saneamento económico, reorganização administrativa ou produtiva da empresa.
2. Para efeitos da presente Lei, considera-se:
a) motivos estruturais - os que se reportam à reorganização ou reestruturação da produção, à mudança de actividade ou à falta de recursos económicos e financeiros de que podem resultar um excesso de postos de trabalho;
b) motivos tecnológicos – os referentes à introdução de nova tecnologia, novos processos ou métodos de trabalho ou à informatização de serviços que pode obrigar à redução de pessoal;
c) motivos de mercado – aqueles que têm a ver com dificuldades de colocação dos bens ou serviços no mercado ou com a redução da actividade da empresa.
3. A rescisão do contrato de trabalho, com fundamento nos motivos previstos no número 2 do presente artigo, confere ao trabalhador o direito a indemnização, equivalente a:
a) 30 dias de salário por cada ano de serviço, se o salário base do trabalhador, incluindo o bónus de antiguidade, corresponder ao valor compreendido entre um a sete salários mínimos do sector de actividade;
b) 15 dias de salário por cada ano de serviço, se o salário base do trabalhador, incluindo o bónus de antiguidade, corresponder ao valor compreendido entre mais de sete a dezoito salários mínimos do sector de actividade;
c) cinco dias de salário por cada ano de serviço, se o salário base do trabalhador, incluindo o bónus de antiguidade, corresponder ao valor de mais de 18 salários mínimos do sector de actividade.

Artigo 142
(Aviso prévio)
1. O aviso prévio deve ser dado por escrito, com a antecedência mínima de 30 dias para o empregador e 15 dias para o trabalhador.
2. O aviso prévio deve conter a indicação dos motivos da rescisão, quando emanar do empregador.
3. Durante o período de aviso prévio, o trabalhador tem direito a uma hora diária para procurar novo emprego, sem prejuízo da remuneração.

Artigo 143
(Despedimento colectivo)
1. Considera-se despedimento colectivo sempre que o empregador, simultanea ou sucessivamente, no período de 3 meses, invocando motivos estruturais, económicos, tecnológicos e de mercado, fizer cessar mais de oito contratos de trabalho, nas micro e pequenas empresas e mais de 10 contratos de trabalho nas médias e grandes empresas.
2. O despedimento colectivo deve ser precedido de um período de negociação com os trabalhadores ou com os seus representantes, com a duração mínima de 30 dias.
3. O empregador deve comunicar à Inspecção-Geral do Trabalho e aos representantes dos trabalhadores, por escrito, a intenção de proceder ao despedimento colectivo, indicando os motivos, o número de trabalhadores abrangidos e o prazo previsto para a cessação dos contratos.

Artigo 144
(Indemnização por despedimento colectivo)
1. No caso de despedimento colectivo, os trabalhadores abrangidos têm direito a uma indemnização correspondente a 30 dias de salário por cada ano de serviço, com o limite mínimo de 30 dias de salário.
2. A indemnização prevista no número 1 é elevada para 40 dias de salário por cada ano de serviço para os trabalhadores com mais de 10 anos de serviço.

Artigo 145
(Reintegração)
1. O trabalhador despedido sem justa causa tem direito à reintegração no posto de trabalho, salvo se, por circunstâncias objectivas, a sua reintegração se mostre impossível.
2. Na impossibilidade de reintegração, o trabalhador tem direito a uma indemnização correspondente a 45 dias de salário por cada ano de serviço, com o limite mínimo de 45 dias de salário.

Artigo 146
(Efeitos da improcedência da rescisão)
1. A decisão judicial ou arbitral de nulidade da rescisão do contrato de trabalho com justa causa, por iniciativa do trabalhador, constitui obrigação de pagar ao empregador uma indemnização correspondente à metade da indemnização prevista nos números 2 e 3 do artigo 139 da presente Lei.
2. Declarados judicialmente ou por entidade equiparável improcedentes os fundamentos invocados para a rescisão do contrato de trabalho, o trabalhador é reintegrado no posto de trabalho com direito ao pagamento do valor correspondente às remunerações vencidas entre a data da cessação do contrato e a da efectiva reintegração, até ao máximo de seis meses, deduzido o valor que houver recebido, se for o caso, a título de indemnização no momento do despedimento.
3. Por opção expressa do trabalhador ou quando circunstâncias objectivas impossibilitem a sua reintegração, o empregador fica obrigado a pagar uma indemnização calculada nos termos do artigo 139 da presente Lei, contando para a antiguidade todo o tempo decorrido entre a data da cessação e a da sentença que declarou a sua nulidade, até ao máximo de seis meses.

Artigo 147
(Certificado de trabalho)
1. Sempre que cesse a relação de trabalho, independentemente do motivo da cessação, o empregador deve emitir ao trabalhador um certificado de trabalho onde conste a indicação do período durante o qual este esteve ao seu serviço, nível de capacidade profissional adquirida e o cargo ou cargos que desempenhou.
2. O certificado não pode conter quaisquer outras referências, salvo pedido escrito do trabalhador nesse sentido.
3. Se o trabalhador não estiver de acordo com o teor da informação, pode, no prazo de 30 dias, recorrer aos órgãos competentes para que se façam as modificações apropriadas, se for caso disso.

CAPÍTULO V
Relação Colectiva de Trabalho

SECÇÃO I
Disposições gerais

Artigo 160
(Noção de instrumento de regulamentação colectiva de trabalho)
1. Instrumento de regulamentação colectiva de trabalho é todo o acordo ou convenção celebrado entre sindicatos de trabalhadores, associações de sindicatos, associações de empregadores ou empresas, que estabeleça condições de trabalho aplicáveis aos respectivos membros.
2. Os instrumentos de regulamentação colectiva de trabalho são:
a) convenção colectiva de trabalho;
b) acordo colectivo de trabalho;
c) contrato colectivo de trabalho;
d) regulamento de empresa.

Artigo 161
(Convenção colectiva de trabalho)
A convenção colectiva de trabalho é o acordo celebrado entre uma ou mais associações sindicais de trabalhadores e uma ou mais associações de empregadores, que estabeleça condições de trabalho aplicáveis aos respectivos membros.

Artigo 162
(Acordo colectivo de trabalho)
O acordo colectivo de trabalho é o acordo celebrado entre um ou mais sindicatos de trabalhadores e um ou mais empregadores, que estabeleça condições de trabalho aplicáveis aos trabalhadores abrangidos.

Artigo 163
(Contrato colectivo de trabalho)
O contrato colectivo de trabalho é o acordo celebrado entre um ou mais sindicatos de trabalhadores e uma ou mais empresas, que estabeleça condições de trabalho aplicáveis aos trabalhadores dessas empresas.

Artigo 164
(Regulamento de empresa)
O regulamento de empresa é o documento pelo qual o empregador estabelece as normas de conduta, os direitos e deveres dos trabalhadores e as condições de trabalho na empresa.

SECÇÃO II
Negociação colectiva

Artigo 165
(Obrigatoriedade de negociação colectiva)
1. O empregador é obrigado a negociar com o sindicato dos trabalhadores que represente a maioria dos trabalhadores da empresa.
2. A negociação colectiva deve ser iniciada dentro de 30 dias a contar da data da recepção da proposta do sindicato.
3. As partes devem negociar de boa fé, com o objectivo de chegar a um acordo.

Artigo 166
(Conteúdo mínimo dos instrumentos de regulamentação colectiva)
1. Os instrumentos de regulamentação colectiva devem conter, no mínimo, as seguintes matérias:
a) duração do contrato de trabalho;
b) período normal de trabalho;
c) remuneração e regime de retribuição;
d) férias, descanso semanal e feriados;
e) condições de higiene e segurança no trabalho;
f) protecção do trabalho de menores;
g) protecção da maternidade e da paternidade;
h) direitos e deveres das partes.

Artigo 167
(Extensão da aplicação dos instrumentos de regulamentação colectiva)
1. Os instrumentos de regulamentação colectiva podem ser extensos a trabalhadores e empregadores não abrangidos pelo âmbito de aplicação do respectivo acordo, mediante despacho do Ministro que superintende a área do Trabalho.
2. A extensão da aplicação dos instrumentos de regulamentação colectiva pode ser solicitada por:
a) uma ou mais associações de trabalhadores;
b) uma ou mais associações de empregadores;
c) o Ministro que superintende a área do Trabalho, oficiosamente.

Artigo 168
(Execução dos instrumentos de regulamentação colectiva)
1. Os instrumentos de regulamentação colectiva são obrigatórios para todos os trabalhadores e empregadores abrangidos pelo respectivo âmbito de aplicação.
2. Os trabalhadores e empregadores abrangidos por instrumentos de regulamentação colectiva não podem celebrar contratos de trabalho que contrariem as disposições daqueles.
3. São nulas as cláusulas dos contratos de trabalho que contrariem as disposições dos instrumentos de regulamentação colectiva.

SECÇÃO III
Organizações sindicais

Artigo 169
(Liberdade sindical)
1. Os trabalhadores têm direito a constituir e aderir a sindicatos, sem necessidade de autorização prévia, para a defesa dos seus direitos e interesses profissionais.
2. Ninguém pode ser obrigado a aderir a sindicato ou a dele se demitir.
3. É proibida a interferência do empregador na organização e funcionamento dos sindicatos.

Artigo 170
(Direito à representação sindical)
1. Os trabalhadores de uma empresa têm direito a eleger representantes sindicais para os representar junto do empregador.
2. O número de representantes sindicais é fixado em função do número de trabalhadores da empresa, de acordo com a seguinte escala:
a) até 30 trabalhadores - 1 representante;
b) de 31 a 100 trabalhadores - 2 representantes;
c) de 101 a 300 trabalhadores - 3 representantes;
d) de 301 a 500 trabalhadores - 4 representantes;
e) mais de 500 trabalhadores - 5 representantes.

Artigo 171
(Garantias da representação sindical)
1. Os representantes sindicais gozam das seguintes garantias:
a) estabilidade no emprego durante o exercício do mandato;
b) direito a dispense de trabalho, sem perda de remuneração, para o exercício de funções sindicais;
c) direito a utilizar locais adequados para reuniões;
d) direito a aceder à informação necessária ao exercício das suas funções.

CAPÍTULO VII
Greve

Artigo 200
(Direito à greve)
1. Os trabalhadores têm direito à greve como meio de defesa dos seus interesses profissionais.
2. O direito à greve é exercido colectivamente e não pode ser objecto de limitação, suspensão ou restrição.

Artigo 201
(Procedimento para a declaração da greve)
1. A greve deve ser precedida de um processo de negociação entre o empregador e os representantes dos trabalhadores.
2. A greve deve ser declarada por maioria dos trabalhadores abrangidos, em assembleia especialmente convocada para o efeito.
3. A declaração de greve deve ser comunicada ao empregador e à Inspecção-Geral do Trabalho, com uma antecedência mínima de 3 dias.

Artigo 202
(Efeitos da greve)
1. A greve determina a suspensão do contrato de trabalho dos trabalhadores aderentes.
2. Os trabalhadores em greve não podem ser substituídos, salvo em caso de prestação de serviços essenciais.
3. A suspensão do contrato de trabalho durante a greve não pode ser considerada como falta para efeitos de antiguidade, férias ou remuneração.

Artigo 203
(Greve nos serviços essenciais)
1. Consideram-se serviços essenciais os serviços cuja interrupção pode pôr em perigo a vida, a segurança ou a saúde da população, bem como a prestação de serviços públicos fundamentais.
2. Nos serviços essenciais, a greve deve ser precedida de um período de negociação não inferior a 8 dias.
3. Durante a greve nos serviços essenciais, deve ser assegurada uma prestação mínima de serviços.

Artigo 204
(Proibição da greve abusiva)
1. É considerada greve abusiva:
a) a greve declarada sem observância do procedimento previsto na presente Lei;
b) a greve que vise a obtenção de fins estranhos aos interesses profissionais dos trabalhadores;
c) a greve que vise a alteração ou a revogação de instrumentos de regulamentação colectiva em vigor.

CAPÍTULO VIII
Fiscalização do cumprimento da legislação do trabalho

Artigo 210
(Órgãos de fiscalização)
1. A fiscalização do cumprimento da legislação do trabalho é exercida pela Inspecção-Geral do Trabalho e seus delegados regionais.
2. A Inspecção-Geral do Trabalho tem autonomia técnica e administrativa no exercício das suas funções.

Artigo 211
(Atribuições da Inspecção-Geral do Trabalho)
Compete à Inspecção-Geral do Trabalho, entre outras, as seguintes atribuições:
a) fiscalizar o cumprimento da legislação do trabalho e respectiva regulamentação;
b) apurar e autuar as contravenções laborais;
c) acompanhar o cumprimento dos acordos de concertação social;
d) promover a resolução pacífica dos conflitos colectivos de trabalho;
e) emitir pareceres sobre a aplicação da legislação do trabalho;
f) manter o registo de associações sindicais e de empregadores.

Artigo 212
(Funções dos inspectores do trabalho)
1. Os inspectores do trabalho são competentes para:
a) entrar em qualquer estabelecimento ou local de trabalho, a qualquer hora;
b) proceder a inquéritos e investigações sobre a aplicação da legislação do trabalho;
c) examinar documentos, registos e outros elementos necessários à fiscalização;
d) colher declarações e ouvir testemunhas;
e) notificar os infractores para adoptarem medidas correctivas;
f) levantar autos de contra-ordenção laboral.

CAPÍTULO IX
Contravenções laborais

Artigo 215
(Contravenções laborais)
1. Constituem contravenções laborais as infracções à legislação do trabalho e respectiva regulamentação.
2. As contravenções laborais são classificadas em:
a) leves;
b) graves;
c) muito graves.

Artigo 216
(Contravenções leves)
Constituem contravenções leves:
a) a não observância das normas de higiene e segurança no trabalho que não coloquem em perigo a segurança dos trabalhadores;
b) a falta de registo de trabalhadores;
c) a não emissão do certificado de trabalho;
d) a não comunicação de acidentes de trabalho à Inspecção-Geral do Trabalho.

Artigo 217
(Contravenções graves)
Constituem contravenções graves:
a) a não observância das normas de higiene e segurança no trabalho que coloquem em perigo a segurança dos trabalhadores;
b) a não observância das normas relativas à protecção da maternidade e da paternidade;
c) a não observância das normas relativas ao trabalho de menores;
d) a discriminação dos trabalhadores em razão da cor, raça, sexo, origem étnica, lugar de nascimento, religião, posição social e opção política.

Artigo 218
(Contravenções muito graves)
Constituem contravenções muito graves:
a) a utilização de trabalho forçado ou compulsivo;
b) a utilização de trabalho de menores em condições que coloquem em perigo a sua saúde, segurança ou moral;
c) a violação das normas de higiene e segurança no trabalho em actividades com risco excepcional;
d) a não observância das disposições relativas à greve nos serviços essenciais.

Artigo 219
(Sanções)
1. As contravenções leves são punidas com multa de 1 a 10 salários mínimos.
2. As contravenções graves são punidas com multa de 10 a 50 salários mínimos.
3. As contravenções muito graves são punidas com multa de 50 a 200 salários mínimos.
4. A reincidência nas contravenções previstas nos números 2 e 3 é agravada de metade.

CAPÍTULO X
Disposições transitórias e finais

Artigo 220
(Entrada em vigor)
A presente Lei entra em vigor 90 dias após a data da sua publicação.

Artigo 221
(Revogação)
São revogadas todas as disposições legais que contrariem a presente Lei, nomeadamente a Lei n.º 23/2007, de 1 de Agosto.

ANEXO
Glossário

Para efeitos da presente Lei, entende-se por:
a) Acidente de trabalho - o sinistro que se verifica no local e durante o tempo do trabalho, desde que produza, directa ou indirectamente, no trabalhador subordinado lesão corporal, perturbação funcional ou doença de que resulte a morte ou redução na capacidade de trabalho ou de ganho.
b) Assalariado - todo o trabalhador que presta a sua actividade a outra pessoa, empregador, sob a autoridade e direcção desta, mediante remuneração.
c) Cessação do contrato de trabalho - a extinção do vínculo laboral por qualquer das formas previstas na lei.
d) Contrato de trabalho - o acordo pelo qual uma pessoa, trabalhador, se obriga a prestar a sua actividade a outra pessoa, empregador, sob a autoridade e direcção desta, mediante remuneração.
e) Despedimento colectivo - a cessação de contratos de trabalho por iniciativa do empregador que abranja, simultanea ou sucessivamente, num período de 3 meses, mais de 8 trabalhadores nas micro e pequenas empresas e mais de 10 trabalhadores nas médias e grandes empresas.
f) Doença profissional - a que resulta do exercício do trabalho e que é provocada por factores ou condições inerentes ao mesmo.
g) Empregador - toda a pessoa singular ou colectiva, pública ou privada, que Utiliza, por conta de si mesma e mediante remuneração, a actividade de outrem.
h) Férias - o período de descanso anual a que o trabalhador tem direito, sem prejuízo da remuneração.
i) Greve - a suspensão colectiva do trabalho, declarada e mantida por trabalhadores, como meio de defesa dos seus interesses profissionais.
j) Horário de trabalho - o período durante o qual o trabalhador está ao serviço do empregador.
k) Licença por maternidade - o período de descanso a que a trabalhadora tem direito durante a gravidez e após o parto.
l) Licença por paternidade - o período de descanso a que o trabalhador tem direito por motivo de nascimento de filho.
m) Período probatório - o tempo inicial de execução do contrato cuja duração obedece ao estipulado na lei.
n) Período normal de trabalho - o número de horas de trabalho efectivo a que o trabalhador se obriga a prestar ao empregador.
o) Remuneração - o que, nos termos do contrato individual ou colectivo ou dos usos, o trabalhador tem direito como contrapartida do seu trabalho.
p) Salário - a contrapartida pecuniária do trabalho prestado.
q) Sindicato - a organização profissional, de natureza associativa, constituída por trabalhadores, para a defesa e promoção dos seus interesses profissionais.
r) Subordinação económica - a situação em que o prestador de actividade depende do rendimento obtido do beneficiário da prestação para a sua subsistência.
s) Trabalho a tempo parcial - o trabalho cuja duração semanal é inferior à duração normal de trabalho fixada por contrato de trabalho ou por instrumento de regulamentação colectiva.
t) Trabalho em turnos - a prestação de trabalho por equipas de trabalhadores que, sucessivamente e em períodos de referência fixos, executam o mesmo trabalho ou trabalho da mesma natureza durante horas diferentes do dia.
u) Trabalho excepcional - o que é realizado em dia de descanso semanal, complementar, feriado ou de tolerância de ponto.
v) Trabalho extraordinário - o trabalho prestado fora do horário normal de trabalho.
w) Trabalho nocturno - o que for prestado entre as vinte horas de um dia e a hora de início do período normal de trabalho do dia seguinte.`,
  },
];
