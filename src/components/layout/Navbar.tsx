import Link from "next/link";
import { formatBanglaDate } from "@/lib/utils";
import NavLinks from "./Navlinks";

const Navbar = () => {
  const todayText = formatBanglaDate();

  return (
    <header className="border-b border-emerald-100 bg-[#F0F5EF]">
      <div className="mx-auto max-w-7xl px-4 py-4">
        {/* Brand and date */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/images/logo-icon.png"
              alt=""
              className="h-12 w-12 object-contain"
            />
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-emerald-800">
                বাজার দর
              </span>
              <p className="mt-1 text-xs text-stone-500">
                {formatBanglaDate()}
              </p>
            </div>
          </Link>
          

          <div className="flex items-center gap-3">
            

            {/* Replace this link with your existing auth/profile component if available */}
            <div className="flex items-center gap-2">
              <Link
                href="/signin"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100"
              >
                সাইন ইন
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                সাইন আপ
              </Link>
            </div>
          </div>
          
        </div>
        {/* Category navigation */}
      <NavLinks />
      </div>

      
    </header>
  );
};

export default Navbar;
