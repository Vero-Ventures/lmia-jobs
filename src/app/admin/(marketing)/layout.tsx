import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

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
