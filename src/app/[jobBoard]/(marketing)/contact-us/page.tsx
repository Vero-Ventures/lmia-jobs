"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Heading from "@/components/ui/html/heading";
import { sendContactEmail } from "@/actions/mailer";

type FormSchema = z.infer<typeof formSchema>;

// Define the 'contact us' form via Zod schema.
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  body: z.string().min(1, { message: "Message body is required" }),
});

export default function Page() {
  // Track loading state and define Zod form and schema.
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      subject: "",
      body: "",
    },
  });

  // Define submission handler.
  const handleSubmit = async (values: FormSchema) => {
    // Update loading state and call mailer handler.
    setIsLoading(true);
    toast.promise(sendContactEmail(values), {
      loading: "Sending email...",
      success:
        "You're email has been sent! We'll get back to you as soon as possible.",
      error: (error) => {
        // Log error details and return a basic error message to the user.
        console.error("Error: " + error);
        return "An error occurred while sending the message. Please try again.";
      },
      // On completion, always reset loading state.
      finally: () => setIsLoading(false),
    });
  };

  return (
    <main className="mx-auto w-5/6 max-w-xl py-14">
      <div className="rounded-lg border-2 border-gray-300 p-6">
        <Heading variant="h1" className="mb-4 text-center">
          Contact Us
        </Heading>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <span className="text-base font-semibold sm:text-lg">
                      Email
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your email address"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <span className="text-base font-semibold sm:text-lg">
                      Subject
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your reason for contact"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <span className="text-base font-semibold sm:text-lg">
                      Details
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="max-h-64 min-h-36"
                      placeholder="Your message details"
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
