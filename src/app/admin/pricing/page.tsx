"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { BaseLinks, SessionLinks } from "@/app/admin/dashboard/lib/constants";
import { Input } from "@/components/ui/input";
import PricingInfo from "@/app/admin/pricing/pricing-info.mdx";

export default function Page() {
  const { data: session } = authClient.useSession();

  const [postBoards, setPostBoards] = useState(3);
  const [postTime, setPostTime] = useState(4);

  const components = {
    h1: (props: string[]) => (
      <p
        className="mb-2 mt-4 text-center text-xl font-bold mb:text-2xl sm:text-3xl"
        {...props}
      />
    ),
    h2: (props: string[]) => (
      <p
        className="mt-8 text-center text-xl font-bold mb:text-2xl sm:text-3xl"
        {...props}
      />
    ),
    h3: (props: string[]) => (
      <p
        className="mx-auto max-w-72 p-4 text-center text-xl font-semibold xl:max-w-full"
        {...props}
      />
    ),
    p: (props: string[]) => (
      <p className="mt-4 px-6 text-lg leading-8" {...props} />
    ),
  };

  return (
    <div className="flex min-h-dvh flex-col bg-gradient-to-br from-blue-50 via-blue-100 to-white">
      <Navbar links={session ? SessionLinks : BaseLinks} />
      <div className="flex flex-grow flex-col justify-center md:flex-row md:justify-evenly md:px-6 md:py-8 lg:mx-auto lg:w-[1024px] xl:w-[1280px]">
        <div className="mx-auto mt-8 w-4/5 rounded-lg bg-white p-4 md:mx-0 md:mt-0 md:w-1/2 lg:w-1/2">
          <PricingInfo components={components} />
        </div>
        <div className="mt-8 flex flex-col items-center md:ml-6 md:w-2/5 md:justify-center">
          <div className="relative mx-auto my-6 w-fit rounded-lg border-4 border-gray-300 bg-gray-100 p-6 sm:px-6">
            <div className="flex flex-col">
              <label className="mt-2 font-semibold mb:text-lg sm:text-lg">
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

              <label className="mt-6 font-semibold mb:text-lg sm:text-lg">
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

              <label className="mt-6 font-bold mb:text-lg sm:text-xl">
                Total Cost
              </label>
              <Input
                className="mt-2 border-2 border-gray-500 italic sm:text-lg md:text-lg"
                type="string"
                value={"$" + postTime * postBoards * 5.0 + ".00"}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
