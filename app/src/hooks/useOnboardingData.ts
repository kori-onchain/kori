export type SlideKind = "brand" | "pay" | "yield" | "finish";

export type Slide = {
  kind: SlideKind;
  eyebrow?: string;
  title: string;
  body: string;
};

export const useOnboardingData = () => {
  const slides: Slide[] = [
    {
      kind: "brand",
      title: "O banco que\nnasce on-chain.",
      body: "Sua conta vive na blockchain mais rápida do mundo. Sem agência, sem papel, sem fronteira.",
    },
    {
      kind: "pay",
      eyebrow: "01 / 02",
      title: "Dinheiro na\nvelocidade da rede.",
      body: "Transfira em segundos, com taxa que beira zero. Sem TED, sem boleto, sem horário bancário.",
    },
    {
      kind: "yield",
      eyebrow: "02 / 02",
      title: "Seu dinheiro\nnão dorme.",
      body: "Saldo parado rende on-chain, com transparência total. Você vê cada centavo render.",
    },
    {
      kind: "finish",
      title: "Sua conta on-chain\nem 30 segundos.",
      body: "Self-custody de verdade: as chaves são suas. A gente só deixa simples.",
    },
  ];

  const transactionMock = {
    avatarPlaceholder: "A",
    username: "@anaclara",
    verifiedText: "verificado on-chain · 9Drx...4tNm",
    amount: "R$ 240,00",
    feeLabel: "Taxa de rede",
    feeValue: "$0.0001",
    settlementLabel: "Liquidação",
    settlementValue: "~0,4s",
    networkLabel: "Rede",
    networkValue: "Solana",
    statusText: "Enviado · confirmado on-chain",
  };

  const yieldMock = {
    eyebrow: "Rendendo agora",
    amount: "R$ 8.420,18",
    apyText: "+R$ 412,80 · APY 15,2%",
    todayLabel: "Hoje",
    todayValue: "+R$ 4,82",
    monthLabel: "No mês",
    monthValue: "+R$ 138",
    liquidityLabel: "Liquidez",
    liquidityValue: "imediata",
  };

  const actions = {
    skipText: "pular",
    poweredBy: "powered by",
    brandLabel: "KORA",
    startButton: "Começar",
    nextButton: "Próximo",
    createAccountButton: "Criar conta",
    hasAccountButton: "Já tenho conta",
  };

  return {
    slides,
    transactionMock,
    yieldMock,
    actions,
  };
};
