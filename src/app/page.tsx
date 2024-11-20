import { WaitingListForm } from "@/components/waiting-list-form";
import { BriefcaseBusinessIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col bg-gradient-to-br from-blue-50 via-blue-100 to-white">
      <main className="mx-auto flex max-w-2xl flex-1 flex-col items-center justify-center px-4 text-center">
        <div className="mb-8 flex items-center space-x-2">
          <BriefcaseBusinessIcon className="size-10 text-blue-600" />
          <span className="text-3xl font-bold tracking-tighter text-blue-600 text-primary">
            Job Bank
          </span>
        </div>
        <h1 className="mb-4 text-6xl font-bold leading-[4.5rem] tracking-tight text-gray-900">
          Streamlining LMIA for Canadian employers
        </h1>
        <p className="mb-8 text-lg text-gray-600">
          Job Bank simplifies the Labour Market Impact Assessment process,
          connecting Canadian employers with qualified foreign workers
          efficiently and compliantly.
        </p>
        <WaitingListForm />
      </main>
      <footer className="mx-auto max-w-2xl px-4 py-8 text-center text-sm text-gray-600">
        <p>
          © {new Date().getFullYear()} Job Bank - Developed by{" "}
          <a
            href="https://www.veroventures.com/"
            className="text-blue-600 hover:text-blue-700"
          >
            Vero Ventures.
          </a>
        </p>
      </footer>
    </div>
  );
}
