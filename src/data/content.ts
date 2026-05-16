export type Esquerda = {
  slug: string;
  nome: string;
  tipo: "Exu" | "Pomba Gira" | "Exu Mirim";
  resumo: string;
  caracteristicas: string;
  atuacao: string;
  elementos: string;
  saudacao: string;
  regencia: string;
  oferendas: string;
  cores: string;
  nomesFamosos: string[];
  qualidades: string;
  imageUrl?: string;
};

export type Entidade = {
  slug: string;
  nome: string;
  tipo: "Caboclos" | "Pretos-velhos" | "Baianos" | "Erês" | "Boiadeiros" | "Ciganos" | "Marinheiros" | "Malandros";
  resumo: string;
  caracteristicas: string;
  atuacao: string;
  elementos: string;
  saudacao: string;
  regencia: string;
  flores: string;
  frutas: string;
  ferramentas: string;
};

export type Orixa = {
  slug: string;
  nome: string;
  resumo: string;
  forcas: string;
  entidades: string;
  caracteristicas: string;
  trono: string;
  pedras: string;
  ervas: string;
  flores: string;
  frutas: string;
  imageUrl?: string;
};

export type Estudo = {
  slug: string;
  titulo: string;
  resumo: string;
  categoria: "Fundamentos" | "Entidades" | "Ritualística" | "Avançado";
  duracao: string;
  premium?: boolean;
  conteudo: string[];
  imageUrl?: string;
};

export const estudos: Estudo[] = [
  {
    slug: "o-que-e-umbanda",
    titulo: "O que é Umbanda",
    resumo: "Origem, princípios e a fé que une todos os povos sob a luz de Oxalá.",
    categoria: "Fundamentos",
    duracao: "8 min",
    conteudo: [
      "A Umbanda é uma religião genuinamente brasileira, manifestada publicamente em 15 de novembro de 1908 pelo médium Zélio Fernandino de Moraes, através do Caboclo das Sete Encruzilhadas.",
      "Reúne elementos do espiritismo kardecista, do catolicismo popular, das tradições africanas e da espiritualidade dos povos originários da nossa terra.",
      "Seus pilares são a caridade, o amor ao próximo, a evolução espiritual e a comunicação respeitosa com o mundo dos espíritos por meio dos guias e protetores.",
    ],
  },
  {
    slug: "as-sete-linhas",
    titulo: "As Sete Linhas de Umbanda",
    resumo: "Conheça as falanges de Oxalá, Ogum, Oxóssi, Xangô, Yorimá, Yori e Iemanjá.",
    categoria: "Fundamentos",
    duracao: "12 min",
    conteudo: [
      "As Sete Linhas representam as vibrações divinas que sustentam toda a criação. Cada linha é regida por um Orixá e atua em um campo específico da existência.",
      "Linha de Oxalá — fé, paz e elevação espiritual.",
      "Linha de Ogum — demanda, proteção e abertura de caminhos.",
      "Linha de Oxóssi — conhecimento, fartura e cura pelas ervas.",
      "Linha de Xangô — justiça, equilíbrio e firmeza.",
      "Linha de Yorimá (Obaluaiê/Nanã) — ancestralidade e cura.",
      "Linha de Yori (Ibejis) — pureza, alegria e renovação.",
      "Linha de Iemanjá/Oxum — amor, família e sentimentos.",
    ],
  },
  {
    slug: "guias-e-protetores",
    titulo: "Guias e Protetores",
    resumo: "Caboclos, Pretos-Velhos, Crianças, Marinheiros, Boiadeiros e Exus.",
    categoria: "Entidades",
    duracao: "10 min",
    conteudo: [
      "Os guias são espíritos de luz que voluntariamente trabalham na caridade através da Umbanda.",
      "Pretos-Velhos como Pai Joaquim de Aruanda trazem a sabedoria da paciência, do conselho amoroso e da humildade conquistada em vidas de servidão.",
      "Caboclos manifestam a força da natureza e o conhecimento dos povos originários.",
      "Crianças (Erês) trazem leveza, cura e a pureza do coração.",
      "Exus e Pombagiras são guardiões que atuam nos caminhos, na proteção espiritual e na quebra de demandas.",
    ],
  },
  {
    slug: "introducao-aos-orixas",
    titulo: "Introdução aos Orixás",
    resumo: "Quem são, como atuam e como cultuá-los com respeito.",
    categoria: "Fundamentos",
    duracao: "15 min",
    conteudo: [
      "Os Orixás são manifestações divinas, forças da natureza e expressões de Olorum (Deus).",
      "Cada Orixá rege aspectos da vida e da natureza, e a todos devemos reverência e respeito.",
      "Conhecer seus arquétipos nos ajuda a entender a nós mesmos e a buscar equilíbrio interior.",
    ],
  },
  {
    slug: "primeiros-passos-no-terreiro",
    titulo: "Primeiros Passos no Terreiro",
    resumo: "Como se portar, vestir-se e respeitar a casa de santo.",
    categoria: "Ritualística",
    duracao: "7 min",
    conteudo: [
      "Vista-se de branco sempre que possível, sem decotes ou roupas curtas demais.",
      "Mantenha respeito, silêncio reverente e atenção durante os trabalhos.",
      "Saudações são parte importante da ritualística — pergunte ao seu dirigente como saudar cada linha.",
      "A humildade é a porta de entrada de qualquer terreiro de luz.",
    ],
  },
  {
    slug: "fundamentos-da-mediunidade",
    titulo: "Fundamentos da Mediunidade",
    resumo: "Curso avançado: tipos de mediunidade, desenvolvimento e ética.",
    categoria: "Avançado",
    duracao: "Curso · 6 aulas",
    premium: true,
    conteudo: [
      "Conteúdo exclusivo para membros assinantes.",
    ],
  },
  {
    slug: "origem-da-umbanda",
    titulo: "Origem da Umbanda",
    resumo: "A história do surgimento da Umbanda no Rio de Janeiro em 1908.",
    categoria: "Fundamentos",
    duracao: "5 min",
    conteudo: [
      "A Umbanda tem suas origens históricas ligadas aos subúrbios do Rio de Janeiro.",
      "Em 15 de novembro de 1908, Zélio Fernandino de Moraes teria incorporado o Caboclo das Sete Encruzilhadas, marco da fundação da religião.",
      "Suas crenças integram elementos do Candomblé, do Espiritismo Kardecista, do Catolicismo e tradições indígenas.",
      "A Umbanda se caracteriza pela fusão de diferentes tradições espirituais e culturais, focada na caridade e evolução espiritual.",
    ],
  },
  {
    slug: "caracteristicas-e-crencas",
    titulo: "Características e Crenças",
    resumo: "Entenda o sincretismo e os pilares de fé da Umbanda.",
    categoria: "Fundamentos",
    duracao: "6 min",
    conteudo: [
      "A Umbanda é uma religião monoteísta que acredita em um Deus supremo (Olorum, Zambi ou Oxalá).",
      "É marcada pelo sincretismo: Catolicismo (santos e preces), Espiritismo (reencarnação), Candomblé (Orixás) e Indígena (ervas e caboclos).",
      "Os praticantes creem na imortalidade da alma e na evolução espiritual através das leis do carma.",
      "A caridade é o princípio fundamental de todos os trabalhos realizados nos terreiros.",
    ],
  },
  {
    slug: "orixas-e-entidades",
    titulo: "Orixás vs Entidades",
    resumo: "A diferença entre as divindades e os guias espirituais.",
    categoria: "Entidades",
    duracao: "8 min",
    conteudo: [
      "Na Umbanda, há dois tipos principais de guias espirituais que atuam para ajudar os praticantes: os Orixás e as Entidades.",
      "Os Orixás são Divindades de origem africana associadas às forças da natureza. Cada Orixá possui características e histórias próprias, e alguns exemplos são: Oxalá, Xangô, Iemanjá, Ogum e Oxossi, Oxum, Iansã, Omulú e Nanã.",
      "Já as Entidades são espíritos em evolução e que viveram na Terra entre os humanos. Na Umbanda, retornam como guias espirituais, auxiliando os praticantes em diversas áreas, como saúde, emoções, trabalho e proteção.",
      "Aqui listamos as principais entidades que se manifestam na Umbanda.",
      "**Caboclos**: espíritos de ancestrais indígenas que voltam ao mundo terreno para ajudar espiritualmente as pessoas, especialmente na cura.",
      "**Pretos-velhos**: espíritos de pessoas africanas trazidas ao Brasil como escravizadas. Apesar de terem sofrido em vida, agora são espíritos ditos evoluídos que dão ótimos conselhos a quem os procuram.",
      "**Baianos**: entidades nordestinas que, na Umbanda, são conhecidos por sua força espiritual e apoio em questões de trabalho, determinação, saúde e fortalecimento moral.",
      "**Marinheiros/Marujos**: espíritos de pessoas que tiveram uma vida ligada ao mar. Conhecidos por sua sinceridade e pela ajuda em limpezas espirituais e emocionais, são representados com um leve balanço corporal, lembrando o movimento das ondas.",
      "**Erês**: são os espíritos infantis, também chamados de “Crianças”. Risonhos, trazem alegria e pureza. Consolam os aflitos, os pais e mães e, às vezes, cometem algumas travessuras.",
      "**Malandros**: são aquelas pessoas tiveram que usar de sua esperteza para sobreviver. Um dos mais conhecidos é Zé Pelintra. Ficou órfão de pai e mãe e, para sobreviver, começou a realizar pequenos roubos e trapaças. São conhecidos por serem protetores e por oferecerem ajuda a quem se encontra em situações de marginalização.",
      "**Pomba-gira**: espíritos femininos fortes que, em vida, lutaram contra injustiças e preconceitos. Auxiliam especialmente em questões ligadas à autoestima, ao amor, confiança e defesa das mulheres. Uma delas foi Maria Padilha, amante do rei Dom Pedro I de Castela (1334-1369), retratada como mulher sensual, bem-vestida e sedutora.",
      "Há também outras entidades como os Boiadeiros, Ciganos, Orientais, etc.",
      "Para exercer o trabalho espiritual, os responsáveis pela ligação entre o mundo espiritual e material, os médiuns, recebem (incorporaram) estas entidades e assim ajudam o consulente.",
    ],
  },
  {
    slug: "rituais-e-simbolos",
    titulo: "Rituais e Símbolos",
    resumo: "Passe, descarrego, pontos riscados e cantados.",
    categoria: "Ritualística",
    duracao: "7 min",
    conteudo: [
      "O local de culto é chamado de Terreiro, Templo ou Barracão, onde as cerimônias são conduzidas pelo Pai ou Mãe de Santo.",
      "Práticas comuns incluem o 'passe' (reorganização energética) e o 'descarrego' (limpeza de energias negativas).",
      "Pontos Riscados são símbolos desenhados no chão para chamar entidades e firmar energias.",
      "Pontos Cantados são cantigas acompanhadas por atabaques para saudar e evocar os guias.",
    ],
  },
  {
    slug: "umbanda-vs-candomble",
    titulo: "Umbanda vs Candomblé",
    resumo: "As principais diferenças entre estas duas religiões irmãs.",
    categoria: "Avançado",
    duracao: "5 min",
    conteudo: [
      "Origem: Candomblé tem raízes africanas diretas; Umbanda nasceu no Brasil no século XX.",
      "Manifestação: No Candomblé os Orixás se manifestam; na Umbanda manifestam-se as Entidades (guias).",
      "Rituais: Candomblé segue estrutura rigorosa; Umbanda é mais flexível e sincrética.",
      "Exu: No Candomblé é um Orixá mensageiro; na Umbanda é uma entidade de proteção e guardião.",
    ],
  },
];

export const entidades: Entidade[] = [
  {
    slug: "caboclos",
    nome: "Caboclos",
    tipo: "Caboclos",
    resumo: "Espíritos de ancestrais indígenas, símbolos de força, coragem e conhecimento das matas.",
    caracteristicas: "Manifestam-se de forma vigorosa, com brados e gestos que lembram o arco e flecha. São diretos e objetivos em seus conselhos.",
    atuacao: "Cura através das ervas, limpeza espiritual, quebra de demandas e fortalecimento da fé.",
    elementos: "Ervas, charutos, água mineral e sementes.",
    saudacao: "Okê Caboclo!",
    regencia: "Oxóssi",
    flores: "Flores do campo, samambaias",
    frutas: "Coco, frutas silvestres",
    ferramentas: "Arco e flecha",
  },
  {
    slug: "pretos-velhos",
    nome: "Pretos-velhos",
    tipo: "Pretos-velhos",
    resumo: "Sábios anciãos que trazem o conforto, a paciência e a humildade.",
    caracteristicas: "Falam de forma mansa, curvados pelo tempo, usando cachimbos e terços. São os grandes conselheiros da Umbanda.",
    atuacao: "Conforto emocional, limpeza de energias densas, ensinamentos sobre paciência e perdão.",
    elementos: "Cachimbo, café, fumo e guias de contas brancas e pretas.",
    saudacao: "Adorei as Almas!",
    regencia: "Omulú / Obaluaiê / Nanã",
    flores: "Cravos brancos e roxos",
    frutas: "Ameixa, figo, jabuticaba",
    ferramentas: "Rosário, cachimbo, cajado",
  },
  {
    slug: "baianos",
    nome: "Baianos",
    tipo: "Baianos",
    resumo: "Entidades alegres e firmes que representam a força do povo nordestino.",
    caracteristicas: "Gostam de conversar, são festivos mas muito rigorosos com a disciplina espiritual. Usam chapéus de couro ou palha.",
    atuacao: "Limpeza, descarrego, quebra de magias negativas e movimentação de energias paradas.",
    elementos: "Coco, batida, fumo e pimentas.",
    saudacao: "É da Bahia!",
    regencia: "Iansã / Ogum",
    flores: "Palmas amarelas, flores de cores vivas",
    frutas: "Coco, manga, banana",
    ferramentas: "Chapéu de palha, chicote de couro",
  },
  {
    slug: "eres",
    nome: "Erês (Crianças)",
    tipo: "Erês",
    resumo: "A pureza e a alegria que curam a alma e renovam a esperança.",
    caracteristicas: "Manifestam-se com brincadeiras, risadas e pureza infantil. São muito poderosos em suas magias simples.",
    atuacao: "Cura de crianças e adultos, união familiar e limpeza de ambientes pesados.",
    elementos: "Doces, refrigerantes, frutas e brinquedos.",
    saudacao: "Oni Ibejada!",
    regencia: "Oxum / Ibeji",
    flores: "Flores pequenas e coloridas",
    frutas: "Uva, pera, frutas doces",
    ferramentas: "Brinquedos, chupetas",
  },
  {
    slug: "boiadeiros",
    nome: "Boiadeiros",
    tipo: "Boiadeiros",
    resumo: "Espíritos de homens do campo, laçadores de energias negativas.",
    caracteristicas: "Usam chicotes e laços simbólicos. São práticos e ajudam a manter a ordem e a disciplina.",
    atuacao: "Abertura de caminhos, proteção de bens materiais e 'laçada' de espíritos obsessores.",
    elementos: "Corda, couro, fumo e vinho ou cachaça.",
    saudacao: "Getruá Boiadeiro!",
    regencia: "Ogum / Iansã / Logunan",
    flores: "Flores do campo",
    frutas: "Manga espada, carambola",
    ferramentas: "Laço, chicote, chapéu de couro",
  },
  {
    slug: "ciganos",
    nome: "Ciganos",
    tipo: "Ciganos",
    resumo: "Mestres da liberdade, da prosperidade e das artes divinatórias.",
    caracteristicas: "Usam roupas coloridas, moedas e baralhos. Trazem a alegria da vida e o brilho da prosperidade.",
    atuacao: "Prosperidade financeira, questões amorosas e orientação sobre o destino.",
    elementos: "Cartas, moedas, incensos, frutas e vinhos finos.",
    saudacao: "Optchá!",
    regencia: "Egunitá / Oxum",
    flores: "Rosas coloridas, gérberas",
    frutas: "Uva, pêssego, damasco",
    ferramentas: "Baralho, moedas, punhal",
  },
  {
    slug: "marinheiros",
    nome: "Marinheiros",
    tipo: "Marinheiros",
    resumo: "Espíritos do mar que limpam as emoções e equilibram os sentimentos.",
    caracteristicas: "Apresentam um balanço como se estivessem em um navio. São descontraídos e muito sinceros.",
    atuacao: "Limpeza profunda de traumas emocionais e descarrego de energias negativas.",
    elementos: "Rum, fumo, água salgada e peixes.",
    saudacao: "Salve a Marujada!",
    regencia: "Iemanjá",
    flores: "Rosas brancas, lírios",
    frutas: "Melancia, melão",
    ferramentas: "Leme, bússola, cordas",
  },
  {
    slug: "malandros",
    nome: "Malandros",
    tipo: "Malandros",
    resumo: "A sabedoria das ruas, mestres da sobrevivência e da proteção dos marginalizados.",
    caracteristicas: "Usam chapéus panamá e roupas brancas. O mais conhecido é Zé Pelintra. São extremamente caridosos.",
    atuacao: "Proteção nos caminhos, ajuda em situações difíceis de sobrevivência e cura de vícios.",
    elementos: "Cerveja branca, cigarro, coco e chapéu panamá.",
    saudacao: "Salve a Malandragem!",
    regencia: "Ogum / Iansã / Exu",
    flores: "Cravos vermelhos e brancos",
    frutas: "Abacaxi, coco",
    ferramentas: "Baralho, dados, navalha",
  },
];

export const esquerda: Esquerda[] = [
  {
    slug: "exu",
    nome: "Exu",
    tipo: "Exu",
    resumo: "O guardião dos caminhos, executor da lei e equilibrador das energias.",
    caracteristicas: "Atuam no esgotamento dos vícios e na proteção dos terreiros e médiuns. São os mensageiros entre os homens e os Orixás.",
    atuacao: "Proteção, abertura de caminhos, quebra de demandas e vitalização.",
    elementos: "Cachaça (marafo), fumo (charuto), dendê e pimenta.",
    saudacao: "Laroyé Exu! Exu é Mojubá!",
    regencia: "Vitalização e Ordenação",
    oferendas: "Padê, bifes acebolados no dendê, aguardente.",
    cores: "Preto e Vermelho",
    nomesFamosos: ["Exu Tranca-Ruas", "Exu Marabô", "Exu Caveira", "Exu Tiriri", "Exu Sete Encruzilhadas"],
    qualidades: "Rigor, proteção, disciplina, vitalidade e retidão na execução da Lei Divina.",
  },
  {
    slug: "pomba-gira",
    nome: "Pomba Gira",
    tipo: "Pomba Gira",
    resumo: "A guardiã do desejo, do estímulo e da auto-estima feminina.",
    caracteristicas: "Atuam no campo do desejo e do estímulo, ajudando na limpeza emocional e no fortalecimento do poder pessoal.",
    atuacao: "Limpeza sentimental, estímulo à vida, proteção e quebra de amarrações.",
    elementos: "Champanhe, cidra, cigarrilhas, batom e rosas vermelhas.",
    saudacao: "Laroyé Pomba Gira! Salve sua força!",
    regencia: "Desejo e Estímulo",
    oferendas: "Padês doces, frutas vermelhas, bebidas finas.",
    cores: "Vermelho e Preto ou Vermelho e Dourado",
    nomesFamosos: ["Pomba Gira Maria Padilha", "Pomba Gira Sete Saias", "Pomba Gira Menina", "Pomba Gira do Cemitério", "Pomba Gira da Figueira"],
    qualidades: "Autoestima, sensualidade sagrada, alegria, firmeza emocional e quebra de amarras sentimentais.",
  },
  {
    slug: "exu-mirim",
    nome: "Exu Mirim",
    tipo: "Exu Mirim",
    resumo: "O mistério da intenção e do esgotamento das negatividades infantis.",
    caracteristicas: "Atuam na linha da intenção, desfazendo tramas mentais e esgotando o que há de negativo na pureza.",
    atuacao: "Desobsessão, quebra de magias mentais e limpeza de intenções ocultas.",
    elementos: "Garapa, refrigerantes, fumo e doces ácidos.",
    saudacao: "Laroyé Exu Mirim!",
    regencia: "Intenção e Esgotamento",
    oferendas: "Padês com mel ou melado, bebidas doces.",
    cores: "Preto e Vermelho (listrado)",
    nomesFamosos: ["Exu Mirim Toquinho", "Exu Mirim Brasinha", "Exu Mirim Calunguinha", "Exu Mirim Caveirinha"],
    qualidades: "Astúcia, esgotamento de negatividades mentais, revelação de intenções e proteção contra a malícia.",
  },
];

export type Oracao = {
  slug: string;
  titulo: string;
  destinatario: string;
  texto: string;
};

export const oracoes: Oracao[] = [
  {
    slug: "pai-nosso",
    titulo: "Pai Nosso",
    destinatario: "Oração Universal",
    texto:
      "Pai Nosso que estais nos céus, santificado seja o Vosso nome. Venha a nós o Vosso reino, seja feita a Vossa vontade, assim na terra como no céu. O pão nosso de cada dia nos dai hoje. Perdoai as nossas dívidas, assim como nós perdoamos aos nossos devedores. E não nos deixeis cair em tentação, mas livrai-nos do mal. Pois Vosso é o reino, o poder e a glória para sempre. Amém.",
  },
  {
    slug: "ave-maria",
    titulo: "Ave Maria",
    destinatario: "Oração à Mãe Divina",
    texto:
      "Ave Maria, cheia de graça, o Senhor é convosco. Bendita sois Vós entre as mulheres e bendito é o fruto do Vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós, pecadores, agora e na hora de nossa morte. Amém.",
  },
  {
    slug: "prece-de-cáritas",
    titulo: "Prece de Cáritas",
    destinatario: "Para abertura de trabalhos",
    texto:
      "Deus, nosso Pai, que sois todo Poder e Bondade, dai força àquele que passa pela provação, dai luz àquele que procura a verdade; ponde no coração do homem a compaixão e a caridade. Deus! dai ao viajor a estrela guia, ao aflito a consolação, ao doente o repouso. Pai! dai ao culpado o arrependimento, ao Espírito a verdade, à criança o guia, ao órfão o pai. Senhor! que a vossa bondade se estenda sobre tudo que criastes. Piedade, Senhor, para aqueles que vos não conhecem; esperança para aqueles que sofrem. Que a vossa bondade permita aos Espíritos consoladores derramarem por toda parte a paz, a esperança e a fé. Deus! um raio, uma faísca do vosso amor pode abrasar a terra; deixai-nos beber nas fontes dessa bondade fecunda e infinita, e todas as lágrimas secarão, todas as dores se acalmarão. Um só coração, um só pensamento subirá até Vós, como um grito de reconhecimento e de amor. Como Moisés sobre a montanha, nós Vos esperamos com os braços abertos, ó Poder, ó Bondade, ó Beleza, ó Perfeição, e queremos de alguma sorte merecer a vossa misericórdia. Deus! dai-nos a força de ajudar o progresso a fim de subirmos até Vós; dai-nos a caridade pura, dai-nos a fé e a razão; dai-nos a simplicidade que fará de nossas almas o espelho onde se refletirá a vossa imagem.",
  },
  {
    slug: "oracao-aos-pretos-velhos",
    titulo: "Oração aos Pretos-Velhos",
    destinatario: "Para conselho e amparo",
    texto:
      "Salve os Pretos-Velhos de Aruanda! Vovós e Vovôs, sábios da senzala, que carregaram nos ombros a dor do mundo e ainda assim encontraram força para amar. Trazei-nos vossa palavra mansa, vosso cachimbo de paz, vosso conselho que cura. Que a luz do Pai Maior nos abençoe por vossas mãos. Saravá Pai Joaquim! Saravá Vovó Maria Conga! Saravá os Pretos-Velhos de Aruanda!",
  },
  {
    slug: "oracao-de-ogum",
    titulo: "Oração de Ogum",
    destinatario: "Para abertura de caminhos",
    texto:
      "Ogum, meu Pai, guerreiro de fé, abridor de caminhos, defensor dos aflitos. Que vossa lança corte as demandas que cercam minha vida, que vosso escudo me proteja das energias densas, que vossa espada de luz me conduza à vitória. Ogunhê, meu Pai! Que assim seja, nas Vossas mãos.",
  },
  {
    slug: "oracao-de-oxala",
    titulo: "Oração a Oxalá",
    destinatario: "Para paz interior",
    texto:
      "Oxalá, meu Pai, Senhor da paz e da fé, cobri-me com vosso manto branco e tranquilizai meu coração. Que a vossa luz dissolva minhas angústias e me dê serenidade para aceitar o que não posso mudar, coragem para mudar o que posso, e sabedoria para distinguir uma coisa da outra. Epa Babá!",
  },
];

export const orixas: Orixa[] = [
  {
    slug: "oxala",
    nome: "Oxalá",
    resumo: "Orixá da Fé, da Paz e da Criação. É a vibração que sustenta o equilíbrio universal.",
    forcas: "Fé, Religiosidade, Paz e Equilíbrio.",
    entidades: "Pretos-Velhos e Caboclos da Linha Branca.",
    caracteristicas: "Oxalá é o regente do Trono da Fé. Sua energia é pura, cristalina e traz a paz para os corações aflitos.",
    trono: "Trono Masculino da Fé.",
    pedras: "Cristal de Quartzo Branco, Quartzo Leitoso.",
    ervas: "Tapete de Oxalá (Boldo), Manjericão Branco, Girassol.",
    flores: "Flores brancas em geral (Copos de Leite, Rosas Brancas).",
    frutas: "Uva verde, Pera, Maçã verde.",
    imageUrl: "https://7rs4y02yik.lovableproject.com",
  },
  {
    slug: "logunan",
    nome: "Logunan (Oiá)",
    resumo: "Orixá do Tempo e da Fé. É a guardiã da religiosidade e do tempo cronológico.",
    forcas: "Fé, Tempo, Religiosidade e Disciplina.",
    entidades: "Entidades que atuam na limpeza espiritual e no direcionamento da fé.",
    caracteristicas: "Logunan atua no Trono da Fé ao lado de Oxalá, mas no polo passivo/absorvente, esgotando o fanatismo.",
    trono: "Trono Feminino da Fé (Tempo).",
    pedras: "Cristal de Quartzo Fumê, Hematita.",
    ervas: "Eucalipto, Folhas de Bambu, Erva Cidreira.",
    flores: "Flores de cores sóbrias, Palmas brancas.",
    frutas: "Coco, Fruta-do-conde.",
    imageUrl: "https://images.unsplash.com/photo-1501139083538-0139583c060f?q=80&w=1000&auto=format&fit=crop",
  },
  {
    slug: "xango",
    nome: "Xangô",
    resumo: "Orixá da Justiça, do Equilíbrio e da Lei. Rege as pedreiras e o fogo transformador.",
    forcas: "Justiça, Equilíbrio, Razão e Firmeza.",
    entidades: "Caboclos de Xangô (Caboclo Pedra Branca, Sete Pedreiras).",
    caracteristicas: "Xangô é o senhor do trovão e do fogo. Sua energia traz a justiça divina para as situações da vida.",
    trono: "Trono Masculino da Justiça.",
    pedras: "Jaspe Marrom, Olho de Tigre, Granada.",
    ervas: "Levante, Manjericão Roxo, Folha de Louro.",
    flores: "Palmas Vermelhas, Cravo Vermelho.",
    frutas: "Melão, Manga, Caqui.",
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop",
  },
  {
    slug: "egunita",
    nome: "Egunitá (Oroiná)",
    resumo: "Orixá da Justiça e da Purificação. Rege le fogo purificador e a limpeza energética.",
    forcas: "Justiça, Purificação, Limpeza e Transformação.",
    entidades: "Ciganos e Entidades que trabalham com le fogo.",
    caracteristicas: "Egunitá atua no Trono da Justiça, consumindo as injustiças e as energias negativas pelo fogo divino.",
    trono: "Trono Feminino da Justiça (Fogo).",
    pedras: "Ágata de Fogo, Calcita Laranja.",
    ervas: "Canela, Manjericão, Alecrim.",
    flores: "Gérberas laranjas, Flores de cores quentes.",
    frutas: "Laranja, Tangerina.",
    imageUrl: "https://images.unsplash.com/photo-1520113526561-24558a0679b1?q=80&w=1000&auto=format&fit=crop",
  },
  {
    slug: "iemanja",
    nome: "Iemanjá",
    resumo: "Orixá da Geração e da Vida. Rege os oceanos e a maternidade divina.",
    forcas: "Geração, Maternidade, Amparo e Criatividade.",
    entidades: "Marinheiros e Caboclas do Mar.",
    caracteristicas: "Iemanjá é a mãe de todos. Sua energia é a da vida em expansão, protegendo a família e os laços afetivos.",
    trono: "Trono Feminino da Geração.",
    pedras: "Água Marinha, Pérola, Quartzo Azul.",
    ervas: "Alfazema, Rosas brancas, Pata de Vaca.",
    flores: "Rosas brancas, Palmas brancas.",
    frutas: "Melancia, Melão, Pera.",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop",
  },
  {
    slug: "ogum",
    nome: "Ogum",
    resumo: "Orixá da Lei e da Ordem. Rege os caminhos, as demandas e a proteção.",
    forcas: "Lei, Ordem, Caminhos e Proteção.",
    entidades: "Caboclos de Ogum (Ogum Beira-Mar, Ogum Megê).",
    caracteristicas: "Ogum é o guerreiro divino. Sua energia abre caminhos e protege contra as demandas negativas.",
    trono: "Trono Masculino da Lei (Ordenação).",
    pedras: "Hematita, Granada, Cianita Azul (Espada de Ogum).",
    ervas: "Espada de São Jorge, Aroeira, Quebra-Demanda.",
    flores: "Cravos vermelhos, Cristas de Galo.",
    frutas: "Manga espada, Pitanga.",
    imageUrl: "https://images.unsplash.com/photo-1582103287241-2762adba6c36?q=80&w=1000&auto=format&fit=crop",
  },
  {
    slug: "oxossi",
    nome: "Oxóssi",
    resumo: "Orixá do Conhecimento e da Fartura. Rege as matas e a expansão da consciência.",
    forcas: "Conhecimento, Fartura, Busca e Expansão.",
    entidades: "Caboclos de Oxóssi (Caboclo das Sete Encruzilhadas, Sete Flechas).",
    caracteristicas: "Oxóssi é o caçador de almas. Sua energia traz le conhecimento e a prosperidade espiritual.",
    trono: "Trono Masculino do Conhecimento.",
    pedras: "Quartzo Verde, Esmeralda, Amazonita.",
    ervas: "Guiné, Arruda, Folhas de Jurema.",
    flores: "Flores do campo, Samambaias.",
    frutas: "Coco, Frutas silvestres em geral.",
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1000&auto=format&fit=crop",
  },
  {
    slug: "oba",
    nome: "Obá",
    resumo: "Orixá do Conhecimento e da Concentração. Rege le foco e a verdade divina.",
    forcas: "Conhecimento, Concentração, Raciocínio e Verdade.",
    entidades: "Entidades que atuam na firmeza de pensamento e no estudo.",
    caracteristicas: "Obá atua paralisando os excessos de pensamento e trazendo a concentração necessária para o aprendizado.",
    trono: "Trono Feminino do Conhecimento.",
    pedras: "Madeira Petrificada, Turmalina Melancia.",
    ervas: "Hortelã, Folha de Eucalipto, Poejo.",
    flores: "Rosas amarelas, Lírios.",
    frutas: "Banana, Abacaxi.",
    imageUrl: "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?q=80&w=1000&auto=format&fit=crop",
  },
  {
    slug: "oxumare",
    nome: "Oxumaré",
    resumo: "Orixá do Amor e da Renovação. Rege le arco-íris e a renovação dos ciclos.",
    forcas: "Amor, Renovação, Transformação e Fluidez.",
    entidades: "Entidades que trabalham com a renovação de sentimentos.",
    caracteristicas: "Oxumaré é le movimento de renovação constante. Sua energia transmuta le que está estagnado.",
    trono: "Trono Masculino do Amor (Renovação).",
    pedras: "Fluorita, Opala, Cristais Multicoloridos.",
    ervas: "Erva Doce, Camomila, Folha de Louro.",
    flores: "Flores coloridas, Orquídeas.",
    frutas: "Uva rosada, Pêssego.",
    imageUrl: "https://images.unsplash.com/photo-1464618663641-bbdd760ae84a?q=80&w=1000&auto=format&fit=crop",
  },
  {
    slug: "oxum",
    nome: "Oxum",
    resumo: "Orixá do Amor, da Prosperidade e da Doçura. Rege as águas doces e los sentimentos.",
    forcas: "Amor, União, Prosperidade e Doçura.",
    entidades: "Caboclas de Oxum, sereias e entidades da linha do amor.",
    caracteristicas: "Oxum é a senhora do ouro e do amor. Sua energia agrega, une e traz prosperidade espiritual e material.",
    trono: "Trono Feminino do Amor.",
    pedras: "Quartzo Rosa, Citrino, Pirita.",
    ervas: "Melissa, Erva Doce, Rosas Amarelas.",
    flores: "Rosas amarelas, Lírios brancos.",
    frutas: "Melão, Damasco, Mamão.",
    imageUrl: "https://images.unsplash.com/photo-1440778303588-435521a205bc?q=80&w=1000&auto=format&fit=crop",
  },
  {
    slug: "iansa",
    nome: "Iansã",
    resumo: "Orixá da Lei e da Movimentação. Rege os ventos, as tempestades e a direção das almas.",
    forcas: "Lei, Direcionamento, Movimento e Força.",
    entidades: "Caboclas de Iansã (Cabocla Ventania, Sete Raios).",
    caracteristicas: "Iansã é a senhora dos ventos. Sua energia movimenta le que está parado e direciona as almas ao seu destino.",
    trono: "Trono Feminino da Lei (Direcionamento).",
    pedras: "Citrino, Ágata de Fogo, Quartzo Laranja.",
    ervas: "Espada de Iansã, Manjericão, Folha de Pitanga.",
    flores: "Flores vermelhas e amarelas, Palmas.",
    frutas: "Maçã vermelha, Cereja.",
    imageUrl: "https://images.unsplash.com/photo-1533134486753-c833f074868f?q=80&w=1000&auto=format&fit=crop",
  },
  {
    slug: "omulu",
    nome: "Omulú",
    resumo: "Orixá da Evolução e da Transformação Final. Rege a morte do que é negativo para le nascimento do novo.",
    forcas: "Evolução, Estabilidade, Finalização e Cura.",
    entidades: "Pretos-Velhos e Entidades das Almas.",
    caracteristicas: "Omulú é le senhor dos mistérios da vida e da morte. Sua energia paralisa le que está em desequilíbrio para permitir a evolução.",
    trono: "Trono Masculino da Evolução (Estabilidade).",
    pedras: "Ônix, Turmalina Negra, Ônix Preto.",
    ervas: "Folha de Alface, Manjericão Roxo, Sálvia.",
    flores: "Cravos brancos e roxos.",
    frutas: "Ameixa preta, Figo.",
    imageUrl: "https://images.unsplash.com/photo-1509023464722-18d996393ca8?q=80&w=1000&auto=format&fit=crop",
  },
  {
    slug: "obaluae",
    nome: "Obaluaiê",
    resumo: "Orixá da Evolução e da Cura. Rege a passagem dos níveis vibratórios e a cura das almas.",
    forcas: "Evolução, Transmutação, Cura e Conforto.",
    entidades: "Pretos-Velhos e Curadores espirituais.",
    caracteristicas: "Obaluaiê é le senhor da cura. Sua energia transmuta a dor em aprendizado e cura as feridas do espírito.",
    trono: "Trono Masculino da Evolução (Transmutação).",
    pedras: "Turmalina Negra, Quartzo Verde, Obsidiana.",
    ervas: "Sálvia, Manjericão, Erva de Bicho.",
    flores: "Palmas Brancas, Monsenhores.",
    frutas: "Uva preta, Jabuticaba.",
    imageUrl: "https://images.unsplash.com/photo-1531685254054-2a51d9328227?q=80&w=1000&auto=format&fit=crop",
  },
  {
    slug: "nana",
    nome: "Nanã Buruquê",
    resumo: "Orixá da Evolução e da Decantação. Rege os pântanos, a sabedoria ancestral e le esquecimento do passado.",
    forcas: "Evolução, Decantação, Sabedoria e Paciência.",
    entidades: "Pretos-Velhos e Vovós das Almas.",
    caracteristicas: "Nanã é a avó de todos. Sua energia decanta os sentimentos pesados e prepara le espírito para a nova encarnação.",
    trono: "Trono Feminino da Evolução.",
    pedras: "Ametista, Lepidolita, Fluorita Roxa.",
    ervas: "Manjericão, Alfazema, Folha de Taioba.",
    flores: "Flores roxas e lilás (Violetas, Rosas Roxas).",
    frutas: "Uva roxa, Figo roxo, Jabuticaba.",
    imageUrl: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1000&auto=format&fit=crop",
  },
];
