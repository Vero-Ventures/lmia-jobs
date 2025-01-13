"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { forgetPassword } from "@/lib/auth-client";
import Link from "next/link";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">
          Reset your Password
        </CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Enter your email below to receive a link to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            onClick={async () => {
              await forgetPassword(
                { email, redirectTo: "/admin/reset-password" },
                {
                  onResponse: () => {
                    setLoading(false);
                  },
                  onRequest: () => {
                    setLoading(true);
                  },
                  onError: (ctx) => {
                    console.log(ctx.error.message);
                    toast.error(ctx.error.message);
                  },
                  onSuccess: async () => {
                    toast.success(
                      "You should receive a link in your email shortly."
                    );
                  },
                }
              );
            }}>
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Continue"
            )}
          </Button>
          <Link
            href="/admin/sign-in"
            className="mx-auto inline-block text-sm underline">
            Back to Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
