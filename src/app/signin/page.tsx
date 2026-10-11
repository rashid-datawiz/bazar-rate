
"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import SocialLoginButtons from "@/components/auth/SocialLoginButtons";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Preserve the product URL the user originally requested.
  const requestedCallback = searchParams.get("callbackURL");

  // Only allow local paths to prevent external redirects.
  const callbackURL =
    requestedCallback?.startsWith("/") &&
      !requestedCallback.startsWith("//") &&
      !requestedCallback.includes("\\")
      ? requestedCallback
      : "/";

  const handleSubmit = async (
    event: React.SubmitEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const normalizedEmail = email.trim();

    if (!normalizedEmail || !password) {
      toast.error("ইমেইল ও পাসওয়ার্ড দিন।");
      return;
    }

    setIsLoading(true);

    try {
      const result = await authClient.signIn.email({
        email: normalizedEmail,
        password,
        callbackURL,
      });


      if (result.error) {
        toast.error(
          result.error.message || "লগইন করা যায়নি। আবার চেষ্টা করুন।"
        );
        return;
      }

      toast.success("সফলভাবে লগইন হয়েছে!");

      // Return to the requested product page instead of always going home.
      router.replace(callbackURL);
      router.refresh();
    } catch (error) {
      console.error("Sign-in failed:", error);
      toast.error("একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-[#F0F5F0] px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-[#DFE8DF] bg-white p-6 shadow-sm sm:p-8">
        {/* Brand */}
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-3"
        >
          <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-700 text-2xl font-bold text-white">
            ৳
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#202A22]">
              বাজার দর
            </h1>
            <p className="text-xs text-gray-500">
              প্রতিদিনের বাজারদর জানুন
            </p>
          </div>
        </Link>

        {/* Heading */}
        <div className="mb-7 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            আপনার অ্যাকাউন্টে লগইন করুন
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            বাজারদরের বিস্তারিত তথ্য দেখতে আপনার অ্যাকাউন্টে প্রবেশ করুন।
          </p>
        </div>

        {/* Email and password */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              ইমেইল ঠিকানা
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="আপনার ইমেইল লিখুন"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isLoading}
              required
              className="w-full rounded-xl border border-gray-200 bg-[#FAFCFA] px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              পাসওয়ার্ড
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="আপনার পাসওয়ার্ড লিখুন"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isLoading}
              required
              className="w-full rounded-xl border border-gray-200 bg-[#FAFCFA] px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                লগইন হচ্ছে...
              </>
            ) : (
              "লগইন করুন"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200" />

          <span className="whitespace-nowrap text-xs text-gray-400">
            অথবা লগইন করুন
          </span>

          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Google and GitHub */}
        <SocialLoginButtons />
        {/* Registration link */}
        <p className="mt-7 text-center text-sm text-gray-600">
          অ্যাকাউন্ট নেই?{" "}
          <Link
            href="/signup"
            className="font-semibold text-emerald-700 hover:text-emerald-800"
          >
            রেজিস্ট্রেশন করুন
          </Link>

          
        </p>
        {/* Back to Home */}
          <Link
            href="/"
            className="mt-7 text-sm text-[#758078] transition hover:text-[#078b43]"
          >
            ← হোম পেজে ফিরে যান
          </Link>
      </div>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[80vh] items-center justify-center bg-[#F0F5F0]">
          <span className="loading loading-spinner loading-lg text-emerald-700" />
        </main>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
