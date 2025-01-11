import "@/app/globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LMIA Jobs",
  description: "Streamlining the LMIA process for Canadian employers",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const links = [
    { text: "Dashboard", url: "/dashboard" },
    { text: "New Post", url: "/dashboard/post" },
    { text: "Account", url: "/admin/dashboard/account" },
    { text: "Log Out", url: "/log-out" },
  ];
  return (
    <div className={cn(inter.className, "antialiased")}>
      <Navbar links={links} />
      {children}
      <Toaster />
      <Footer />
    </div>
  );
}
