import type { PoolInfo, Receivable, AnticipationComparison } from '../types/factoring';

export const BRL_TO_USDC_RATE = 5.0;

export const MOCK_POOL: PoolInfo = {
  id: 'pool-factoring-001',
  name: 'Factoring — Renda Real',
  yieldPerOp: '~3%',
  minimumBRL: 50,
  backing: 'Recebíveis',
};

export const MOCK_RECEIVABLE: Receivable = {
  id: 'recv-001',
  valueBRL: 1000,
  dueDate: '25/jun/2026',
  payer: 'Cielo S.A.',
  source: 'CIELO · VENDA CARTÃO · 30 DIAS',
  daysToDue: 30,
};

export const MOCK_COMPARISON: AnticipationComparison = {
  bankAmountBRL: 930,
  bankDiscountPct: 7,
  koraAmountBRL: 970,
  koraDiscountPct: 3,
  savingsBRL: 40,
};

export const MOCK_PJ_BALANCE = {
  available: 120,
  billsToPay: 800,
  receivable30d: 1000,
};

const CHARS = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

export function generateMockTxHash(): string {
  let hash = '';
  for (let i = 0; i < 44; i++) {
    hash += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return hash;
}

export function shortenHash(hash: string): string {
  if (hash.length <= 14) return hash;
  return `${hash.slice(0, 7)}...${hash.slice(-5)}`;
}

export function brlToUsdc(brl: number): string {
  return (brl / BRL_TO_USDC_RATE).toFixed(2);
}
