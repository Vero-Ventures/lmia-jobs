"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { BaseLinks, SessionLinks } from "@/app/admin/dashboard/lib/constants";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function Page() {
  const { data: session } = authClient.useSession();

  const [postBoards, setPostBoards] = useState(3);
  const [postTime, setPostTime] = useState(4);

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar links={session ? SessionLinks : BaseLinks} />
      <div className="mx-auto max-w-xl space-y-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
            <CardDescription>
              The cost of an Opportunities job posting is based on its duration
              and the number of boards it appears on. The base price is $5 per
              month, multiplied by the number of boards selected.
            </CardDescription>
            <CardDescription>
              For example, a post hosted on 5 boards for 3 months would cost
              $75.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Number Of Job Boards</Label>
              <Input
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
            </div>
            <div className="space-y-2">
              <Label>Months Posted</Label>
              <Input
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
            </div>
          </CardContent>
          <CardFooter>
            <div className="space-y-2">
              <h3 className="font-bold">Total Cost</h3>
              <p>{"$" + postTime * postBoards * 5.0 + ".00"}</p>
            </div>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
