"use client";

import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { useState } from "react";
import Navbar from "@/components/navbar";
import { SessionLinks } from "@/app/admin/dashboard/lib/constants";
import Footer from "@/components/footer";
import { updateEmail, updatePassword } from "@/actions/handle-account";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
export default function Page() {
  const { data: session, isPending } = authClient.useSession();

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

      await authClient.signOut({
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
    <div>
      <Navbar links={SessionLinks} />
      <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-white p-6">
        <div className="mx-auto flex max-w-3xl flex-col rounded-lg border-4 border-gray-400 bg-gray-50">
          <div className="mx-auto mt-8 w-5/6 rounded-lg border-4 border-gray-300 bg-white p-4 mb:w-3/4 sm:w-2/3">
            <h1 className="mb-4 text-center text-xl font-bold">Reset Email</h1>
            <div className="mx-2 mt-6 mb:mx-auto mb:w-5/6">
              <label className="text-base font-semibold">New Email</label>
              <Input
                className="mt-2"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                type="text"
              />
            </div>

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

            <div className="mx-auto mt-4 w-fit">
              {confirmEmailUpdate ? (
                <Button
                  className="px-8 text-lg"
                  onClick={() => handleEmailUpdate()}>
                  Confirm
                </Button>
              ) : (
                <Button
                  className="px-8 text-lg"
                  onClick={() => setConfirmEmailUpdate(true)}>
                  Update
                </Button>
              )}
            </div>
          </div>

          <div className="mx-auto mt-8 w-5/6 rounded-lg border-4 border-gray-300 bg-white p-4 mb:w-3/4 sm:w-2/3">
            <h1 className="mb-4 text-center text-xl font-bold">
              Reset Password
            </h1>
            <div className="mx-2 mt-6 mb:mx-auto mb:w-5/6">
              <label className="text-base font-semibold">New Password</label>
              <Input
                className="mt-2"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                type="text"
              />
            </div>

            <div className="mx-2 mt-4 mb:mx-auto mb:w-5/6">
              <label className="text-base font-semibold">
                Confirm Password
              </label>
              <Input
                className="mt-2"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                type="text"
              />
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

            <div className="mx-auto mt-4 w-fit">
              <Button
                className="px-8 text-lg"
                onClick={() => handlePasswordUpdate()}>
                Confirm
              </Button>
            </div>
          </div>

          <Link
            className="mx-auto mb-8 mt-8 w-5/6 mb:w-3/4 sm:w-2/3"
            href={"https://billing.stripe.com/p/login/7sI2bz5KPgXadXOeUU"}>
            <div className="rounded-lg border-4 border-gray-300 bg-white p-4">
              <p className="text-center text-3xl font-bold text-gray-800">
                Manage Subsciption
              </p>
            </div>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
