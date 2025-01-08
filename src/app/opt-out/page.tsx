"use client";

import { useState } from "react";
import { optOutOfReminders } from "@/actions/opt-out";
import { Button } from "@/components/ui/button";

export default function OptOut() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [optedOut, setOptedOut] = useState("false");

  const handleOptOut = async () => {
    setIsUpdating(true);
    try {
      // Get user email address from the url.
      const params = new URLSearchParams(window.location.search);
      const email = params.get("account");
      if (!email) {
        throw new Error("No email address found.");
      }

      // Set the user as opted out and update the opt out state.
      const result = await optOutOfReminders(email);
      setOptedOut(result);
    } catch (err) {
      if (err instanceof Error) {
        setOptedOut("error");
      }
    } finally {
      setIsUpdating(false);
    }
  };
  return (
    <div className="flex min-h-dvh flex-col bg-gradient-to-br from-blue-50 via-blue-100 to-white">
      <main className="mx-auto flex max-w-2xl flex-1 items-center justify-center px-4 text-center">
        <div className="flex-1 flex-col items-center rounded-xl border-4 border-gray-600 bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 p-6">
          <h1 className="mb-4 text-5xl font-bold leading-[4.5rem] tracking-tight text-gray-900">
            Opt Out Of Email Reminders
          </h1>
          {optedOut !== "true" ? (
            <p className="mb-4 text-lg font-semibold text-gray-600">
              Opting out will stop further reminders about your account. If the
              account is not activated in 30 days, the account and its posts
              will be deleted.
            </p>
          ) : (
            <p className="mb-4 text-lg font-semibold text-gray-600">
              Reminders have been disabled, you will no longer receive emails
              about your account.
            </p>
          )}
          {optedOut === "error" && (
            <p className="mb-2 text-lg font-semibold text-red-400">
              An error occurred while updating our system. Please try again.
            </p>
          )}
          <Button
            type="submit"
            className="mt-4 bg-blue-600 px-8 py-6 text-lg text-white hover:bg-blue-700"
            onClick={() => handleOptOut()}
            disabled={isUpdating}>
            {isUpdating ? "Updating" : "Opt Out"}
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
  );
}
