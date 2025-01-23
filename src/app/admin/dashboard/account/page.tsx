"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { useState } from "react";
import { updateEmail, updatePassword } from "@/actions/handle-account";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";

export default function Page() {
  const { data: session, isPending } = useSession();

  if (!session && !isPending) {
    redirect("/admin");
  }

  const [newEmail, setNewEmail] = useState("");
  const [confirmEmailUpdate, setConfirmEmailUpdate] = useState(false);
  const [emailUpdateError, setEmailUpdateError] = useState("");
  const [updateLogOutTimer, setUpdateLogOutTimer] = useState(-1);

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordUpdateError, setPasswordUpdateError] = useState("");
  const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailUpdate = async () => {
    const updateEmailResult = await updateEmail(session!.user.email, newEmail);

    if (updateEmailResult === "success") {
      let countdown = 5;
      const intervalId = setInterval(() => {
        setUpdateLogOutTimer(countdown--);

        if (countdown < 0) {
          clearInterval(intervalId);
        }
      }, 1000);

      await signOut({
        fetchOptions: {
          onSuccess: () => {
            redirect("/admin");
          },
        },
      });
    } else {
      setEmailUpdateError(updateEmailResult);
    }
  };

  const handlePasswordUpdate = async () => {
    const updatePasswordResult = await updatePassword(
      newPassword,
      confirmNewPassword
    );

    if (updatePasswordResult === "success") {
      setPasswordUpdateSuccess(true);
    } else {
      setPasswordUpdateError(updatePasswordResult);
    }
  };

  return (
    <main>
      <div className="space-y-4 p-20">
        <div className="flex justify-center">
          <Button asChild size="lg">
            <Link
              href={"https://billing.stripe.com/p/login/7sI2bz5KPgXadXOeUU"}>
              Manage Subsciption
            </Link>
          </Button>
        </div>
        <Card className="mx-auto max-w-xl">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Reset Email</CardTitle>
          </CardHeader>
          <CardContent>
            <Label>New Email</Label>
            <Input
              className="mt-2"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              type="text"
            />
          </CardContent>
          {confirmEmailUpdate && (
            <div className="my-6 flex flex-col text-center text-base">
              <h1 className="block text-xl font-semibold text-gray-800">
                Warning:
              </h1>
              <h1 className="mt-2">
                Resetting your email will result in you being logged out on
                completion.
              </h1>
              <h1 className="mt-2">
                You will be required to verify the new email address before
                logging in again.
              </h1>
            </div>
          )}

          {updateLogOutTimer >= 0 && (
            <div className="mb-8 mt-8 flex flex-col text-center">
              <h1 className="block text-lg font-semibold text-gray-800">
                Email Update Successful
              </h1>
              <h1 className="mt-2 text-lg italic">
                Logging Out In: {updateLogOutTimer}
              </h1>
            </div>
          )}

          <div className="mx-auto my-6 w-fit text-center text-lg font-semibold text-red-400">
            {emailUpdateError === "existing email" && (
              <p>
                Email already assosiated <br />
                with an existing account.
              </p>
            )}
            {emailUpdateError === "error" && (
              <p>
                An error occurred <br />
                while updating your email. <br />
                Please try again.
              </p>
            )}
          </div>

          <CardFooter>
            {confirmEmailUpdate ? (
              <Button className="w-full" onClick={handleEmailUpdate}>
                Confirm
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() => setConfirmEmailUpdate(true)}>
                Update
              </Button>
            )}
          </CardFooter>
        </Card>
        <Card className="mx-auto max-w-xl">
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
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
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
            </div>
            <div className="mx-auto my-6 w-fit text-center text-lg font-semibold text-red-400">
              {passwordUpdateError === "not matching" && (
                <p>Your passwords must match.</p>
              )}
              {passwordUpdateError === "short password" && (
                <p>
                  Your password must <br />
                  be at least eight characters.
                </p>
              )}
              {passwordUpdateError === "weak password" && (
                <p>
                  Your password must <br />
                  contain at least one <br />
                  letter or number.
                </p>
              )}
              {passwordUpdateError === "error" && (
                <p>
                  An error occurred while <br />
                  updating your password. <br />
                  Please try again.
                </p>
              )}
            </div>

            <div className="mx-auto my-6 w-fit text-center text-lg font-semibold italic text-gray-400">
              {passwordUpdateSuccess && (
                <p className="mb-2">
                  Your password has been <br />
                  updated successfully.
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handlePasswordUpdate}>
              Confirm
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
