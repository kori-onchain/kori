// ─── Types ───────────────────────────────────────────────────────────

export type RiskLevel = 'baixo' | 'medio' | 'alto';
export type InvestmentType = 'renda_fixa' | 'renda_variavel' | 'cripto' | 'fundo' | 'previdencia' | 'staking';
export type BadgeColor = '#3B82F6' | '#8B5CF6' | '#F59E0B' | '#10B981' | '#EC4899' | '#9945FF';

export interface InvestmentItem {
  id: string;
  name: string;
  shortDescription: string;
  highlight: string;
  secondaryInfo: string;
  type: InvestmentType;
  badgeLabel: string;
  badgeColor: BadgeColor;
  risk: RiskLevel;
  liquidity: string;
  returnRate?: string;
  maturity?: string;
  taxFree?: boolean;
  icon: string;
}

export interface InvestmentCategory {
  id: string;
  title: string;
  items: InvestmentItem[];
}

export interface WalletAsset {
  id: string;
  name: string;
  percentage: number;
  value: string;
  color: string;
}

export interface EvolutionPoint {
  month: string;
  value: number;
}

// ─── Wallet Composition ──────────────────────────────────────────────

export const WALLET_COMPOSITION: WalletAsset[] = [
  { id: 'tesouro', name: 'Tesouro Direto', percentage: 40, value: 'R$ 17.192,20', color: '#F59E0B' },
  { id: 'cdb', name: 'CDB / LCI / LCA', percentage: 25, value: 'R$ 10.745,13', color: '#3B82F6' },
  { id: 'acoes', name: 'Ações', percentage: 15, value: 'R$ 6.447,08', color: '#8B5CF6' },
  { id: 'fiis', name: 'Fundos Imobiliários', percentage: 10, value: 'R$ 4.298,05', color: '#10B981' },
  { id: 'crypto', name: 'Criptoativos', percentage: 10, value: 'R$ 4.298,05', color: '#9945FF' },
];

// ─── Evolution Chart ─────────────────────────────────────────────────

export const PORTFOLIO_EVOLUTION: EvolutionPoint[] = [
  { month: 'Jan', value: 28500 },
  { month: 'Fev', value: 29200 },
  { month: 'Mar', value: 30100 },
  { month: 'Abr', value: 31800 },
  { month: 'Mai', value: 33400 },
  { month: 'Jun', value: 34200 },
  { month: 'Jul', value: 35900 },
  { month: 'Ago', value: 37100 },
  { month: 'Set', value: 38600 },
  { month: 'Out', value: 39800 },
  { month: 'Nov', value: 41200 },
  { month: 'Dez', value: 42980 },
];

// ─── RWA Categories ─────────────────────────────────────────────────

const TITULOS_PUBLICOS: InvestmentItem[] = [
  {
    id: 'tesouro_selic',
    name: 'Tesouro Selic',
    shortDescription: 'Rende a taxa Selic',
    highlight: '100% da Selic',
    secondaryInfo: 'Liquidez diária',
    type: 'renda_fixa',
    badgeLabel: 'Renda fixa',
    badgeColor: '#3B82F6',
    risk: 'baixo',
    liquidity: 'D+1',
    returnRate: '~14,25% a.a.',
    taxFree: false,
    icon: '🏛️',
  },
  {
    id: 'tesouro_ipca',
    name: 'Tesouro IPCA+',
    shortDescription: 'Protege da inflação',
    highlight: 'IPCA + 6,8%',
    secondaryInfo: 'Vence em 2029',
    type: 'renda_fixa',
    badgeLabel: 'Renda fixa',
    badgeColor: '#3B82F6',
    risk: 'baixo',
    liquidity: 'D+1',
    returnRate: 'IPCA + 6,8%',
    maturity: '2029',
    taxFree: false,
    icon: '📊',
  },
  {
    id: 'tesouro_pre',
    name: 'Tesouro Prefixado',
    shortDescription: 'Taxa fixa garantida',
    highlight: '13,5% a.a.',
    secondaryInfo: 'Vence em 2027',
    type: 'renda_fixa',
    badgeLabel: 'Renda fixa',
    badgeColor: '#3B82F6',
    risk: 'baixo',
    liquidity: 'D+1',
    returnRate: '13,5% a.a.',
    maturity: '2027',
    taxFree: false,
    icon: '🔒',
  },
  {
    id: 'tesouro_renda',
    name: 'Tesouro RendA+',
    shortDescription: 'Renda extra na aposentadoria',
    highlight: 'IPCA + 6,4%',
    secondaryInfo: 'Pagamento mensal em 2050',
    type: 'renda_fixa',
    badgeLabel: 'Renda fixa',
    badgeColor: '#3B82F6',
    risk: 'baixo',
    liquidity: 'Vencimento',
    returnRate: 'IPCA + 6,4%',
    maturity: '2050',
    taxFree: false,
    icon: '🧓',
  },
  {
    id: 'tesouro_educa',
    name: 'Tesouro Educa+',
    shortDescription: 'Planeje os estudos',
    highlight: 'IPCA + 6,2%',
    secondaryInfo: 'Pagamento mensal em 2036',
    type: 'renda_fixa',
    badgeLabel: 'Renda fixa',
    badgeColor: '#3B82F6',
    risk: 'baixo',
    liquidity: 'Vencimento',
    returnRate: 'IPCA + 6,2%',
    maturity: '2036',
    taxFree: false,
    icon: '🎓',
  },
];

const TITULOS_BANCARIOS: InvestmentItem[] = [
  {
    id: 'cdb',
    name: 'CDB',
    shortDescription: 'Equivale a um CDB',
    highlight: '118% do CDI',
    secondaryInfo: 'Vence em 3 anos',
    type: 'renda_fixa',
    badgeLabel: 'Renda fixa',
    badgeColor: '#3B82F6',
    risk: 'baixo',
    liquidity: 'D+1 ou vencimento',
    returnRate: '118% do CDI',
    maturity: '3 anos',
    taxFree: false,
    icon: '🏦',
  },
  {
    id: 'lci',
    name: 'LCI',
    shortDescription: 'Crédito Imobiliário',
    highlight: '97% do CDI',
    secondaryInfo: 'Isento de IR',
    type: 'renda_fixa',
    badgeLabel: 'Renda fixa',
    badgeColor: '#3B82F6',
    risk: 'baixo',
    liquidity: '90 dias',
    returnRate: '97% do CDI',
    maturity: '2 anos',
    taxFree: true,
    icon: '🏠',
  },
  {
    id: 'lca',
    name: 'LCA',
    shortDescription: 'Crédito do Agro',
    highlight: '95% do CDI',
    secondaryInfo: 'Isento de IR',
    type: 'renda_fixa',
    badgeLabel: 'Renda fixa',
    badgeColor: '#3B82F6',
    risk: 'baixo',
    liquidity: '90 dias',
    returnRate: '95% do CDI',
    maturity: '1 ano',
    taxFree: true,
    icon: '🌾',
  },
  {
    id: 'poupanca',
    name: 'Poupança',
    shortDescription: 'O mais tradicional',
    highlight: '6,17% + TR',
    secondaryInfo: 'Rende no aniversário',
    type: 'renda_fixa',
    badgeLabel: 'Renda fixa',
    badgeColor: '#3B82F6',
    risk: 'baixo',
    liquidity: 'Imediata',
    returnRate: '6,17% + TR',
    taxFree: true,
    icon: '🐷',
  },
];

const CREDITO_PRIVADO: InvestmentItem[] = [
  {
    id: 'debenture',
    name: 'Debêntures',
    shortDescription: 'Dívida de empresas',
    highlight: 'CDI + 2,5%',
    secondaryInfo: 'Incentivada (isenta IR)',
    type: 'renda_fixa',
    badgeLabel: 'Renda fixa',
    badgeColor: '#3B82F6',
    risk: 'medio',
    liquidity: 'Vencimento',
    returnRate: 'CDI + 2,5%',
    maturity: '5 anos',
    taxFree: true,
    icon: '📜',
  },
  {
    id: 'cri',
    name: 'CRI',
    shortDescription: 'Recebíveis Imobiliários',
    highlight: 'IPCA + 8,2%',
    secondaryInfo: 'Isento de IR',
    type: 'renda_fixa',
    badgeLabel: 'Renda fixa',
    badgeColor: '#3B82F6',
    risk: 'medio',
    liquidity: 'Vencimento',
    returnRate: 'IPCA + 8,2%',
    maturity: '4 anos',
    taxFree: true,
    icon: '🏗️',
  },
  {
    id: 'cra',
    name: 'CRA',
    shortDescription: 'Recebíveis do Agro',
    highlight: 'CDI + 3,0%',
    secondaryInfo: 'Isento de IR',
    type: 'renda_fixa',
    badgeLabel: 'Renda fixa',
    badgeColor: '#3B82F6',
    risk: 'medio',
    liquidity: 'Vencimento',
    returnRate: 'CDI + 3,0%',
    maturity: '3 anos',
    taxFree: true,
    icon: '🌱',
  },
];

const RENDA_VARIAVEL: InvestmentItem[] = [
  {
    id: 'acoes',
    name: 'Ações',
    shortDescription: 'Torne-se sócio',
    highlight: 'Ibovespa',
    secondaryInfo: 'Dividendos + valorização',
    type: 'renda_variavel',
    badgeLabel: 'Renda variável',
    badgeColor: '#8B5CF6',
    risk: 'alto',
    liquidity: 'D+2',
    icon: '📈',
  },
  {
    id: 'fiis',
    name: 'FIIs',
    shortDescription: 'Fundos Imobiliários',
    highlight: 'Aluguéis mensais',
    secondaryInfo: 'Rendimentos isentos de IR',
    type: 'renda_variavel',
    badgeLabel: 'Renda variável',
    badgeColor: '#8B5CF6',
    risk: 'medio',
    liquidity: 'D+2',
    taxFree: true,
    icon: '🏢',
  },
  {
    id: 'fiagro',
    name: 'FIAGRO',
    shortDescription: 'Fundos do Agronegócio',
    highlight: 'Dividendos do Agro',
    secondaryInfo: 'Terras e cadeias produtivas',
    type: 'renda_variavel',
    badgeLabel: 'Renda variável',
    badgeColor: '#8B5CF6',
    risk: 'medio',
    liquidity: 'D+2',
    icon: '🚜',
  },
  {
    id: 'etfs',
    name: 'ETFs',
    shortDescription: 'Diversificação passiva',
    highlight: 'BOVA11 / IVVB11',
    secondaryInfo: 'Copiam índices automaticamente',
    type: 'renda_variavel',
    badgeLabel: 'Renda variável',
    badgeColor: '#8B5CF6',
    risk: 'medio',
    liquidity: 'D+2',
    icon: '📦',
  },
  {
    id: 'bdrs',
    name: 'BDRs',
    shortDescription: 'Ações internacionais',
    highlight: 'Apple, Google, Amazon',
    secondaryInfo: 'Empresas globais no Brasil',
    type: 'renda_variavel',
    badgeLabel: 'Renda variável',
    badgeColor: '#8B5CF6',
    risk: 'alto',
    liquidity: 'D+2',
    icon: '🌍',
  },
  {
    id: 'futuro_opcoes',
    name: 'Derivativos',
    shortDescription: 'Futuros e Opções',
    highlight: 'Hedge & Alavancagem',
    secondaryInfo: 'Dólar, juros, índices',
    type: 'renda_variavel',
    badgeLabel: 'Renda variável',
    badgeColor: '#8B5CF6',
    risk: 'alto',
    liquidity: 'D+1',
    icon: '⚡',
  },
];

const FUNDOS: InvestmentItem[] = [
  {
    id: 'fundo_rf',
    name: 'Fundo Renda Fixa',
    shortDescription: 'Gestão profissional',
    highlight: '110% do CDI',
    secondaryInfo: 'Títulos públicos e crédito',
    type: 'fundo',
    badgeLabel: 'Fundo',
    badgeColor: '#10B981',
    risk: 'baixo',
    liquidity: 'D+1',
    returnRate: '110% do CDI',
    icon: '🛡️',
  },
  {
    id: 'fundo_multi',
    name: 'Fundo Multimercado',
    shortDescription: 'Estratégia mista',
    highlight: 'CDI + 4,5%',
    secondaryInfo: 'Ações, juros, dólar, ouro',
    type: 'fundo',
    badgeLabel: 'Fundo',
    badgeColor: '#10B981',
    risk: 'medio',
    liquidity: 'D+30',
    returnRate: 'CDI + 4,5%',
    icon: '🎯',
  },
  {
    id: 'fundo_acoes',
    name: 'Fundo de Ações',
    shortDescription: 'Superar o Ibovespa',
    highlight: 'Ibovespa + alfa',
    secondaryInfo: 'Gestão ativa em renda variável',
    type: 'fundo',
    badgeLabel: 'Fundo',
    badgeColor: '#10B981',
    risk: 'alto',
    liquidity: 'D+30',
    icon: '🚀',
  },
  {
    id: 'fundo_cambial',
    name: 'Fundo Cambial',
    shortDescription: 'Exposição ao dólar',
    highlight: 'Variação USD/BRL',
    secondaryInfo: 'Proteção cambial',
    type: 'fundo',
    badgeLabel: 'Fundo',
    badgeColor: '#10B981',
    risk: 'medio',
    liquidity: 'D+1',
    icon: '💱',
  },
];

const PREVIDENCIA: InvestmentItem[] = [
  {
    id: 'pgbl',
    name: 'PGBL',
    shortDescription: 'Deduz até 12% do IR',
    highlight: 'Benefício fiscal',
    secondaryInfo: 'Declaração completa',
    type: 'previdencia',
    badgeLabel: 'Previdência',
    badgeColor: '#EC4899',
    risk: 'baixo',
    liquidity: 'Longo prazo',
    icon: '🧓',
  },
  {
    id: 'vgbl',
    name: 'VGBL',
    shortDescription: 'IR só sobre rendimento',
    highlight: 'Tributação eficiente',
    secondaryInfo: 'Declaração simplificada',
    type: 'previdencia',
    badgeLabel: 'Previdência',
    badgeColor: '#EC4899',
    risk: 'baixo',
    liquidity: 'Longo prazo',
    icon: '🏖️',
  },
];

// ─── Crypto / On-chain ───────────────────────────────────────────────

export const CRYPTO_ASSETS: InvestmentItem[] = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    shortDescription: 'Ouro digital',
    highlight: 'BTC',
    secondaryInfo: 'A maior criptomoeda',
    type: 'cripto',
    badgeLabel: 'Cripto',
    badgeColor: '#F59E0B',
    risk: 'alto',
    liquidity: 'Imediata',
    icon: '₿',
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    shortDescription: 'Plataforma de contratos',
    highlight: 'ETH',
    secondaryInfo: 'Smart contracts',
    type: 'cripto',
    badgeLabel: 'Cripto',
    badgeColor: '#F59E0B',
    risk: 'alto',
    liquidity: 'Imediata',
    icon: 'Ξ',
  },
  {
    id: 'solana',
    name: 'Solana',
    shortDescription: 'Blockchain ultra rápida',
    highlight: 'SOL',
    secondaryInfo: 'Transações em milissegundos',
    type: 'cripto',
    badgeLabel: 'Cripto',
    badgeColor: '#F59E0B',
    risk: 'alto',
    liquidity: 'Imediata',
    icon: 'S',
  },
];

export const STAKING_ASSETS: InvestmentItem[] = [
  {
    id: 'stake_eth',
    name: 'Staking ETH',
    shortDescription: 'Valide a rede Ethereum',
    highlight: '3,8% APY',
    secondaryInfo: 'Lock: flexível',
    type: 'staking',
    badgeLabel: 'Staking',
    badgeColor: '#9945FF',
    risk: 'medio',
    liquidity: 'Flexível',
    returnRate: '3,8% APY',
    icon: 'Ξ',
  },
  {
    id: 'stake_sol',
    name: 'Staking SOL',
    shortDescription: 'Valide a rede Solana',
    highlight: '7,2% APY',
    secondaryInfo: 'Lock: ~2 dias',
    type: 'staking',
    badgeLabel: 'Staking',
    badgeColor: '#9945FF',
    risk: 'medio',
    liquidity: '~2 dias',
    returnRate: '7,2% APY',
    icon: 'S',
  },
  {
    id: 'stake_ada',
    name: 'Staking ADA',
    shortDescription: 'Valide a rede Cardano',
    highlight: '4,5% APY',
    secondaryInfo: 'Lock: nenhum',
    type: 'staking',
    badgeLabel: 'Staking',
    badgeColor: '#9945FF',
    risk: 'medio',
    liquidity: 'Imediata',
    returnRate: '4,5% APY',
    icon: '₳',
  },
  {
    id: 'stake_dot',
    name: 'Staking DOT',
    shortDescription: 'Valide a rede Polkadot',
    highlight: '11,5% APY',
    secondaryInfo: 'Lock: 28 dias',
    type: 'staking',
    badgeLabel: 'Staking',
    badgeColor: '#9945FF',
    risk: 'medio',
    liquidity: '28 dias',
    returnRate: '11,5% APY',
    icon: '●',
  },
];

// ─── Grouped RWA Categories ─────────────────────────────────────────

export const RWA_CATEGORIES: InvestmentCategory[] = [
  { id: 'titulos_publicos', title: 'Títulos Públicos (Governo)', items: TITULOS_PUBLICOS },
  { id: 'titulos_bancarios', title: 'Títulos Bancários', items: TITULOS_BANCARIOS },
  { id: 'credito_privado', title: 'Crédito Privado', items: CREDITO_PRIVADO },
  { id: 'renda_variavel', title: 'Renda Variável', items: RENDA_VARIAVEL },
  { id: 'fundos', title: 'Fundos de Investimento', items: FUNDOS },
  { id: 'previdencia', title: 'Previdência Privada', items: PREVIDENCIA },
];

export const ONCHAIN_CATEGORIES: InvestmentCategory[] = [
  { id: 'cripto', title: 'Criptoativos', items: CRYPTO_ASSETS },
  { id: 'staking', title: 'Staking', items: STAKING_ASSETS },
];
