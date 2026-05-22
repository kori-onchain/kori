export interface CryptoFavorite {
  id: string;
  coingeckoId: string;
  name: string;
  symbol: string;
  balance: string;
  change: string;
  isPositive: boolean;
  points: number[];
  image: string;
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
    id: 'btc',
    coingeckoId: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    balance: '$67,420.00',
    change: '+1.8%',
    isPositive: true,
    points: [45, 42, 48, 55, 52, 60, 66, 63, 71, 74, 78, 86],
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    iconText: '₿',
    iconColor: '#F7931A',
    bgColor: 'rgba(247, 147, 26, 0.1)',
  },
  {
    id: 'eth',
    coingeckoId: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    balance: '$295.00',
    change: '+2.5%',
    isPositive: true,
    points: [30, 45, 38, 55, 48, 65, 58, 72, 60, 85, 78, 95],
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    iconText: 'Ξ',
    iconColor: '#627EEA',
    bgColor: 'rgba(98, 126, 234, 0.1)',
  },
  {
    id: 'sol',
    coingeckoId: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    balance: '$182.40',
    change: '+5.1%',
    isPositive: true,
    points: [28, 34, 32, 47, 44, 58, 54, 69, 64, 82, 76, 92],
    image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    iconText: 'S',
    iconColor: '#9945FF',
    bgColor: 'rgba(153, 69, 255, 0.12)',
  },
  {
    id: 'usdc',
    coingeckoId: 'usd-coin',
    name: 'USD Coin',
    symbol: 'USDC',
    balance: '$1.00',
    change: '+0.0%',
    isPositive: true,
    points: [52, 51, 52, 51, 52, 52, 51, 52, 51, 52, 52, 51],
    image: 'https://assets.coingecko.com/coins/images/6319/large/usdc.png',
    iconText: '$',
    iconColor: '#2775CA',
    bgColor: 'rgba(39, 117, 202, 0.12)',
  },
  {
    id: 'xrp',
    coingeckoId: 'ripple',
    name: 'Ripple',
    symbol: 'XRP',
    balance: '$1,550.30',
    change: '+8.0%',
    isPositive: true,
    points: [25, 35, 45, 40, 55, 65, 60, 75, 70, 80, 85, 100],
    image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
    iconText: '✕',
    iconColor: '#23292F',
    bgColor: 'rgba(255, 255, 255, 0.15)',
  },
  {
    id: 'bonk',
    coingeckoId: 'bonk',
    name: 'Bonk',
    symbol: 'BONK',
    balance: '$0.000021',
    change: '-3.2%',
    isPositive: false,
    points: [82, 78, 75, 70, 73, 64, 58, 61, 55, 50, 46, 42],
    image: 'https://assets.coingecko.com/coins/images/28600/large/bonk.jpg',
    iconText: 'B',
    iconColor: '#F2A900',
    bgColor: 'rgba(242, 169, 0, 0.12)',
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
