import Link from "next/link";

export default function ProductNotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#F0F5EF] px-4 text-center">
      <span className="text-6xl">🛒</span>

      <h1 className="mt-5 text-3xl font-bold text-gray-900">
        পণ্যটি খুঁজে পাওয়া যায়নি
      </h1>

      <p className="mt-3 text-gray-600">
        পণ্যটি মুছে ফেলা হয়েছে অথবা এই আইডিতে কোনো পণ্য নেই।
      </p>

      <Link
        href="/"
        className="mt-6 rounded-xl bg-emerald-700 px-6 py-3 font-semibold text-white transition hover:bg-emerald-800"
      >
        হোম পেজে ফিরে যান
      </Link>
    </main>
  );
}