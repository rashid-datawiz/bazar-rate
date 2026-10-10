
import Link from "next/link";
import type { Product } from "@/types/product";
import { formatPercent, formatTaka } from "@/lib/utils";

function getProductIcon(product: Product): string {
  return product.categoryIcon ?? product.emoji ?? product.image ?? "🛒";
}

export default function ProductCard({
  product,
}: {
  product: Product;
}) {
  const icon = getProductIcon(product);
  const changeColor =
    product.priceChange > 0
      ? "bg-emerald-50 text-emerald-700"
      : product.priceChange < 0
        ? "bg-red-50 text-red-700"
        : "bg-stone-100 text-stone-600";

  return (
    <Link
      href={`/product/${encodeURIComponent(product.slug)}`}
      className="group flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-4 transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
    >
      <div className="flex min-h-28 items-center justify-center rounded-xl bg-stone-50 text-6xl">
        {icon}
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        <p className="text-xs font-medium text-stone-500">
          {product.categoryName}
        </p>

        <h3 className="mt-1 text-lg font-bold text-stone-900 group-hover:text-emerald-800">
          {product.name}
        </h3>

        <p className="mt-1 text-sm text-stone-500">{product.unit}</p>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-4">
          <div>
            <p className="text-xs text-stone-500">আজকের দাম</p>
            <p className="mt-1 text-lg font-extrabold text-stone-900">
              {formatTaka(product.price)}
            </p>
          </div>

          <span
            className={`rounded-full px-2.5 py-1 text-xs font-bold ${changeColor}`}
          >
            {formatPercent(product.priceChange)}
          </span>
        </div>
      </div>
    </Link>
  );
}
