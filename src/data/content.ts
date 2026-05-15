export type Estudo = {
  slug: string;
  titulo: string;
  resumo: string;
  categoria: "Fundamentos" | "Entidades" | "Ritualística" | "Avançado";
  duracao: string;
  premium?: boolean;
  conteudo: string[];
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
