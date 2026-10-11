"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useState } from "react";

const SignUpPage = () => {

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const confirmPassword = String(
      formData.get("confirmPassword") || ""
    );

    if (password.length < 8) {
      setErrorMessage("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("দুটি পাসওয়ার্ড মিলছে না।");
      return;
    }

    //setIsLoading(true);

    try {
      const { data, error } = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: "/",
      });
      if(data){
        redirect("/")
        //console.log(data)
      }

      if (error) {
        setErrorMessage(error.message || "অ্যাকাউন্ট তৈরি করা যায়নি।");
        return;
      }

      //router.push("/");
    } catch {
      setErrorMessage("একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch {
      setErrorMessage("Google দিয়ে চালিয়ে যাওয়া যায়নি।");
    }
  };

  const handleGithubSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
      });
    } catch {
      setErrorMessage("GitHub দিয়ে চালিয়ে যাওয়া যায়নি।");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-[#f0f5f0] px-4 py-10 text-[#202b24] sm:py-11">
      {/* Heading */}
      <div className="mb-7 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-[28px]">
          অ্যাকাউন্ট তৈরি করুন
        </h1>

        <p className="mt-2 text-sm text-[#758078] sm:text-base">
          বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
        </p>
      </div>

      {/* Signup Card */}
      <div className="w-full max-w-[443px] rounded-2xl border border-[#dfe7df] bg-[#fbfcfa] p-6 shadow-sm sm:p-[25px]">
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium"
            >
              নাম
            </label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="যেমন: রহিম উদ্দিন"
              autoComplete="name"
              required
              className="h-[43px] w-full rounded-lg border border-[#dce5dc] bg-transparent px-3.5 text-sm outline-none transition placeholder:text-gray-500 focus:border-[#078b43] focus:ring-2 focus:ring-[#078b43]/10"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium"
            >
              ইমেইল
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="h-[43px] w-full rounded-lg border border-[#dce5dc] bg-transparent px-3.5 text-sm outline-none transition placeholder:text-gray-500 focus:border-[#078b43] focus:ring-2 focus:ring-[#078b43]/10"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              পাসওয়ার্ড
            </label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="কমপক্ষে ৮ অক্ষর"
              autoComplete="new-password"
              minLength={8}
              required
              className="h-[43px] w-full rounded-lg border border-[#dce5dc] bg-transparent px-3.5 text-sm outline-none transition placeholder:text-gray-500 focus:border-[#078b43] focus:ring-2 focus:ring-[#078b43]/10"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium"
            >
              পাসওয়ার্ড নিশ্চিত করুন
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="আবার লিখুন"
              autoComplete="new-password"
              minLength={8}
              required
              className="h-[43px] w-full rounded-lg border border-[#dce5dc] bg-transparent px-3.5 text-sm outline-none transition placeholder:text-gray-500 focus:border-[#078b43] focus:ring-2 focus:ring-[#078b43]/10"
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
            >
              {errorMessage}
            </p>
          )}

          {/* Signup Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="h-[44px] w-full rounded-lg bg-[#078b43] text-sm font-bold text-white shadow-md transition hover:bg-[#067438] focus:outline-none focus:ring-2 focus:ring-[#078b43] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading
              ? "অ্যাকাউন্ট তৈরি হচ্ছে..."
              : "অ্যাকাউন্ট তৈরি করুন"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center gap-4">
          <div className="h-px flex-1 bg-[#dfe5df]" />
          <span className="text-sm text-gray-600">অথবা</span>
          <div className="h-px flex-1 bg-[#dfe5df]" />
        </div>

        {/* Social Signup Buttons */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="flex h-[43px] items-center justify-center gap-2 rounded-lg border border-[#dce5dc] px-2 text-sm font-semibold transition hover:bg-[#f0f5f0]"
          >
            <span className="text-base font-bold text-[#4285F4]">
              G
            </span>
            Google দিয়ে চালিয়ে যান
          </button>

          <button
            type="button"
            onClick={handleGithubSignIn}
            className="flex h-[43px] items-center justify-center gap-2 rounded-lg border border-[#dce5dc] px-2 text-sm font-semibold transition hover:bg-[#f0f5f0]"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-[17px] w-[17px] fill-current"
              aria-hidden="true"
            >
              <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.08c-3.1.67-3.76-1.32-3.76-1.32-.5-1.29-1.24-1.63-1.24-1.63-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15.99 1.7 2.6 1.21 3.23.92.1-.72.39-1.21.7-1.49-2.48-.28-5.09-1.24-5.09-5.5 0-1.22.44-2.21 1.15-2.99-.12-.28-.5-1.42.11-2.95 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.05-1.14 3.05-1.14.61 1.53.23 2.67.11 2.95.72.78 1.15 1.77 1.15 2.99 0 4.27-2.62 5.21-5.11 5.49.4.35.75 1.02.75 2.06V22c0 .29.2.63.77.53A11.1 11.1 0 0 0 12 .9Z" />
            </svg>
            GitHub দিয়ে চালিয়ে যান
          </button>
        </div>

        {/* Sign In Link */}
        <p className="mt-5 text-center text-sm">
          অ্যাকাউন্ট আছে?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-[#078b43] hover:underline"
          >
            সাইন ইন করুন
          </Link>
        </p>
      </div>

      {/* Back to Home */}
      <Link
        href="/"
        className="mt-7 text-sm text-[#758078] transition hover:text-[#078b43]"
      >
        ← হোম পেজে ফিরে যান
      </Link>
    </main>
  );
};

export default SignUpPage;
