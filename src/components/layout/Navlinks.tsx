
import Link from "next/link";

interface Category {
    id: string | number;
    slug: string;
    nameBn: string;
    icon: string;
}

const API_URL =
  "https://api.abcz.workers.dev/api/bazardor/categories";
const NavLinks = async () => {
    let categories: Category[] = [];

    try {
        const res = await fetch(API_URL, {
            next: { revalidate: 3600 },
        });

        if (!res.ok) {
            throw new Error("Failed to fetch categories");
        }

        const data = await res.json();

        categories = Array.isArray(data.data)
            ? data.data
            : Array.isArray(data)
              ? data
              : [];
    } catch (error) {
        console.error("Category navigation API error:", error);
    }

    return (
        <nav
            aria-label="প্রোডাক্ট ক্যাটাগরি"
            className="border-t border-emerald-100 bg-[#F0F5EF]"
        >
            <div className="mx-auto max-w-7xl px-4">
                <div className="flex items-center justify-center gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <Link
                        href="/"
                        className="shrink-0 rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
                    >
                        হোম
                    </Link>

                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/category/${category.slug}`}
                            className="flex shrink-0 items-center gap-2 rounded-full border border-transparent px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-white hover:text-emerald-800"
                        >
                            <span aria-hidden="true">
                                {category.icon}
                            </span>

                            <span>{category.nameBn}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default NavLinks;
