import "@/app/globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

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
  return (
    <div className={cn(inter.className, "antialiased")}>
      {children}
      <Toaster />
    </div>
  );
}
