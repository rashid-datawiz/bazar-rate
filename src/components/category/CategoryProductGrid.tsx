"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

interface Product {
  id: string;
  slug: string;
  nameBn: string;
  categoryNameBn?: string;
  category?: string;
  categoryIcon?: string;
  emoji?: string;
  icon?: string;
  image?: string;
  unit: string;
  today: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
}

interface CategoryProductGridProps {
  rawProducts: unknown[];
  categoryIcon?: string;
}

const units: Record<string, string> = {
  kg: "প্রতি কেজি",
  litre: "প্রতি লিটার",
  liter: "প্রতি লিটার",
  dozen: "প্রতি ডজন",
  piece: "প্রতি পিস",
};

function formatPrice(value: number): string {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number): string {
  return new Intl.NumberFormat("bn-BD", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(Math.abs(value));
}

function normalizeProduct(raw: unknown): Product | null {
  if (!raw || typeof raw !== "object") return null;

  const item = raw as Record<string, unknown>;

  const id = String(item.id ?? item._id ?? item.slug ?? "");
  const slug = String(item.slug ?? id);

  if (!id || !slug) return null;

  const rawChange =
    item.change && typeof item.change === "object"
      ? (item.change as Record<string, unknown>)
      : {};

  const rawDirection = rawChange.dir ?? item.direction ?? "flat";
  const rawPercent = Number(
    rawChange.pct ??
      item.changePercent ??
      item.change_percentage ??
      0,
  );

  const rawToday = Number(item.today ?? item.price ?? 0);

  const iconValue =
    typeof item.categoryIcon === "string"
      ? item.categoryIcon
      : typeof item.emoji === "string"
        ? item.emoji
        : typeof item.icon === "string"
          ? item.icon
          : undefined;

  return {
    id,
    slug,

    nameBn:
      typeof item.nameBn === "string"
        ? item.nameBn
        : typeof item.name === "string"
          ? item.name
          : "নামহীন পণ্য",

    categoryNameBn:
      typeof item.categoryNameBn === "string"
        ? item.categoryNameBn
        : typeof item.categoryName === "string"
          ? item.categoryName
          : undefined,

    category:
      typeof item.category === "string"
        ? item.category
        : undefined,

    categoryIcon: iconValue,
    emoji: iconValue,
    icon: iconValue,

    image:
      typeof item.image === "string" && item.image.trim()
        ? item.image
        : typeof item.imageUrl === "string" && item.imageUrl.trim()
          ? item.imageUrl
          : undefined,

    unit: typeof item.unit === "string" ? item.unit : "kg",

    today: Number.isFinite(rawToday) ? rawToday : 0,

    change: {
      dir:
        rawDirection === "up" ||
        rawDirection === "down" ||
        rawDirection === "flat"
          ? rawDirection
          : "flat",

      pct: Number.isFinite(rawPercent) ? rawPercent : 0,
    },
  };
}

function ProductCard({
  product,
  categoryIcon,
}: {
  product: Product;
  categoryIcon?: string;
}) {
  const { dir, pct } = product.change;

  const badgeStyle =
    dir === "up"
      ? "bg-red-50 text-red-600"
      : dir === "down"
        ? "bg-emerald-50 text-emerald-700"
        : "bg-gray-100 text-gray-600";

  const symbol =
    dir === "up" ? "▲" : dir === "down" ? "▼" : "—";

  // Use a product-specific icon first, then the category icon.
  const icon =
    product.emoji ??
    product.categoryIcon ??
    product.icon ??
    categoryIcon ??
    "🛒";

  const unitLabel = units[product.unit] ?? `প্রতি ${product.unit}`;

  return (
    <Link
      href={`/product/${encodeURIComponent(product.id)}`}
      aria-label={`${product.nameBn} - বিস্তারিত দেখুন`}
      className="group flex min-w-0 flex-col rounded-2xl border border-[#DFE8DF] bg-white p-4 transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F0F5EF] text-3xl">
          {product.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image}
              alt={product.nameBn}
              loading="lazy"
              className="h-full w-full object-contain p-1"
              onError={(event) => {
                // If the image fails, reveal the fallback icon.
                event.currentTarget.style.display = "none";
                const fallback =
                  event.currentTarget.nextElementSibling as HTMLElement | null;

                if (fallback) {
                  fallback.style.display = "flex";
                }
              }}
            />
          ) : null}

          <span
            aria-hidden="true"
            className={`h-full w-full items-center justify-center ${
              product.image ? "hidden" : "flex"
            }`}
          >
            {icon}
          </span>
        </div>

        <div className="min-w-0">
          <p className="line-clamp-1 text-xs font-medium text-emerald-700">
            {product.categoryNameBn ??
              product.category ??
              "পণ্য"}
          </p>

          <h2 className="mt-1 line-clamp-2 font-bold text-[#202B23] transition group-hover:text-emerald-800">
            {product.nameBn}
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            {unitLabel}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs text-slate-500">আজকের দাম</p>

          <p className="mt-1 font-extrabold text-[#202B23]">
            {formatPrice(product.today)} টাকা
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1.5 text-xs font-bold ${badgeStyle}`}
        >
          {symbol} {formatPercent(pct)}%
        </span>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-3">
        <span className="text-sm font-semibold text-emerald-800">
          বিস্তারিত দেখুন →
        </span>
      </div>
    </Link>
  );
}

export default function CategoryProductGrid({
  rawProducts,
  categoryIcon,
}: CategoryProductGridProps) {
  const [sort, setSort] = useState("default");

  const products = useMemo(
    () =>
      rawProducts
        .map(normalizeProduct)
        .filter((product): product is Product => product !== null),
    [rawProducts],
  );

  const sortedProducts = useMemo(() => {
    const result = [...products];

    switch (sort) {
      case "price-low":
        return result.sort((a, b) => a.today - b.today);

      case "price-high":
        return result.sort((a, b) => b.today - a.today);

      case "name":
        return result.sort((a, b) =>
          a.nameBn.localeCompare(b.nameBn, "bn"),
        );

      case "change":
        return result.sort(
          (a, b) =>
            Math.abs(b.change.pct) - Math.abs(a.change.pct),
        );

      default:
        return result;
    }
  }, [products, sort]);

  return (
    <>
      <section className="mt-7 flex items-center justify-end gap-3 rounded-2xl border border-[#DFE8DF] bg-white/80 p-4">
        <label
          htmlFor="category-sort"
          className="text-sm text-slate-500"
        >
          সাজান
        </label>

        <select
          id="category-sort"
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          className="select select-bordered select-sm rounded-xl border-stone-300 bg-white"
        >
          <option value="default">ডিফল্ট</option>
          <option value="price-low">দাম: কম থেকে বেশি</option>
          <option value="price-high">দাম: বেশি থেকে কম</option>
          <option value="name">পণ্যের নাম</option>
          <option value="change">দামের পরিবর্তন</option>
        </select>
      </section>

      <p className="mb-4 mt-5 text-sm text-slate-500">
        মোট {products.length}টি পণ্য দেখানো হচ্ছে
      </p>

      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 pb-10 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categoryIcon={categoryIcon}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-emerald-100 bg-white p-8 text-center text-slate-500">
          এই বিভাগে কোনো পণ্য পাওয়া যায়নি।
        </div>
      )}
    </>
  );
}
