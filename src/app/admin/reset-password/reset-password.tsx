"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { resetPassword } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function ResetPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);
  return (
    <Card className="z-50 mx-auto max-w-md rounded-md rounded-t-none">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Reset Password</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Enter your new password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
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
              await resetPassword(
                {
                  newPassword: password,
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
                    router.push("/sign-in");
                  },
                }
              );
            }}>
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Reset your password"
            )}
          </Button>
        </div>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
