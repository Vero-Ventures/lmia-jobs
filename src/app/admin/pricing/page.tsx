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
import { createStripeCheckout } from "@/actions/stripe/create-checkout";
import PricingInfo from "@/app/admin/pricing/pricing-info.mdx";

export default function Page() {
  const { data: session } = authClient.useSession();

  const [postBoards, setPostBoards] = useState(3);
  const [postTime, setPostTime] = useState(4);

  const [createSessionError, setCreateSessionError] = useState(false);

  const submitPurchaseForm = async () => {
    if (!session) {
      redirect("/admin/sign-in");
    }

    setCreateSessionError(false);

    const result = await createStripeCheckout(
      session!.user.email,
      postBoards,
      postTime
    );

    if (result.result) {
      redirect(result.url);
    } else {
      setCreateSessionError(true);
    }
  };

  const components = {
    h1: (props: string[]) => (
      <p
        className="mb-4 mt-2 text-center text-xl font-bold mb:text-2xl sm:text-3xl"
        {...props}
      />
    ),
    h3: (props: string[]) => (
      <p
        className="mx-auto max-w-80 px-4 text-center text-lg xl:max-w-full"
        {...props}
      />
    ),
    h4: (props: string[]) => (
      <p
        className="mx-auto max-w-72 p-4 text-center text-lg font-semibold xl:max-w-full"
        {...props}
      />
    ),
    p: (props: string[]) => <p className="leading-8" {...props} />,
  };

  return (
    <div className="flex min-h-dvh flex-col bg-gradient-to-br from-blue-50 via-blue-100 to-white">
      <Navbar links={session ? SessionLinks : BaseLinks} />
      <div className="flex flex-grow flex-col justify-center md:flex-row md:justify-evenly md:px-6 md:py-8 lg:mx-auto lg:w-[1024px] xl:w-[1280px]">
        <div className="mx-auto mt-8 w-4/5 rounded-lg bg-white p-4 md:mx-0 md:mt-0 md:w-1/2 lg:w-1/2">
          <PricingInfo components={components} />
          <Form
            className="mx-auto mb-4 flex w-2/3 max-w-80 flex-col rounded-lg border-4 border-gray-300 bg-gray-100 p-6"
            action={submitPurchaseForm}>
            <label className="text-base font-semibold">Job Boards</label>
            <Input
              className="mt-2 border-2 border-gray-500 md:text-base"
              type="number"
              value={postBoards}
              onChange={(e) => {
                if (Number(e.target.value) > 5) {
                  setPostBoards(5);
                } else if (Number(e.target.value) < 1) {
                  setPostBoards(1);
                } else {
                  setPostBoards(Number(e.target.value));
                }
              }}
            />

            <label className="mt-2 text-base font-semibold">
              Months Posted
            </label>
            <Input
              className="mt-2 text-base md:text-base"
              type="number"
              value={postTime}
              onChange={(e) => {
                if (Number(e.target.value) > 12) {
                  setPostTime(12);
                } else if (Number(e.target.value) < 1) {
                  setPostTime(1);
                } else {
                  setPostTime(Number(e.target.value));
                }
              }}
            />

            <label className="mt-2 text-base font-semibold">Total Cost</label>
            <Input
              className="gray-600 mt-2 text-base font-bold italic md:text-base"
              type="string"
              value={"$" + postTime * postBoards * 5.0 + ".00"}
              readOnly
            />
          </Form>
        </div>
        <div className="mt-8 flex flex-col items-center md:ml-6 md:w-2/5 md:justify-center">
          <div className="relative mx-auto my-6 w-fit rounded-lg border-4 border-gray-300 bg-gray-100 p-6 shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-2xl sm:px-6">
            <Form className="flex flex-col" action={submitPurchaseForm}>
              <label className="mt-2 font-semibold mb:text-lg sm:text-xl">
                Number Of Job Boards
              </label>
              <Input
                className="mt-2 border-2 border-gray-500 sm:text-lg md:text-lg"
                type="number"
                value={postBoards}
                onChange={(e) => {
                  if (Number(e.target.value) > 5) {
                    setPostBoards(5);
                  } else if (Number(e.target.value) < 1) {
                    setPostBoards(1);
                  } else {
                    setPostBoards(Number(e.target.value));
                  }
                }}
              />

              <label className="mt-6 font-semibold mb:text-lg sm:text-xl">
                Months Posted
              </label>
              <Input
                className="mt-2 border-2 border-gray-500 sm:text-lg md:text-lg"
                type="number"
                value={postTime}
                onChange={(e) => {
                  if (Number(e.target.value) > 12) {
                    setPostTime(12);
                  } else if (Number(e.target.value) < 1) {
                    setPostTime(1);
                  } else {
                    setPostTime(Number(e.target.value));
                  }
                }}
              />

              <div
                className={
                  createSessionError ? "mx-auto mt-6 w-fit" : "hidden"
                }>
                <p className="text-center text-xl font-semibold text-red-500">
                  <span className="text-2xl"> Error</span> <br />
                  Please Try Again
                </p>
              </div>

              <Button
                type="submit"
                className="mt-6 text-lg font-semibold sm:py-6 sm:text-xl">
                Create New Post
              </Button>
            </Form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
