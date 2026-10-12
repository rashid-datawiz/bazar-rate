"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function AuthNav() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <div className="h-10 w-28 animate-pulse rounded-lg bg-stone-200" />;
  }

  if (session?.user) {
    return (
      <Link
        href="/profile"
        className="flex max-w-56 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
      >
        <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-700 text-sm font-bold text-white">
          {session.user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={session.user.image}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            (session.user.name || session.user.email || "U")
              .charAt(0)
              .toUpperCase()
          )}
        </span>
        <span className="truncate">
          {session.user.name || "আমার প্রোফাইল"}
        </span>
      </Link>
    );
  }

  return (
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
  );
}