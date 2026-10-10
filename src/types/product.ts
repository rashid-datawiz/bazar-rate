
export interface MarketPrice {
  market?: string;
  marketName?: string;
  name?: string;
  price: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  categoryName: string;
  image?: string;
  emoji?: string;
  categoryIcon?: string;
  unit: string;
  price: number;
  previousPrice?: number;
  priceChange: number;
  description?: string;
  marketPrices: MarketPrice[];
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  emoji: string;
}

export type SortOption = "default" | "price-asc" | "price-desc";
