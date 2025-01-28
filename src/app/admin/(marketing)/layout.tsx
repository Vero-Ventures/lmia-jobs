import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Opportunities",
  description: "Streamlining the LMIA process for Canadian employers",
};

export default async function AdminMarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
