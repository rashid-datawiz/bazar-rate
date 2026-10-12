import Link from "next/link";
import { formatBanglaDate } from "@/lib/utils";
import NavLinks from "./Navlinks";
import AuthNav from "./AuthNav";

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
            

            <AuthNav />
          </div>
          
        </div>
        {/* Category navigation */}
      <NavLinks />
      </div>

      
    </header>
  );
};

export default Navbar;
