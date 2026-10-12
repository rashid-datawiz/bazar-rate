
import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import ProfileForm from "@/components/profile/ProfileForm";

function ProfileSkeleton() {
  return (
    <main className="min-h-screen bg-[#F0F5F0] px-4 py-12">
      <div className="mx-auto max-w-[734px] animate-pulse space-y-6">
        <div className="h-12 w-56 rounded-xl bg-gray-200" />
        <div className="h-32 rounded-[20px] bg-white" />
        <div className="h-60 rounded-[20px] bg-white" />
      </div>
    </main>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileContent />
    </Suspense>
  );
}

async function ProfileContent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin?callbackURL=%2Fprofile");
  }

  const user = session.user;

  return (
    <main className="min-h-[calc(100vh-140px)] bg-[#F0F5F0] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-[734px]">
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-[#202A22] sm:text-3xl">
            আমার প্রোফাইল
          </h1>
          <p className="mt-2 text-sm text-[#758078]">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
          </p>
        </div>

        <section className="flex flex-col gap-5 rounded-[20px] border border-[#DFE7DF] bg-[#FBFDFB] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex min-w-0 items-center gap-4">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt={user.name || "Profile"}
                className="size-[72px] shrink-0 rounded-2xl bg-[#F0F5F0] object-cover"
              />
            ) : (
              <div className="flex size-[72px] shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-2xl font-bold text-white">
                {(user.name || user.email || "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}

            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold text-[#202A22] sm:text-xl">
                {user.name || "ব্যবহারকারী"}
              </h2>
              <p className="mt-1 break-all text-sm text-[#69736B]">
                {user.email}
              </p>
            </div>
          </div>

          <ProfileForm initialName={user.name || ""} />
        </section>

        <section className="mt-6 rounded-[20px] border border-[#DFE7DF] bg-[#FBFDFB] p-5 sm:p-6">
          <h2 className="text-lg font-bold text-[#202A22]">তথ্য আপডেট</h2>
          <p className="mt-2 text-sm text-[#758078]">
            আপনার প্রোফাইলের নাম পরিবর্তন করতে নিচের ফর্মটি ব্যবহার করুন।
          </p>

          <div className="mt-5">
            <ProfileForm
              initialName={user.name || ""}
              showNameForm
            />
          </div>
        </section>

        <section className="mt-6 rounded-[20px] border border-[#DFE7DF] bg-[#FBFDFB] p-5 sm:p-6">
          <h2 className="text-lg font-bold text-[#202A22]">
            বাজারদর দেখুন
          </h2>
          <p className="mt-2 text-sm text-[#758078]">
            পণ্য নির্বাচন করে বিভিন্ন বাজারের সর্বনিম্ন ও সর্বোচ্চ দাম তুলনা করুন।
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            পণ্য দেখুন
          </Link>
        </section>
      </div>
    </main>
  );
}
