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
  return <>{children}</>;
}
