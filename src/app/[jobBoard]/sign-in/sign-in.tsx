"use client";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { emailOtp, signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";

export default function SignIn() {
  // Track the email, loading state, page state, and OTP code.
  // Page state switches between email input and OTP input.
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState<{ email: string | null }>({ email: null });
  const [code, setCode] = useState("");

  return state.email ? (
    <Card className="mx-auto max-w-md p-2">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
        <CardDescription className="text-sm">
          Login using the code sent to your email address.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <InputOTP
            name="code"
            value={code}
            onChange={(value) => setCode(value)}
            maxLength={6}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <div className="flex justify-center">
          {!isLoading && (
            <Button
              className="text-base italic text-gray-700"
              variant="link"
              type="button"
              disabled={isLoading}
              onClick={async () => {
                await emailOtp.sendVerificationOtp(
                  {
                    email,
                    type: "sign-in",
                  },
                  {
                    onResponse: () => {
                      setIsLoading(false);
                    },
                    onRequest: () => {
                      setIsLoading(true);
                    },
                    onError: (ctx) => {
                      toast.error(ctx.error.message);
                    },
                    onSuccess: async () => {
                      setState({ email });
                    },
                  }
                );
              }}>
              Resend verification code
            </Button>
          )}
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
          onClick={async () => {
            await signIn.emailOtp(
              {
                email,
                otp: code,
              },
              {
                onResponse: () => {
                  setIsLoading(false);
                },
                onRequest: () => {
                  setIsLoading(true);
                },
                onError: (ctx) => {
                  toast.error(ctx.error.message);
                },
                onSuccess: async () => {
                  router.replace("/dashboard");
                  router.refresh();
                },
              }
            );
          }}>
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : "Login"}
        </Button>
      </CardContent>
    </Card>
  ) : (
    <Card className="mx-auto max-w-md p-2">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
        <CardDescription className="text-sm">
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label className="!text-lg" htmlFor="email">
            Email
          </Label>
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

        <Button
          type="submit"
          className="!mt-6 w-full"
          disabled={isLoading}
          onClick={async () => {
            await emailOtp.sendVerificationOtp(
              {
                email,
                type: "sign-in",
              },
              {
                onResponse: () => {
                  setIsLoading(false);
                },
                onRequest: () => {
                  setIsLoading(true);
                },
                onError: (ctx) => {
                  toast.error(ctx.error.message);
                },
                onSuccess: async () => {
                  setState({ email });
                },
              }
            );
          }}>
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : "Login"}
        </Button>
      </CardContent>
    </Card>
  );
}
