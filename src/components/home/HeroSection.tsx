
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="baz-surface overflow-hidden">
      <div className="grid min-h-[350px] items-center gap-4 px-5 py-7 sm:px-8 sm:py-9 lg:min-h-[350px] lg:grid-cols-[1.5fr_0.8fr] lg:px-8">
        <div className="order-2 lg:order-1">
          <span className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
            বাজারদরের সর্বশেষ আপডেট
          </span>

          <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-[#202b23] sm:text-4xl lg:text-[42px]">
            আজকের বাজারের দাম এক নজরে
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-[#737b74] sm:text-lg">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম —
            বাজারভিত্তিক বিস্তৃত, গড়, সর্বনিম্ন-সর্বোচ্চ এবং
            দামের পরিবর্তন এক জায়গায়।
          </p>

          <a
            href="#সব-পণ্য"
            className="btn mt-7 min-h-12 rounded-xl border-0 bg-[#07883f] px-7 text-base font-bold text-white shadow-md hover:bg-[#067335]"
          >
            সব পণ্য দেখুন
          </a>
        </div>

        <div className="order-1 mx-auto w-full max-w-[310px] lg:order-2 lg:max-w-[370px]">
          <Image
            src="/images/bazar-hero.png"
            alt="বাজারের তাজা পণ্যের ঝুড়ি"
            width={640}
            height={520}
            priority
            className="h-auto w-full object-contain"
          />
        </div>
      </div>
    </section>
  );
}



