
import type { Product } from "@/types/product";
import ProductCard from "./ProductCard";

export default function ProductGrid({
  products,
}: {
  products: Product[];
}) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-stone-300 px-5 py-12 text-center">
        <p className="text-3xl">🛒</p>
        <h3 className="mt-3 font-bold text-stone-800">
          কোনো পণ্য পাওয়া যায়নি
        </h3>
        <p className="mt-1 text-sm text-stone-500">
          পরে আবার চেষ্টা করুন।
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
