"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { joinMailingList } from "@/app/actions";
import { CheckCircle2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function WaitingListForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await joinMailingList({ email });
      setIsSubmitted(true);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return isSubmitted ? (
    <div className="flex items-center space-x-2 rounded-lg bg-green-100 p-4 text-green-600">
      <CheckCircle2Icon className="size-4" />
      <span>Thank you for joining our waiting list!</span>
    </div>
  ) : (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="mx-auto flex max-w-md flex-col gap-2 sm:flex-row">
        <Input
          type="email"
          placeholder="Your work email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="shadow-sm"
        />
        <Button
          type="submit"
          className="bg-blue-600 text-white hover:bg-blue-700"
          disabled={isSubmitting}>
          {isSubmitting ? "Joining..." : "Join The Waitlist"}
        </Button>
      </div>
    </form>
  );
}
