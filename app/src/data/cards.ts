export type CardNetwork = 'mastercard' | 'visa';

export interface Card {
  id: string;
  name: string;
  last4: string;
  network: CardNetwork;
  currency: string;
  balance: string;
  balanceBRL: string;
  cardBg: string;
  accentColor: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  isFrozen: boolean;
  isOnlineEnabled: boolean;
  limitUsed: number;
  limitTotal: number;
}

export const MOCK_CARDS: Card[] = [
  {
    id: '1',
    name: 'EUR Card',
    last4: '4312',
    network: 'mastercard',
    currency: 'EUR',
    balance: '7.890,53',
    balanceBRL: 'R$ 9.120',
    cardBg: '#1A1A2E',
    accentColor: '#E94560',
    cardNumber: '5421 9843 7261 4312',
    expiry: '08/29',
    cvv: '842',
    isFrozen: false,
    isOnlineEnabled: true,
    limitUsed: 1842,
    limitTotal: 5000,
  },
  {
    id: '2',
    name: 'USD Card',
    last4: '8847',
    network: 'visa',
    currency: 'USD',
    balance: '3.215,00',
    balanceBRL: 'R$ 16.510',
    cardBg: '#0F2027',
    accentColor: '#00C9FF',
    cardNumber: '4532 1098 2345 8847',
    expiry: '03/27',
    cvv: '319',
    isFrozen: false,
    isOnlineEnabled: true,
    limitUsed: 620,
    limitTotal: 10000,
  },
  {
    id: '3',
    name: 'BRL Black',
    last4: '1193',
    network: 'mastercard',
    currency: 'BRL',
    balance: '12.440,00',
    balanceBRL: 'R$ 12.440',
    cardBg: '#111',
    accentColor: '#D4AF37',
    cardNumber: '5421 7730 4418 1193',
    expiry: '11/30',
    cvv: '507',
    isFrozen: false,
    isOnlineEnabled: false,
    limitUsed: 4100,
    limitTotal: 15000,
  },
];
