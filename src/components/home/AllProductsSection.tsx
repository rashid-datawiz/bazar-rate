
import Link from "next/link";

interface ProductChange {
  dir?: "up" | "down" | "flat";
  pct?: number;
}

interface Product {
  id: string;
  slug: string;
  nameBn: string;
  category?: string;
  categoryNameBn?: string;
  categoryIcon?: string;
  emoji?: string;
  image?: string;
  unit: string;
  today: number;
  change: ProductChange;
}

const API_URL =
  "https://api.abcz.workers.dev/api/bazardor/products";

const unitLabels: Record<string, string> = {
  kg: "প্রতি কেজি",
  litre: "প্রতি লিটার",
  liter: "প্রতি লিটার",
  dozen: "প্রতি ডজন",
  piece: "প্রতি পিস",
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number) {
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
  const rawPercent =
    rawChange.pct ??
    item.changePercent ??
    item.change_percentage ??
    0;

  const percent = Number(rawPercent);

  const direction: ProductChange["dir"] =
    rawDirection === "up" ||
    rawDirection === "down" ||
    rawDirection === "flat"
      ? rawDirection
      : "flat";

  const rawToday = Number(item.today ?? item.price ?? 0);
  const imageValue =
    typeof item.image === "string"
      ? item.image
      : typeof item.imageUrl === "string"
        ? item.imageUrl
        : typeof item.image_url === "string"
          ? item.image_url
          : typeof item.thumbnail === "string"
            ? item.thumbnail
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
    category:
      typeof item.category === "string"
        ? item.category
        : undefined,
    categoryNameBn:
      typeof item.categoryNameBn === "string"
        ? item.categoryNameBn
        : typeof item.categoryName === "string"
          ? item.categoryName
          : undefined,
    categoryIcon:
      typeof item.categoryIcon === "string"
        ? item.categoryIcon
        : undefined,
    emoji:
      typeof item.emoji === "string" ? item.emoji : undefined,
    image: imageValue,
    unit: typeof item.unit === "string" ? item.unit : "kg",
    today: Number.isFinite(rawToday) ? rawToday : 0,
    change: {
      dir: direction,
      pct: Number.isFinite(percent) ? percent : 0,
    },
  };
}

function getProductsFromResponse(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;

  if (data && typeof data === "object") {
    const result = data as Record<string, unknown>;

    if (Array.isArray(result.data)) return result.data;
    if (Array.isArray(result.products)) return result.products;
  }

  return [];
}

function ChangeBadge({ change }: { change: ProductChange }) {
  const direction = change.dir ?? "flat";
  const percent = Number(change.pct ?? 0);

  const style =
    direction === "up"
      ? "bg-emerald-50 text-emerald-700"
      : direction === "down"
        ? "bg-red-50 text-red-700"
        : "bg-gray-100 text-gray-600";

  const symbol =
    direction === "up" ? "▲" : direction === "down" ? "▼" : "—";

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-bold ${style}`}
    >
      {symbol}
      {formatPercent(percent)}%
    </span>
  );
}

function AllProductCard({ product }: { product: Product }) {
  const mediaUrl =
    product.image ?? product.categoryIcon ?? product.emoji ?? undefined;
  const emoji = product.emoji ?? product.image ?? "🛒";
  const isImageUrl =
    typeof mediaUrl === "string" &&
    !/^[\u2600-\u27FF\u{1F000}-\u{1FAFF}]/u.test(mediaUrl) &&
    /^(https?:\/\/|\/)/i.test(mediaUrl);

  return (
    <Link
      href={`/product/${encodeURIComponent(product.id)}`}
      aria-label={`${product.nameBn} - বিস্তারিত দেখুন`}
      className="group flex h-full flex-col rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
    >
      <div className="mb-4 flex h-36 items-center justify-center overflow-hidden rounded-xl bg-[#F0F5EF] sm:h-40">
        {isImageUrl ? (
          // Use an ordinary img so remote API image hosts don't require
          // Next.js remotePatterns configuration.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaUrl}
            alt={product.nameBn}
            loading="lazy"
            className="h-full w-full object-contain p-3 transition duration-200 group-hover:scale-105"
            onError={(event) => {
              event.currentTarget.style.display = "none";
              const fallback = event.currentTarget.nextElementSibling as HTMLElement | null;
              if (fallback) fallback.style.display = "flex";
            }}
          />
        ) : (
          <span className="text-6xl" aria-hidden="true">
            {emoji}
          </span>
        )}

        {isImageUrl && (
          <span
            className="hidden text-6xl"
            aria-hidden="true"
          >
            {emoji}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <p className="text-xs font-medium text-emerald-700">
          {product.categoryNameBn ?? product.category ?? "বিভাগ"}
        </p>

        <h3 className="mt-1 text-base font-bold text-slate-800 transition group-hover:text-emerald-800 sm:text-lg">
          {product.nameBn}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {unitLabels[product.unit] ?? `প্রতি ${product.unit}`}
        </p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <div className="min-w-0">
            <p className="text-xs text-slate-500">আজকের দাম</p>
            <p className="mt-1 text-lg font-extrabold text-slate-900 sm:text-xl">
              {formatPrice(product.today)} টাকা
            </p>
          </div>

          <ChangeBadge change={product.change} />
        </div>

        <div className="mt-4 border-t border-slate-100 pt-3">
          <span className="text-sm font-semibold text-emerald-800">
            বিস্তারিত দেখুন →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function AllProductsSection() {
  let products: Product[] = [];
  let hasError = false;

  try {
    const response = await fetch(API_URL, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Products API returned ${response.status}`);
    }

    const data: unknown = await response.json();

    products = getProductsFromResponse(data)
      .map(normalizeProduct)
      .filter((product): product is Product => product !== null);
  } catch (error) {
    console.error("All products fetch failed:", error);
    hasError = true;
  }

  return (
    <section
      aria-labelledby="all-products-heading"
      className="py-10 sm:py-14"
    >
      <div className="mb-6">
        <h2
          id="all-products-heading"
          className="text-2xl font-extrabold text-slate-800 sm:text-3xl"
        >
          সব পণ্য
        </h2>

        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          নিত্যপ্রয়োজনীয় পণ্যের আজকের দাম ও বাজারদরের পরিবর্তন দেখুন
        </p>
      </div>

      {hasError ? (
        <p
          role="alert"
          className="rounded-xl border border-red-100 bg-white p-6 text-center text-red-700"
        >
          দুঃখিত, পণ্যের তথ্য লোড করা যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।
        </p>
      ) : products.length === 0 ? (
        <p className="rounded-xl border border-emerald-100 bg-white p-6 text-center text-slate-500">
          বর্তমানে কোনো পণ্যের তথ্য পাওয়া যায়নি।
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <AllProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
