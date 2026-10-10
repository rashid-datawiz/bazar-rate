
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-stone-600 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/" className="font-bold text-emerald-800">
            বাজার দর
          </Link>
          <p className="mt-1">
            প্রয়োজনীয় পণ্যের দাম এক নজরে।
          </p>
        </div>

        <p className="max-w-xl sm:text-right">
          সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </p>
      </div>
    </footer>
  );
}
