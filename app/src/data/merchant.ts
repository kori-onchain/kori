export interface Product {
  id: string;
  name: string;
  description: string;
  category: 'Smartphones' | 'Kitchen' | 'Game Consoles' | 'Other';
  price: number;
  originalPrice?: number;
  discountBadge?: string;
  rating?: number;
  imageUrl?: string;
  isNft?: boolean;
  nftLabel?: 'NFT' | 'cNFT';
}

export interface SaleItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
}

export interface Sale {
  id: string;
  buyerName: string;
  amount: number;
  items: SaleItem[];
  createdAt: string;
}

export interface TopSellingItem {
  id: string;
  name: string;
  amount: number;
  revenue: number;
  imageUrl?: string;
}

export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'iPhone 15 Pro',
    description: 'Apple',
    category: 'Smartphones',
    price: 8999.0,
    originalPrice: 10999.0,
    discountBadge: '-18%',
    rating: 4.9,
    imageUrl:
      'https://images.unsplash.com/photo-1592286927505-1def25115558?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'p2',
    name: 'Galaxy S24 Ultra',
    description: 'Samsung',
    category: 'Smartphones',
    price: 7499.0,
    originalPrice: 8999.0,
    discountBadge: '-16%',
    rating: 4.8,
    imageUrl:
      'https://images.unsplash.com/photo-1610792516307-bd7e6a8d2f7c?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'p3',
    name: 'PlayStation 5 Edição Kori',
    description: 'Sony',
    category: 'Game Consoles',
    price: 3899.0,
    originalPrice: 4499.0,
    discountBadge: '-13%',
    rating: 4.9,
    imageUrl:
      'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&q=80&w=400',
    isNft: true,
    nftLabel: 'NFT',
  },
  {
    id: 'p4',
    name: 'Air Fryer 5L',
    description: 'Mondial',
    category: 'Kitchen',
    price: 449.9,
    originalPrice: 599.9,
    discountBadge: '-25%',
    rating: 4.6,
    imageUrl:
      'https://images.unsplash.com/photo-1626078436694-a72d4e6b1c3a?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'p5',
    name: 'Cafeteira Espresso',
    description: 'Nespresso',
    category: 'Kitchen',
    price: 1299.0,
    rating: 4.7,
    imageUrl:
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&q=80&w=400',
    isNft: true,
    nftLabel: 'cNFT',
  },
  {
    id: 'p6',
    name: 'Xbox Series X',
    description: 'Microsoft',
    category: 'Game Consoles',
    price: 4299.0,
    rating: 4.8,
    imageUrl:
      'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&q=80&w=400',
  },
];

export const mockSales: Sale[] = [
  {
    id: 's1',
    buyerName: 'Marina Souza',
    amount: 8999.0,
    items: [{ productId: 'p1', name: 'iPhone 15 Pro', qty: 1, price: 8999.0 }],
    createdAt: '2026-05-25T10:14:00Z',
  },
  {
    id: 's2',
    buyerName: 'Joao Pereira',
    amount: 1748.9,
    items: [
      { productId: 'p4', name: 'Air Fryer 5L', qty: 1, price: 449.9 },
      { productId: 'p5', name: 'Cafeteira Espresso', qty: 1, price: 1299.0 },
    ],
    createdAt: '2026-05-25T09:42:00Z',
  },
  {
    id: 's3',
    buyerName: 'Carla Mendes',
    amount: 3899.0,
    items: [{ productId: 'p3', name: 'PlayStation 5', qty: 1, price: 3899.0 }],
    createdAt: '2026-05-24T21:08:00Z',
  },
  {
    id: 's4',
    buyerName: 'Lucas Ribeiro',
    amount: 449.9,
    items: [{ productId: 'p4', name: 'Air Fryer 5L', qty: 1, price: 449.9 }],
    createdAt: '2026-05-24T18:30:00Z',
  },
];

export const topSellingItems: TopSellingItem[] = [
  {
    id: 't1',
    name: 'iPhone 15 Pro',
    amount: 32,
    revenue: 287968.0,
    imageUrl:
      'https://images.unsplash.com/photo-1592286927505-1def25115558?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 't2',
    name: 'PlayStation 5',
    amount: 21,
    revenue: 81879.0,
    imageUrl:
      'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 't3',
    name: 'Air Fryer 5L',
    amount: 18,
    revenue: 8098.2,
    imageUrl:
      'https://images.unsplash.com/photo-1626078436694-a72d4e6b1c3a?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 't4',
    name: 'Galaxy S24 Ultra',
    amount: 14,
    revenue: 104986.0,
    imageUrl:
      'https://images.unsplash.com/photo-1610792516307-bd7e6a8d2f7c?auto=format&fit=crop&q=80&w=400',
  },
];
