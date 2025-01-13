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

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const links = [
    { text: "Home", url: "/admin" },
    { text: "Pricing", url: "/admin/pricing" },
    { text: "About", url: "/admin/about-us" },
    { text: "Join Now", url: "/admin/sign-up" },
    { text: "Log In", url: "/admin/log-in" },
  ];

  // const sessionLinks = [
  //   { text: "Home", url: "/admin/dashboard" },
  //   { text: "Pricing", url: "/admin/pricing" },
  //   { text: "Contact Us", url: "/admin/contact-us" },
  //   { text: "Log Out", url: "/admin/log-out" },
  // ];

  return (
    <div className={cn(inter.className, "antialiased")}>
      <Navbar links={links} />
      {children}
      <Toaster />
      <Footer />
    </div>
  );
}
