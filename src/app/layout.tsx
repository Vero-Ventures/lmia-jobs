import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased flex flex-col min-h-dvh")}>
        {children}
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
