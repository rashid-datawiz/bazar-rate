
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

type ProfileFormProps = {
  initialName: string;
  showNameForm?: boolean;
};

export default function ProfileForm({
  initialName,
  showNameForm = false,
}: ProfileFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [isSaving, setIsSaving] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedName = name.trim();

    if (!normalizedName) {
      toast.error("আপনার নাম লিখুন।");
      return;
    }

    setIsSaving(true);

    try {
      const result = await authClient.updateUser({
        name: normalizedName,
      });

      if (result.error) {
        toast.error(result.error.message || "নাম আপডেট করা যায়নি।");
        return;
      }

      toast.success("প্রোফাইল আপডেট হয়েছে।");
      router.refresh();
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      const result = await authClient.signOut();

      if (result.error) {
        toast.error(result.error.message || "সাইন আউট করা যায়নি।");
        return;
      }

      toast.success("সফলভাবে সাইন আউট হয়েছে।");
      router.replace("/signin");
      router.refresh();
    } catch (error) {
      console.error("Sign-out failed:", error);
      toast.error("একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsSigningOut(false);
    }
  }

  if (!showNameForm) {
    return (
      <button
        type="button"
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="shrink-0 rounded-xl border border-red-300 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
      >
        {isSigningOut ? "সাইন আউট হচ্ছে..." : "↪ সাইন আউট"}
      </button>
    );
  }

  return (
    <form onSubmit={handleUpdate} className="space-y-4">
      <div>
        <label
          htmlFor="profile-name"
          className="mb-2 block text-sm font-medium text-[#354139]"
        >
          নাম
        </label>

        <input
          id="profile-name"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
          maxLength={100}
          required
          disabled={isSaving}
          className="w-full rounded-xl border border-[#DFE7DF] bg-[#FAFCFA] px-4 py-3 text-[#202A22] outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
        />
      </div>

      <button
        type="submit"
        disabled={isSaving || name.trim() === initialName.trim()}
        className="w-full rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? "আপডেট হচ্ছে..." : "আপডেট"}
      </button>
    </form>
  );
}
