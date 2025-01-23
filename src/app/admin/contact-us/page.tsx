"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { sendContactEmail } from "@/actions/mailer";

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

import { ToastAction } from "@/components/ui/toasts/toast";
import { useToast } from "@/components/ui/toasts/use-toast";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the 'contact us' form via Zod schema.
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  body: z.string().min(1, { message: "Message body is required" }),
});

export default function Page() {
  // Define loading state and form information.
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      subject: "",
      body: "",
    },
  });

  const { toast } = useToast();

  // Define an error element to be displayed if the Email cannot be sent.
  const toastError = (values: z.infer<typeof formSchema>) => {
    toast({
      variant: "destructive",
      title: "Something went wrong.",
      description: "There was a problem sending your message.",
      action: (
        <ToastAction
          id="RetryEmail"
          altText="Retry sending email"
          onClick={() => {
            handleSubmit(values);
          }}>
          Retry
        </ToastAction>
      ),
    });
  };

  // Define submission handler.
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    // Update loading state and extract form data.
    setLoading(true);
    const { email, subject, body } = values;

    try {
      // Call the Email handler and check for an error response.
      const response = await sendContactEmail(email, subject, body);

      if (!response) {
        // On error use the toast error element to display an error message to the user.
        toastError(values);
      } else {
        // Inform the user of the success and reset the form.
        toast({
          title: "Email sent!",
          description: "We'll get back to you as soon as possible.",
        });
        form.reset();
      }
    } catch (error) {
      // On error, log a message and display the toast error element.
      console.error("Error Sending Message:", error);
      toastError(values);
    } finally {
      // Always set loading to be false after submission handling.
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-fit w-full max-w-3xl px-8 py-10 sm:w-3/4">
      <section
        className="flex-grow transform overflow-auto rounded-lg bg-white px-8 py-10 shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-2xl"
        style={{ maxHeight: "90vh", width: "40vw", maxWidth: "none" }}>
        <h1 className="mb-6 text-center text-4xl font-extrabold tracking-tight text-gray-800">
          Contact Us
        </h1>
        <Form {...form}>
          <form
            id="ContactForm"
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
            <Button
              type="submit"
              className={`${
                loading
                  ? "bg-gray-400"
                  : "transform bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 ease-in-out hover:scale-105 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
              } rounded-lg px-6 py-3 font-semibold text-white shadow-lg sm:w-40 sm:text-lg md:w-44 lg:w-56`}
              disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Form>
      </section>
    </div>
  );
}
