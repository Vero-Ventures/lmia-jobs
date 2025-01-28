"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { signUp } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createStripeUser } from "@/actions/stripe/create-user";

export function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);

  const [showVerifyEmail, setShowVerifyEmail] = useState(false);
  return !showVerifyEmail ? (
    <Card className="z-50 mx-auto max-w-md rounded-md rounded-t-none">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Sign Up</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-gray-900 bg-opacity-50 ${showVerifyEmail ? "" : "hidden"}`}>
          <div className="mx-4 flex w-96 flex-col space-y-4 rounded-lg border bg-white p-6 mb:w-[416px] sm:w-[448px]">
            <p className="mt-2 text-center text-2xl font-bold text-gray-800 mb:text-3xl">
              Verify Your Email
            </p>
            <p className="px-2 text-center text-lg text-gray-800 mb:pt-4 mb:text-xl">
              A verification email has been sent to your inbox. Click the{" "}
              <span className="font-bold">Verify Email</span> button to activate
              your account be redirected to the sign-in page.
            </p>
            <p className="px-2 text-center text-lg italic text-gray-800 mb:pb-4 mb:text-xl">
              If you do not see the email, please check your spam or junk
              folder.
            </p>
            <Button
              type="submit"
              className="mx-auto w-3/5 py-6 text-base mb:text-lg"
              onClick={() => router.replace("/sign-in")}>
              Go To Sign In
            </Button>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              required
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                className="pr-14"
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="Password"
              />
              <Button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-2 h-6 w-6">
                {showPassword ? <EyeOff /> : <Eye />}
              </Button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Confirm Password</Label>
            <div className="relative">
              <Input
                className="pr-14"
                id="password_confirmation"
                type={showConfirmedPassword ? "text" : "password"}
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                autoComplete="new-password"
                placeholder="Confirm Password"
              />
              <Button
                type="button"
                onClick={() => setShowConfirmedPassword((prev) => !prev)}
                className="absolute right-2 top-2 h-6 w-6">
                {showConfirmedPassword ? <EyeOff /> : <Eye />}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            onClick={async () => {
              if (password !== passwordConfirmation) {
                toast.error("Passwords must match");
                return;
              }
              const alphaOnly = /^[a-zA-Z]+$/;
              if (alphaOnly.test(password)) {
                toast.error("Password must contain a number or symbol");
                return;
              }
              await signUp.email(
                {
                  email,
                  password,
                  name: email,
                  callbackURL: "/sign-in",
                },
                {
                  onResponse: () => {
                    setLoading(false);
                  },
                  onRequest: () => {
                    setLoading(true);
                  },
                  onError: (ctx) => {
                    toast.error(ctx.error.message);
                  },
                  onSuccess: async () => {
                    await createStripeUser(email);
                    setShowVerifyEmail(true);
                  },
                }
              );
            }}>
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Create an account"
            )}
          </Button>
          <Link
            href="/sign-in"
            className="mx-auto inline-block text-sm underline">
            Back to sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  ) : (
    <Card className="z-50 mx-auto max-w-md rounded-md rounded-t-none">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Verify Your Email</CardTitle>
        <CardDescription>
          A verification email has been sent to your inbox. Click the{" "}
          <span className="font-bold">Verify Email</span> button to activate
          your account be redirected to the sign-in page.
        </CardDescription>
        <CardDescription>
          If you do not see the email, please check your spam or junk folder.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button className="w-full" asChild>
          <Link href="/sign-in">Go To Sign In</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
