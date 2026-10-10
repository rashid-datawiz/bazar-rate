import Link from "next/link";

interface ProductChange {
  dir?: "up" | "down" | "flat";
  pct?: number;
}

interface Product {
  id: string | number;
  slug: string;
  nameBn?: string;
  name?: string;
  category?: string;
  categoryName?: string;
  categoryNameBn?: string;
  categoryIcon?: string;
  emoji?: string;
  image?: string;
  unit?: string;
  today?: number;
  price?: number;
  change?: ProductChange;
}

const API_URL = "https://api.abcz.workers.dev/api/bazardor/products";

function normalizeProduct(raw: unknown): Product | null {
  if (!raw || typeof raw !== "object") return null;

  const item = raw as Record<string, unknown>;
  const rawId = item.id ?? item._id ?? item.slug ?? String(Date.now());
  const id = String(rawId);
  const slug = String(item.slug ?? id);
  const nameBn =
    typeof item.nameBn === "string"
      ? item.nameBn
      : typeof item.name === "string"
        ? item.name
        : "Unnamed Product";
  const categoryNameBn =
    typeof item.categoryNameBn === "string"
      ? item.categoryNameBn
      : typeof item.categoryName === "string"
        ? item.categoryName
        : typeof item.category === "string"
          ? item.category
          : "বিভাগ";

  const rawChange = item.change && typeof item.change === "object" ? item.change as Record<string, unknown> : {};
  const pctValue = Number(rawChange.pct ?? item.changePercent ?? item.change_percentage ?? 0);
  const dirValue = rawChange.dir ?? item.direction ?? "flat";
  const change: ProductChange = {
    pct: Number.isFinite(pctValue) ? pctValue : 0,
    dir: dirValue === "up" || dirValue === "down" || dirValue === "flat" ? dirValue : "flat",
  };

  return {
    id,
    slug,
    nameBn,
    categoryNameBn,
    categoryIcon:
      typeof item.categoryIcon === "string"
        ? item.categoryIcon
        : typeof item.emoji === "string"
          ? item.emoji
          : undefined,
    emoji:
      typeof item.emoji === "string"
        ? item.emoji
        : typeof item.categoryIcon === "string"
          ? item.categoryIcon
          : undefined,
    image:
      typeof item.image === "string"
        ? item.image
        : typeof item.imageUrl === "string"
          ? item.imageUrl
          : undefined,
    unit:
      typeof item.unit === "string"
        ? item.unit
        : "কেজি",
    today: Number(item.today ?? item.price ?? 0),
    price: Number(item.price ?? item.today ?? 0),
    change,
  };
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 0,
  }).format(value);
}

function ProductCard({
  product,
  direction,
}: {
  product: Product;
  direction: "up" | "down";
}) {
  const icon = product.image || product.categoryIcon || product.emoji || "🛒";
  const pct = Number(product.change?.pct ?? 0);
  const isUp = direction === "up";

  return (
    <Link
      href={`/product/${encodeURIComponent(String(product.slug))}`}
      className="group flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-4 transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
    >
      <div className="mb-3 flex items-start justify-start">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-stone-50 text-3xl shadow-sm ring-1 ring-stone-100">
          {icon}
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <p className="text-xs font-medium text-stone-500">
          {product.categoryNameBn ?? product.categoryName ?? product.category ?? "বিভাগ"}
        </p>

        <h3 className="mt-1 text-lg font-bold text-stone-900 group-hover:text-emerald-800">
          {product.nameBn ?? product.name ?? "পণ্য"}
        </h3>

        <p className="mt-1 text-sm text-stone-500">
          {product.unit ?? "কেজি"}
        </p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <div>
            <p className="text-xs text-stone-500">আজকের দাম</p>
            <p className="mt-1 text-lg font-extrabold text-stone-900">
              ৳{formatPrice(Number(product.today ?? product.price ?? 0))}
            </p>
          </div>

          <span
            className={`rounded-full px-2.5 py-1 text-xs font-bold ${
              isUp
                ? "bg-red-50 text-red-700"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {isUp ? "+" : "−"}
            {Math.abs(pct).toFixed(1)}%
          </span>
        </div>
      </div>
    </Link>
  );
}

const PriceMovementSections = async () => {
  let products: Product[] = [];

  try {
    const res = await fetch(API_URL, {
      next: { revalidate: 60 },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.status}`);
    }

    const data: unknown = await res.json();

    const rawProducts: unknown[] = Array.isArray(data)
      ? data
      : data && typeof data === "object" && Array.isArray((data as Record<string, unknown>).data)
        ? (data as Record<string, unknown>).data as unknown[]
        : data && typeof data === "object" && Array.isArray((data as Record<string, unknown>).products)
          ? (data as Record<string, unknown>).products as unknown[]
          : [];

    products = rawProducts
      .map((item: unknown) => normalizeProduct(item))
      .filter((item): item is Product => item !== null);
  } catch (error) {
    console.error("Price movement API error:", error);
  }

  const validProducts = products.filter((product) => {
    const pct = Number(product.change?.pct ?? 0);
    return Number.isFinite(pct);
  });

  const risingProducts = validProducts
    .filter((product) => (product.change?.dir ?? "flat") === "up")
    .sort((a, b) => Math.abs(Number(b.change?.pct ?? 0)) - Math.abs(Number(a.change?.pct ?? 0)))
    .slice(0, 6);

  const fallingProducts = validProducts
    .filter((product) => (product.change?.dir ?? "flat") === "down")
    .sort((a, b) => Math.abs(Number(b.change?.pct ?? 0)) - Math.abs(Number(a.change?.pct ?? 0)))
    .slice(0, 6);

  return (
    <div className="space-y-12 py-10 sm:py-14">
      <section aria-labelledby="rising-products-heading">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <h2 id="rising-products-heading" className="text-2xl font-extrabold text-slate-800 sm:text-3xl">
              আজ দাম বেড়েছে
            </h2>
            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              যেসব পণ্যের দামে সবচেয়ে বেশি বৃদ্ধি দেখা যাচ্ছে
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">
            ↑ দাম বৃদ্ধি
          </span>
        </div>

        {risingProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {risingProducts.map((product) => (
              <ProductCard key={String(product.id)} product={product} direction="up" />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-emerald-100 bg-white p-6 text-center text-slate-500">
            বর্তমানে দাম বৃদ্ধির কোনো তথ্য পাওয়া যায়নি।
          </p>
        )}
      </section>

      <section aria-labelledby="falling-products-heading">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <h2 id="falling-products-heading" className="text-2xl font-extrabold text-slate-800 sm:text-3xl">
              আজ দাম কমেছে
            </h2>
            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              যেসব পণ্যের দাম আগের তুলনায় কমেছে
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            ↓ দাম হ্রাস
          </span>
        </div>

        {fallingProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fallingProducts.map((product) => (
              <ProductCard key={String(product.id)} product={product} direction="down" />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-emerald-100 bg-white p-6 text-center text-slate-500">
            বর্তমানে দাম হ্রাসের কোনো তথ্য পাওয়া যায়নি।
          </p>
        )}
      </section>
    </div>
  );
};

export default PriceMovementSections;