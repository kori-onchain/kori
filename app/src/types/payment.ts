export type RecipientType = 'id' | 'wallet';

export interface PaymentRecipient {
  type: RecipientType;
  /** Nome exibido — "Anônimo" para wallet */
  displayName: string;
  /** @handle para tipo 'id' */
  userId?: string;
  /** Endereço completo para tipo 'wallet' */
  walletAddress?: string;
  isAnonymous: boolean;
  isFavorite: boolean;
}

export interface PaymentIntent {
  recipient: PaymentRecipient;
  /** undefined = valor livre, usuário vai digitar */
  amount?: string;
  currency: 'BRL';
  cardId?: string;
}

export type PaymentScreen =
  | 'scan'
  | 'manual'
  | 'amount'
  | 'review'
  | 'paying'
  | 'receipt';
