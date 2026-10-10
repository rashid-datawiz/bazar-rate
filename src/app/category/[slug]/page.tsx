
import { notFound } from "next/navigation";
import CategoryProductGrid from "@/components/category/CategoryProductGrid";

const API_BASE =
  process.env.BAZARDOR_API_URL ??
  "https://api.abcz.workers.dev/api/bazardor";

const FALLBACK_API_BASE = "https://api.abcz.workers.dev/api/bazardor";

interface Category {
  id: string | number;
  slug: string;
  nameBn: string;
  categoryIcon?: string;
}

async function fetchJsonWithFallback(url: string): Promise<Response> {
  const response = await fetch(url, { next: { revalidate: 60 } });

  if (response.ok || response.status !== 429) {
    return response;
  }

  const fallbackResponse = await fetch(
    url.replace(API_BASE, FALLBACK_API_BASE),
    { next: { revalidate: 60 } },
  );

  return fallbackResponse;
}

async function getCategory(slug: string): Promise<Category | null> {
  const response = await fetchJsonWithFallback(`${API_BASE}/categories`);

  if (response.status === 404) return null;

  if (!response.ok) {
    throw new Error(`Category API returned ${response.status}`);
  }

  const result: unknown = await response.json();
  const list = Array.isArray(result)
    ? result
    : result && typeof result === "object"
      ? Array.isArray((result as Record<string, unknown>).data)
        ? ((result as Record<string, unknown>).data as unknown[])
        : Array.isArray((result as Record<string, unknown>).items)
          ? ((result as Record<string, unknown>).items as unknown[])
          : []
      : [];

  const item = list.find((entry) => {
    if (!entry || typeof entry !== "object") return false;
    const record = entry as Record<string, unknown>;
    const entrySlug = String(record.slug ?? record.id ?? "");
    return entrySlug === slug || entrySlug === decodeURIComponent(slug);
  });

  if (!item || typeof item !== "object") return null;

  const record = item as Record<string, unknown>;
  const resolvedSlug = typeof record.slug === "string" ? record.slug : String(record.id ?? slug);

  if (!resolvedSlug) return null;

  return {
    id: String(record.id ?? resolvedSlug),
    slug: resolvedSlug,
    nameBn:
      typeof record.nameBn === "string"
        ? record.nameBn
        : typeof record.name === "string"
          ? record.name
          : resolvedSlug,
    categoryIcon:
      typeof record.categoryIcon === "string"
        ? record.categoryIcon
        : typeof record.icon === "string"
          ? record.icon
          : "🛒",
  };
}

async function getCategoryProducts(slug: string) {
  const response = await fetchJsonWithFallback(
    `${API_BASE}/products?category=${encodeURIComponent(slug)}`,
  );

  if (!response.ok) {
    throw new Error(`Category products API returned ${response.status}`);
  }

  const result: unknown = await response.json();

  if (Array.isArray(result)) return result;

  if (result && typeof result === "object") {
    const data = result as Record<string, unknown>;

    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.products)) return data.products;
    if (Array.isArray(data.result)) return data.result;
    if (Array.isArray(data.items)) return data.items;
  }

  return [];
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const [category, rawProducts] = await Promise.all([
    getCategory(decodedSlug),
    getCategoryProducts(decodedSlug),
  ]);

  if (!category) notFound();

  return (
    <main className="min-h-[70vh] bg-[#F0F5EF] px-4 py-7 sm:py-10">
      <div className="mx-auto max-w-7xl">
        {/* Category heading */}
        <section className="flex items-center gap-4 rounded-2xl border border-[#DFE8DF] bg-white/80 p-5 sm:p-7">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#F0F5EF] text-4xl">
            {category.categoryIcon}
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-[#202B23] sm:text-3xl">
              {category.nameBn}
            </h1>

            <p className="mt-1 text-sm text-slate-500 sm:text-base">
              {rawProducts.length}টি পণ্যের আজকের দাম ও পরিবর্তন
            </p>
          </div>
        </section>

        {/* Product count, sorting, and cards */}
        <CategoryProductGrid rawProducts={rawProducts} />
      </div>
    </main>
  );
}
