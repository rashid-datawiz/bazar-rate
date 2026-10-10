
import Link from "next/link";
import MarqueeText from "react-marquee-text";
import "react-marquee-text/dist/styles.css";

interface Product {
  id: string | number;
  slug: string;
  nameBn: string;
  categoryIcon?: string;
  today: number;
  unit: string;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
}

const API_URL =
  "https://api.abcz.workers.dev/api/bazardor/products";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("bn-BD").format(price);

const unitLabels: Record<string, string> = {
  kg: "কেজি",
  litre: "লিটার",
  dozen: "ডজন",
  piece: "টি",
};

const Marquee = async () => {
  let products: Product[] = [];

  try {
    const res = await fetch(API_URL, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch product prices");
    }

    const data = await res.json();

    products = Array.isArray(data.data)
      ? data.data
      : Array.isArray(data)
        ? data
        : [];
  } catch (error) {
    console.error("Marquee API error:", error);
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="border-y border-emerald-100 bg-[#F0F5EF] text-slate-700">
      <div className="mx-auto flex max-w-7xl items-center overflow-hidden">
        

        <div className="min-w-0 flex-1 overflow-hidden">
          <MarqueeText
            className="py-2"
            direction="right"
            duration={30}
          >
            {products.map((product) => {
              const { dir, pct } = product.change;

              const changeSymbol =
                dir === "up"
                  ? "▲"
                  : dir === "down"
                    ? "▼"
                    : "—";

              const changeLabel =
                dir === "flat"
                  ? "অপরিবর্তিত"
                  : `${changeSymbol} ${formatPrice(
                    Math.abs(pct)
                  )}%`;

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="mx-3 inline-flex items-center gap-2 whitespace-nowrap text-sm hover:underline sm:mx-5"
                >
                  <span aria-hidden="true">
                    {product.categoryIcon ?? "🛒"}
                  </span>

                  <span className="font-medium">
                    {product.nameBn}
                  </span>

                  <span>
                    ৳{formatPrice(product.today)}
                    /{unitLabels[product.unit] ?? product.unit}
                  </span>

                  <span
                    className={
                      dir === "up"
                        ? "font-semibold text-red-500"
                        : dir === "down"
                          ? "font-semibold text-green-500"
                          : "text-white/80"
                    }
                  >
                    {changeLabel}
                  </span>

                  <span className="ml-2 text-white/60">
                    •
                  </span>
                </Link>
              );
            })}
          </MarqueeText>
        </div>
      </div>
    </div>
  );
};



export default Marquee;
