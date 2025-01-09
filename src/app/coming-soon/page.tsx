import { WrenchIcon } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function Component() {
  const links = [
    { text: "Home", url: "/" },
    { text: "Pricing", url: "/pricing" },
    { text: "About", url: "/wip" },
    { text: "Join Now", url: "/sign-up" },
    { text: "Log In", url: "/log-in" },
  ];
  return (
    <div>
      <Navbar links={links} />
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-gray-100">
        <WrenchIcon className="h-12 w-12 text-gray-500" />
        <h1 className="text-2xl font-bold text-gray-800">
          Page Under Construction
        </h1>
        <p className="max-w-md text-center text-gray-500">
          This page is currently being worked on and will be available soon.
          Please check back later.
        </p>
      </div>
      <Footer />
    </div>
  );
}
