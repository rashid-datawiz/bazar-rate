
import { Suspense } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";

const API_URL =
  "https://openapi.programming-hero.com/api/bazardor";

type Market = {
  market: string;
  division?: string;
  min: number;
  max: number;
};

type Product = {
  id: number | string;
  nameBn?: string;
  name?: string;
  category?: string;
  categoryNameBn?: string;
  categoryIcon?: string;
  unit?: string;
  image?: string;
  today?: number;
  yesterday?: number;
  lastWeek?: number;
  change?: {
    dir?: "up" | "down" | "flat";
    pct?: number;
  };
  markets?: Market[];
};

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

function formatNumber(value: number) {
  return value.toLocaleString("bn-BD", {
    maximumFractionDigits: 2,
  });
}

function formatPrice(value?: number) {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return "তথ্য নেই";
  }

  return `${formatNumber(value)} টাকা`;
}

async function getProduct(
  id: string
): Promise<Product | null> {
  const response = await fetch(
    `${API_URL}/products/${encodeURIComponent(id)}`,
    {
      cache: "no-store",
    }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("পণ্যের তথ্য লোড করা যায়নি।");
  }

  const result = await response.json();

  // Supports common API response formats.
  const product =
    result?.data ?? result?.product ?? result;

  if (
    !product ||
    typeof product !== "object" ||
    Array.isArray(product) ||
    product.id === undefined ||
    product.id === null
  ) {
    return null;
  }

  return product as Product;
}

function ProductDetailSkeleton() {
  return (
    <main className="min-h-screen bg-[#F0F5F0] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl animate-pulse space-y-6">
        <div className="h-5 w-48 rounded bg-gray-200" />
        <div className="h-52 rounded-[20px] bg-white" />
        <div className="h-36 rounded-[20px] bg-white" />
        <div className="h-72 rounded-[20px] bg-white" />
      </div>
    </main>
  );
}

function PriceSummaryCard({
  title,
  price,
  description,
  valueColor = "text-emerald-700",
}: {
  title: string;
  price?: number;
  description: string;
  valueColor?: string;
}) {
  return (
    <div className="rounded-[18px] border border-[#DFE8DF] bg-[#FAFCFA] p-5 sm:p-6">
      <p className="text-sm font-medium text-[#69736B]">
        {title}
      </p>

      <p
        className={`mt-2 text-2xl font-bold ${valueColor}`}
      >
        {formatPrice(price)}
      </p>

      <p className="mt-2 text-xs text-[#758078]">
        {description}
      </p>
    </div>
  );
}

export default function ProductDetailPage({
  params,
}: ProductPageProps) {
  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailContent params={params} />
    </Suspense>
  );
}

async function ProductDetailContent({
  params,
}: ProductPageProps) {
  const { id } = await params;

  // Require authentication before displaying product details.
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Preserve the requested product URL through sign-in.
  if (!session) {
    redirect(
      `/signin?callbackURL=${encodeURIComponent(
        `/product/${id}`
      )}`
    );
  }

  // This API route expects a numeric product ID.
  if (!/^\d+$/.test(id)) {
    notFound();
  }

  let product: Product | null;

  try {
    product = await getProduct(id);
  } catch {
    // Do not show a product-not-found page for a network
    // or server error. Let Next.js render its error boundary.
    throw new Error("পণ্যের তথ্য লোড করা যায়নি।");
  }

  if (!product) {
    notFound();
  }

  // Keep only markets with valid, non-negative price ranges.
  const markets = Array.isArray(product.markets)
    ? product.markets.filter(
        (market): market is Market =>
          Boolean(market) &&
          typeof market.market === "string" &&
          typeof market.min === "number" &&
          Number.isFinite(market.min) &&
          typeof market.max === "number" &&
          Number.isFinite(market.max) &&
          market.min >= 0 &&
          market.max >= market.min
      )
    : [];

  const title =
    product.nameBn ?? product.name ?? "পণ্যের নাম";

  const unit = product.unit ?? "কেজি";

  const lowest =
    markets.length > 0
      ? Math.min(...markets.map((market) => market.min))
      : undefined;

  const highest =
    markets.length > 0
      ? Math.max(...markets.map((market) => market.max))
      : undefined;

  // Average the midpoint of each valid market's price range.
  const average =
    markets.length > 0
      ? markets.reduce(
          (sum, market) =>
            sum + (market.min + market.max) / 2,
          0
        ) / markets.length
      : product.today;

  const today =
    typeof product.today === "number" &&
    Number.isFinite(product.today)
      ? product.today
      : undefined;

  const yesterday =
    typeof product.yesterday === "number" &&
    Number.isFinite(product.yesterday)
      ? product.yesterday
      : undefined;

  const priceDifference =
    today !== undefined && yesterday !== undefined
      ? today - yesterday
      : undefined;

  const direction = product.change?.dir ?? "flat";

  const changePercent =
    typeof product.change?.pct === "number" &&
    Number.isFinite(product.change.pct)
      ? product.change.pct
      : undefined;

  const changeColor =
    direction === "up"
      ? "text-red-600"
      : direction === "down"
        ? "text-emerald-700"
        : "text-gray-500";

  return (
    <main className="min-h-screen bg-[#F0F5F0] px-4 pb-14 pt-7 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1168px]">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-7 flex flex-wrap items-center gap-2 text-sm text-[#526057]"
        >
          <Link
            href="/"
            className="transition hover:text-emerald-700"
          >
            হোম
          </Link>

          <span aria-hidden="true">›</span>

          {product.category ? (
            <Link
              href={`/category/${encodeURIComponent(
                product.category
              )}`}
              className="transition hover:text-emerald-700"
            >
              {product.categoryNameBn ?? "পণ্য"}
            </Link>
          ) : (
            <span>
              {product.categoryNameBn ?? "পণ্য"}
            </span>
          )}

          <span aria-hidden="true">›</span>

          <span className="font-medium text-[#263229]">
            {title}
          </span>
        </nav>

        {/* Product overview */}
        <section className="flex flex-col gap-6 rounded-[20px] border border-[#DFE7DF] bg-[#FBFDFB] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex min-w-0 items-center gap-4 sm:gap-5">
            <div className="flex size-[84px] shrink-0 items-center justify-center overflow-hidden rounded-[18px] bg-[#F0F5F0] text-4xl sm:size-[104px]">
              {product.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.image}
                  alt={title}
                  className="size-full object-contain p-2"
                />
              ) : (
                product.categoryIcon ?? "🛒"
              )}
            </div>

            <div className="min-w-0">
              <h1 className="text-2xl font-bold leading-tight text-[#202A22] sm:text-3xl">
                {title}
              </h1>

              <p className="mt-2 text-sm text-[#758078]">
                প্রতি {unit}
                {product.categoryNameBn
                  ? ` · ${product.categoryNameBn}`
                  : ""}
              </p>

              <p className="mt-3 text-sm leading-6 text-[#354139]">
                {priceDifference !== undefined ? (
                  <>
                    গতকালের তুলনায় আজকের দাম{" "}
                    <strong>
                      {priceDifference > 0
                        ? "বেড়েছে"
                        : priceDifference < 0
                          ? "কমেছে"
                          : "একই আছে"}
                    </strong>

                    {priceDifference !== 0 && (
                      <>
                        {" "}
                        · {formatPrice(Math.abs(priceDifference))}
                      </>
                    )}
                  </>
                ) : (
                  "আজকের বাজারদর ও বিভিন্ন বাজারের দাম তুলনা করুন।"
                )}
              </p>
            </div>
          </div>

          {/* Today's price */}
          <div className="flex min-w-[150px] flex-col items-center justify-center rounded-[18px] bg-[#F0F5F0] px-6 py-5 text-center sm:min-h-[148px]">
            <span className="text-sm text-[#748078]">
              আজকের দাম
            </span>

            <strong className="mt-2 text-3xl font-bold leading-tight text-[#202A22]">
              {formatPrice(today)}
            </strong>

            <span className="mt-1 text-xs text-[#748078]">
              প্রতি {unit}
            </span>

            {changePercent !== undefined && (
              <span
                className={`mt-3 text-sm font-bold ${changeColor}`}
              >
                {direction === "up"
                  ? "▲"
                  : direction === "down"
                    ? "▼"
                    : "—"}{" "}
                {formatNumber(Math.abs(changePercent))}%
              </span>
            )}
          </div>
        </section>

        {/* Price summary */}
        <section className="mt-6 rounded-[20px] border border-[#DFE7DF] bg-[#FBFDFB] p-5 sm:p-7">
          <h2 className="text-xl font-bold text-[#202A22]">
            দামের সারসংক্ষেপ
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <PriceSummaryCard
              title="সর্বনিম্ন দাম"
              price={lowest}
              description="সবচেয়ে কম দামের বাজার"
            />

            <PriceSummaryCard
              title="সর্বোচ্চ দাম"
              price={highest}
              description="সবচেয়ে বেশি দামের বাজার"
              valueColor="text-red-600"
            />

            <PriceSummaryCard
              title="গড় দাম"
              price={average}
              description="বাজারভিত্তিক আনুমানিক গড় মূল্য"
              valueColor="text-[#263229]"
            />
          </div>

          {/* Market comparison */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-[#202A22]">
              বাজারভিত্তিক আজকের দাম
            </h2>

            <p className="mt-2 text-sm text-[#758078]">
              বিভিন্ন বাজারের সর্বনিম্ন ও সর্বোচ্চ দামের তুলনা করুন।
            </p>

            {markets.length > 0 ? (
              <div className="mt-5 overflow-x-auto rounded-[18px] border border-[#E0E8E0]">
                <table className="w-full min-w-[680px] border-collapse text-left text-sm">
                  <thead className="bg-[#F7FAF7] text-[#737D75]">
                    <tr>
                      <th className="px-4 py-4 font-semibold sm:px-5">
                        বাজার
                      </th>

                      <th className="px-4 py-4 font-semibold sm:px-5">
                        বিভাগ
                      </th>

                      <th className="px-4 py-4 text-right font-semibold sm:px-5">
                        সর্বনিম্ন
                      </th>

                      <th className="px-4 py-4 text-right font-semibold sm:px-5">
                        সর্বোচ্চ
                      </th>

                      <th className="px-4 py-4 text-right font-semibold sm:px-5">
                        গড় দাম
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {markets.map((market, index) => (
                      <tr
                        key={`${market.market}-${market.division ?? ""}-${index}`}
                        className={`border-t border-[#E1E8E1] ${
                          index % 2 === 0
                            ? "bg-[#FBFDFB]"
                            : "bg-[#F0F5F0]"
                        }`}
                      >
                        <td className="px-4 py-4 font-semibold text-[#28332B] sm:px-5">
                          {market.market}
                        </td>

                        <td className="px-4 py-4 text-[#526057] sm:px-5">
                          {market.division ?? "—"}
                        </td>

                        <td className="px-4 py-4 text-right text-emerald-700 sm:px-5">
                          {formatPrice(market.min)}
                        </td>

                        <td className="px-4 py-4 text-right text-red-600 sm:px-5">
                          {formatPrice(market.max)}
                        </td>

                        <td className="px-4 py-4 text-right font-semibold text-[#28332B] sm:px-5">
                          {formatPrice(
                            (market.min + market.max) / 2
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mt-5 rounded-xl bg-[#F0F5F0] p-8 text-center text-sm text-[#69736B]">
                এই পণ্যের বাজারভিত্তিক দামের তথ্য পাওয়া যায়নি।
              </div>
            )}
          </div>
        </section>

        {/* Back to home */}
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-[#D9E4D9] bg-white px-5 py-3 text-sm font-semibold text-[#354139] transition hover:border-emerald-300 hover:text-emerald-700"
          >
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </main>
  );
}
