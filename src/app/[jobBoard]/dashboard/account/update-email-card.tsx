"use client";
import { updateEmail } from "@/actions/handle-account";
import { useState } from "react";
import { signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { User } from "better-auth";
import { useRouter } from "next/navigation";

export default function UpdateEmailCard({ user }: { user: User }) {
  const router = useRouter();
  // Track the new email and if the user has confirmed the email update.
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmailUpdate, setConfirmEmailUpdate] = useState(false);

  // Track the email update error and the log out timer.
  const [emailUpdateError, setEmailUpdateError] = useState("");
  const [updateLogOutTimer, setUpdateLogOutTimer] = useState(-1);

  const handleEmailUpdate = async () => {
    // Update the users email.
    const updateEmailResult = await updateEmail(user.id, newEmail);

    if (updateEmailResult === "success") {
      // Wait 5 seconds before logging the user out.
      // Gives users a chance to see the success message.
      let countdown = 5;
      const intervalId = setInterval(() => {
        setUpdateLogOutTimer(countdown--);

        if (countdown < 0) {
          clearInterval(intervalId);
        }
      }, 1000);

      // Log out the user now that the email has been updated.
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
          },
        },
      });
    } else {
      // On error, update the error display message.
      setEmailUpdateError(updateEmailResult);
    }
  };
  return (
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
            You will be required to verify the new email address before logging
            in again.
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
  );
}
