
import Link from "next/link";
import { getProducts } from "@/lib/api";
import { formatTaka, formatPercent } from "@/lib/utils";
import type { Product } from "@/types/product";

export default async function PriceTicker() {
  let products: Product[] = [];

  try {
    products = await getProducts();
  } catch (error) {
    console.warn("Could not load ticker prices:", error);
  }

  if (products.length === 0) return null;

  const items = [...products, ...products];

  return (
    <div className="overflow-hidden border-b border-emerald-100 bg-emerald-50">
      <div className="ticker-track flex w-max items-center gap-8 py-3">
        {items.map((product, index) => (
          <Link
            key={`${product.id}-${index}`}
            href={`/product/${encodeURIComponent(product.id)}`}
            className="flex shrink-0 items-center gap-2 text-sm"
          >
            <span>{product.emoji}</span>
            <span className="font-medium text-stone-700">
              {product.name}
            </span>
            <span className="font-bold text-emerald-900">
              {formatTaka(product.price)}
            </span>
            <span
              className={
                product.priceChange > 0
                  ? "font-semibold text-emerald-700"
                  : product.priceChange < 0
                    ? "font-semibold text-red-600"
                    : "text-stone-500"
              }
            >
              {formatPercent(product.priceChange)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
