export const motivationalMessages = [
  "Cada linha de código é um passo em direção ao seu futuro.",
  "Consistência é a chave para o sucesso na programação.",
  "Hoje é um novo dia para aprender algo incrível!",
  "Seu esforço de hoje será seu orgulho de amanhã.",
  "Grandes desenvolvedores são feitos de pequenos commits diários.",
  "O conhecimento é o único investimento que sempre paga dividendos.",
  "Não é sobre ser perfeito, é sobre ser melhor que ontem.",
  "Cada bug resolvido é uma vitória conquistada.",
  "Programar é a arte de transformar ideias em realidade.",
  "Sua jornada de mil milhas começa com um único algoritmo."
];

export const getRandomMotivationalMessage = (): string => {
  const index = Math.floor(Math.random() * motivationalMessages.length);
  return motivationalMessages[index];
};

export const getTimeBasedMessage = (): string => {
  const hour = new Date().getHours();
  
  if (hour < 12) {
    return "Comece o dia com energia! Cada manhã é uma nova oportunidade.";
  } else if (hour < 18) {
    return "Continue focado! Você está construindo seu futuro linha por linha.";
  } else {
    return "Finalize o dia com orgulho! Seu esforço está valendo a pena.";
  }
};
