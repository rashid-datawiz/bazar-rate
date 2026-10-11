import ToastProvider from "@/components/providers/ToastProvider";
import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "বাজার দর | নিত্যপ্রয়োজনীয় পণ্যের দাম",
  description:
    "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের দাম এবং দাম বাড়া-কমার তথ্য এক জায়গায় দেখুন।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" data-scroll-behavior="smooth">
      <body className="min-h-screen bg-stone-50 text-stone-900 antialiased">
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
