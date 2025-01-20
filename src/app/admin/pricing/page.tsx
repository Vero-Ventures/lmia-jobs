"use client";

import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { BaseLinks, SessionLinks } from "@/app/admin/dashboard/lib/constants";
import Form from "next/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createStripePurchase } from "@/actions/stripe/create-checkout";
import PricingInfo from "@/app/admin/pricing/pricing-info.mdx";

export default function Page() {
  const { data: session } = authClient.useSession();

  const [postBoards, setPostBoards] = useState(0);
  const [postTime, setPostTime] = useState(0);

  const [createSessionError, setCreateSessionError] = useState(false);

  const submitPurchaseForm = async () => {
    if (!session) {
      redirect("/admin/sign-in");
    }

    setCreateSessionError(false);

    const result = await createStripePurchase(
      session!.user.email,
      postBoards,
      postTime
    );

    if (result.result) {
      // redirect(result.url);
    } else {
      setCreateSessionError(true);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-gradient-to-br from-blue-50 via-blue-100 to-white">
      <Navbar links={session ? SessionLinks : BaseLinks} />
      <div className="flex flex-grow flex-col items-center md:flex-row md:justify-between md:px-6 lg:px-12 xl:px-24">
        <div className="mx-auto mt-8 w-4/5 rounded-lg bg-white p-4 md:mx-0 md:w-3/5 lg:mx-auto lg:w-1/2">
          <PricingInfo />
        </div>
        <div className="flex flex-col items-center md:w-1/3">
          <Form className="flex flex-col" action={submitPurchaseForm}>
            <label className="font-semibold">Job Boards</label>
            <Input
              className="border-2 border-gray-500"
              type="number"
              name="workHours"
              value={postBoards}
              onChange={(e) => setPostBoards(Number(e.target.value))}
              placeholder="1"
            />

            <label className="font-semibold">Weeks Posted</label>
            <Input
              className="border-2 border-gray-500"
              type="number"
              name="workHours"
              value={postTime}
              onChange={(e) => setPostTime(Number(e.target.value))}
              placeholder="1"
            />

            <Button type="submit" className="mt-4">
              Submit
            </Button>
          </Form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
