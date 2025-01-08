import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Component() {
  const links = [
    { text: "Home", url: "/admin" },
    { text: "Pricing", url: "/pricing" },
    { text: "About", url: "/about-us" },
    { text: "Login / Signup", url: "/api/auth/login" },
  ];
  return (
    <div>
      <Navbar links={links} />
      <div className="flex min-h-dvh flex-col bg-gradient-to-br from-blue-50 via-blue-100 to-white">
        <main className="mx-auto flex max-w-2xl flex-1 flex-col items-center justify-center px-4 text-center">
          <div className="mb-8 flex items-center space-x-2">
            <span className="text-6xl font-bold tracking-tighter text-blue-800">
              Application Name / Landing Title
            </span>
          </div>
          <h1 className="mb-4 text-3xl font-bold leading-[4.5rem] tracking-tight text-gray-900">
            (Call To Action)
          </h1>
          <p className="mb-8 text-lg text-gray-600">(Appliaction Info)</p>
          <div className="flex flex-row space-x-12">
            <Button
              type="submit"
              className="mt-4 bg-blue-600 px-8 py-6 text-lg text-white hover:bg-blue-700">
              <Link href={"api/auth/login"}>Sign Up</Link>
            </Button>
            <Button
              type="submit"
              className="mt-4 bg-blue-600 px-8 py-6 text-lg text-white hover:bg-blue-700">
              <Link href={"api/auth/login"}>Log In</Link>
            </Button>
          </div>
        </main>
        <footer className="mx-auto max-w-2xl px-4 py-8 text-center text-sm text-gray-600">
          <p>
            © {new Date().getFullYear()} LMIA Jobs - Developed by{" "}
            <a
              href="https://www.veroventures.com/"
              className="text-blue-600 hover:text-blue-700">
              Vero Ventures
            </a>
          </p>
        </footer>
      </div>
      <Footer />
    </div>
  );
}
