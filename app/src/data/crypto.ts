export interface CryptoFavorite {
  id: string;
  name: string;
  symbol: string;
  balance: string;
  change: string;
  isPositive: boolean;
  points: number[];
  iconText: string;
  iconColor: string;
  bgColor: string;
}

export interface CryptoPortfolioItem {
  id: string;
  name: string;
  symbol: string;
  amount: string;
  change: string;
  isPositive: boolean;
  points: number[];
  iconText: string;
  iconColor: string;
  bgColor: string;
}

export const MOCK_CRYPTO_FAVORITES: CryptoFavorite[] = [
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    balance: '$295.00',
    change: '+2.5%',
    isPositive: true,
    points: [30, 45, 38, 55, 48, 65, 58, 72, 60, 85, 78, 95],
    iconText: 'Ξ',
    iconColor: '#627EEA',
    bgColor: 'rgba(98, 126, 234, 0.1)',
  },
  {
    id: 'xrp',
    name: 'Ripple',
    symbol: 'XRP',
    balance: '$1,550.30',
    change: '+8.0%',
    isPositive: true,
    points: [25, 35, 45, 40, 55, 65, 60, 75, 70, 80, 85, 100],
    iconText: '✕',
    iconColor: '#23292F',
    bgColor: 'rgba(255, 255, 255, 0.15)',
  },
];

export const MOCK_CRYPTO_PORTFOLIO: CryptoPortfolioItem[] = [
  {
    id: 'eth_port',
    name: 'Ethereum',
    symbol: 'ETC',
    amount: '08.04786',
    change: '+2.50%',
    isPositive: true,
    points: [40, 50, 45, 60, 55, 70, 65, 75, 72, 85, 80, 95],
    iconText: 'Ξ',
    iconColor: '#627EEA',
    bgColor: 'rgba(98, 126, 234, 0.1)',
  },
  {
    id: 'btc_port',
    name: 'Bitcoin',
    symbol: 'BTC',
    amount: '02.04426',
    change: '-1.30%',
    isPositive: false,
    points: [80, 75, 70, 72, 65, 68, 55, 58, 50, 52, 45, 40],
    iconText: '₿',
    iconColor: '#F7931A',
    bgColor: 'rgba(247, 147, 26, 0.1)',
  },
  {
    id: 'ltc_port',
    name: 'Litecoin',
    symbol: 'LTC',
    amount: '06.05020',
    change: '+3.60%',
    isPositive: true,
    points: [30, 35, 45, 40, 50, 55, 60, 58, 65, 75, 72, 88],
    iconText: 'Ł',
    iconColor: '#BFBFBF',
    bgColor: 'rgba(191, 191, 191, 0.1)',
  },
];
