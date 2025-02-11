"use client";

import { useState } from "react";
import { optOutOfReminders } from "@/actions/mailer";
import { Button } from "@/components/ui/button";
import Footer from "@/components/page-wrappers/footer";

// Takes: The user email in the params.
export default function OptOut({
  params,
}: {
  params: Promise<{ email: string }>;
}) {
  // Track if opt-out status is being updated and if the user has opted out.
  const [isUpdating, setIsUpdating] = useState(false);
  const [optedOut, setOptedOut] = useState("false");

  const handleOptOut = async () => {
    // Set updating staus as true, and unset in finally block.
    setIsUpdating(true);
    try {
      // Get user email from URL query params. Throw an error if no email is found.
      const { email } = await params;

      if (!email) {
        throw new Error("No email address found.");
      }

      // Call helper function to update user mailing as opted out.
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
    <div className="flex flex-grow flex-col">
      <main className="mx-auto flex max-w-2xl flex-1 items-center justify-center px-4 text-center">
        <div className="flex-1 flex-col items-center rounded-xl border-4 border-blue-300 bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 p-6">
          <h1 className="mb-4 text-5xl font-bold leading-[4.5rem] tracking-tight text-gray-900">
            Opt Out Of Email Reminders
          </h1>
          {optedOut !== "true" ? (
            <div>
              <p className="mb-4 text-xl font-semibold text-gray-600">
                Opting out will stop further reminders about your account.
              </p>
              <p className="mb-4 text-lg italic text-gray-600">
                If the account is not activated in 30 days of creation, the
                account and its posts will be deleted.
              </p>
            </div>
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
      <Footer title={"Manage Opportunities"} />
    </div>
  );
}
