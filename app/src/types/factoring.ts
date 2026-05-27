export type InvestScreen =
  | 'amount'
  | 'biometric'
  | 'confirmed'
  | 'position'
  | 'withdrawn';

export type AnticipationScreen =
  | 'scan'
  | 'review'
  | 'biometric'
  | 'processing'
  | 'success';

export interface PoolInfo {
  id: string;
  name: string;
  yieldPerOp: string;
  minimumBRL: number;
  backing: string;
}

export interface InvestIntent {
  pool: PoolInfo;
  amountBRL: string;
  amountUSDC: string;
  networkFee: string;
  txHash?: string;
  yieldGross?: string;
  protocolFeePct?: number;
  protocolFee?: string;
  yieldNet?: string;
  yieldPct?: string;
  participation?: string;
  operationsFinanced?: number;
  finalBalanceBRL?: string;
  withdrawTxHash?: string;
}

export interface Receivable {
  id: string;
  valueBRL: number;
  dueDate: string;
  payer: string;
  source: string;
  daysToDue: number;
}

export interface AnticipationComparison {
  bankAmountBRL: number;
  bankDiscountPct: number;
  koraAmountBRL: number;
  koraDiscountPct: number;
  savingsBRL: number;
}

export interface AnticipationIntent {
  receivable: Receivable;
  comparison: AnticipationComparison;
  receivedBRL?: string;
  discountBRL?: string;
  previousBalanceBRL?: string;
  newBalanceBRL?: string;
  txHash?: string;
  processingTimeMs?: number;
}
