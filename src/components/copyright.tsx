"use client";

export default function Copyright() {
  return (
    <p className="mt-8 text-center">
      © {new Date().getFullYear()} LMIA Jobs - Developed by{" "}
      <a
        href="https://www.veroventures.com/"
        className="text-blue-600 hover:text-blue-700">
        Vero Ventures
      </a>
    </p>
  );
}
