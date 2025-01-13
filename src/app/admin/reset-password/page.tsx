"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { handleResetPassword } from "@/actions/handle-pass-reset";
import { Button } from "@/components/ui/button";

export default function ResetPassword() {
  const [resetInProgress, setResetInProgress] = useState(false);
  const [passwordResetError, setPasswordResetError] = useState("");

  const [resetCode, setResetCode] = useState("");

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const resetPassword = async () => {
    setResetInProgress(true);
    setPasswordResetError("");

    const result = await handleResetPassword(
      resetCode,
      password,
      confirmPassword
    );

    if (result === "success") {
      console.log("success");
      router.push("/log-in");
    } else {
      setPasswordResetError(result);
    }
    setResetInProgress(false);
  };

  return (
    <div className="h-dvh content-center bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 px-8">
      <div className="mx-auto max-w-lg rounded-xl border-4 border-blue-200 bg-white p-8">
        <h2 className="mx-auto w-fit text-3xl font-semibold">Reset Password</h2>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="email" className="mb-2 block font-semibold">
            Reset Code:
          </label>
          <input
            type="text"
            id="passcode"
            value={resetCode}
            onChange={(e) => setResetCode(e.target.value)}
            className="w-full rounded-md border-2 border-gray-600 p-2 px-4"
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="password" className="mb-2 block font-semibold">
            New Password:
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border-2 border-gray-600 p-2 px-4"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute mt-2.5 h-6 w-6 -translate-x-10">
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="confirmPassword" className="mb-2 block font-semibold">
            Confirm New Password:
          </label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-md border-2 border-gray-600 p-2 px-4"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute mt-2.5 h-6 w-6 -translate-x-10">
            {showConfirmPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>

        <div className="mt-6 flex flex-col items-center">
          {passwordResetError !== "" && (
            <p className="mb-4 w-2/3 text-center text-xl font-bold text-red-500">
              {passwordResetError}
            </p>
          )}
          <Button
            type="submit"
            className="w-1/2 bg-gradient-to-r from-blue-500 to-blue-600 py-6 text-xl font-bold shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            disabled={resetInProgress}
            onClick={() => resetPassword()}>
            Reset Password
          </Button>
        </div>
      </div>
    </div>
  );
}
