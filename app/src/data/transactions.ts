export interface Transaction {
  id: string;
  title: string;
  type: string;
  amount: string;
  amountColor: string;
  subAmount: string;
  subAmountColor: string;
  isAvatar: boolean;
  initials?: string;
  isAnonymous?: boolean;
  /** ID do cartão utilizado na transação, se aplicável */
  cardId?: string;
}

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    title: 'Lucas Silva - Transf',
    type: '@lucas_s',
    amount: '-R$ 143,82',
    amountColor: '#FFFFFF',
    subAmount: 'Hoje, 14:30',
    subAmountColor: '#8E8E93',
    isAvatar: true,
    initials: 'LS',
    cardId: '3',
  },
  {
    id: '2',
    title: 'Câmbio BRL → USD',
    type: 'Conversão de saldo',
    amount: '-R$ 2.450,80',
    amountColor: '#FFFFFF',
    subAmount: '+468,15 USD',
    subAmountColor: '#34C759',
    isAvatar: false,
    cardId: '2',
  },
  {
    id: '3',
    title: 'Desconhecido - Transf',
    type: '0x7a8b...291f',
    amount: '+R$ 389,45',
    amountColor: '#34C759',
    subAmount: 'Ontem, 16:15',
    subAmountColor: '#8E8E93',
    isAvatar: true,
    isAnonymous: true,
  },
  {
    id: '4',
    title: 'Maria Oliveira - Transf',
    type: '@mari_o',
    amount: '+R$ 88,20',
    amountColor: '#34C759',
    subAmount: 'Ontem, 09:15',
    subAmountColor: '#8E8E93',
    isAvatar: true,
    initials: 'MO',
    cardId: '1',
  },
  {
    id: '5',
    title: 'Spotify Premium',
    type: 'Assinatura',
    amount: '-R$ 21,90',
    amountColor: '#FFFFFF',
    subAmount: '20/05, 00:00',
    subAmountColor: '#8E8E93',
    isAvatar: false,
    cardId: '3',
  },
  {
    id: '6',
    title: 'Rafael Rocha - Pix',
    type: '@rafa_r',
    amount: '+R$ 500,00',
    amountColor: '#34C759',
    subAmount: '19/05, 18:44',
    subAmountColor: '#8E8E93',
    isAvatar: true,
    initials: 'RR',
    cardId: '2',
  },
];
