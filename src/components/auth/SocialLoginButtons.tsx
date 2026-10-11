
"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function SocialLoginButtons() {
  const [loadingProvider, setLoadingProvider] = useState<
    "google" | "github" | null
  >(null);

  async function handleSocialLogin(provider: "google" | "github") {
    if (loadingProvider) return;

    setLoadingProvider(provider);

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "সোশ্যাল লগইন করা যায়নি।");
        setLoadingProvider(null);
      }
    } catch {
      toast.error("লগইন করার সময় সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      setLoadingProvider(null);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        disabled={loadingProvider !== null}
        onClick={() => handleSocialLogin("google")}
        className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-stone-200 bg-white px-4 font-semibold text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loadingProvider === "google" ? (
          <span className="loading loading-spinner loading-sm" />
        ) : (
          <span className="font-bold text-lg">G</span>
        )}
        Google দিয়ে চালিয়ে যান
      </button>

      <button
        type="button"
        disabled={loadingProvider !== null}
        onClick={() => handleSocialLogin("github")}
        className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-[#202B23] px-4 font-semibold text-white transition hover:bg-[#344238] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loadingProvider === "github" ? (
          <span className="loading loading-spinner loading-sm" />
        ) : (
          <span className="font-bold text-lg">⌘</span>
        )}
        GitHub দিয়ে চালিয়ে যান
      </button>
    </div>
  );
}
