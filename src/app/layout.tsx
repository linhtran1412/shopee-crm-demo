import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shopee CRM - Big Data Dashboard",
  description: "Personalizing customer experience dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body className="h-full flex bg-slate-50 text-slate-900">
        <Sidebar />
        <main className="flex-1 overflow-auto h-full p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
