
import { Suspense } from "react";
import { connection } from "next/server";
import Navbar from "@/components/layout/Navbar";
import PriceTicker from "@/components/layout/PriceTicker";
import Footer from "@/components/layout/Footer";
import Marquee from "@/components/layout/Marquee";
import PriceMovementSections from "@/components/home/PriceMovementSections";
import AllProductsSection from "@/components/home/AllProductsSection";
export default function HomePage() {
  return (
    <Suspense fallback={<HomePageFallback />}>
      <HomePageContent />
    </Suspense>
  );
}

function HomePageFallback() {
  return (
    <main
      className="min-h-screen bg-[#F0F5EF] px-4 py-8"
      role="status"
      aria-label="পণ্য লোড হচ্ছে"
      aria-busy="true"
    >
      <div className="mx-auto max-w-7xl animate-pulse space-y-10">
        {/* Today's prices are rising */}
        <section>
          <div className="mb-2 h-7 w-52 rounded bg-emerald-900/10" />
          <div className="mb-5 h-4 w-80 max-w-full rounded bg-stone-200" />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={`rising-${index}`}
                className="overflow-hidden rounded-2xl border border-emerald-100 bg-white"
              >
                <div className="h-44 bg-stone-200" />
                <div className="space-y-3 p-4">
                  <div className="h-5 w-2/3 rounded bg-stone-200" />
                  <div className="h-6 w-1/2 rounded bg-stone-200" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Today's prices are falling */}
        <section>
          <div className="mb-2 h-7 w-52 rounded bg-emerald-900/10" />
          <div className="mb-5 h-4 w-80 max-w-full rounded bg-stone-200" />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={`falling-${index}`}
                className="overflow-hidden rounded-2xl border border-emerald-100 bg-white"
              >
                <div className="h-44 bg-stone-200" />
                <div className="space-y-3 p-4">
                  <div className="h-5 w-2/3 rounded bg-stone-200" />
                  <div className="h-6 w-1/2 rounded bg-stone-200" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <span className="sr-only">পণ্য লোড হচ্ছে...</span>
    </main>
  );
}

async function HomePageContent() {
  await connection();

  return (
    <div className="min-h-screen bg-[#F0F5EF]">
      <Navbar />
      <PriceTicker />
      <Marquee />

      <main className="mx-auto max-w-7xl px-4">
        <PriceMovementSections />
        <AllProductsSection />
      </main>

      <Footer />
    </div>
  );
}
