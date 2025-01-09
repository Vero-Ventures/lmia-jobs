"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { handleLogin } from "@/actions/handle-log-in";
import { Button } from "@/components/ui/button";
import { handlePasswordReset } from "@/actions/handle-pass-reset";

export default function SignUp() {
  const [loggingIn, setLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [activatedNewAccount, setActivatedNewAccount] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(true);
  const [resetPassword, setResetPassword] = useState(false);
  const [resetPasswordEmail, setResetPasswordEmail] = useState("");

  const router = useRouter();

  const resetPasswordHandler = async () => {
    await handlePasswordReset(resetPasswordEmail);
    setResetPassword(true);
    setShowPasswordReset(false);
  };

  const logIn = async () => {
    // Set login process to be started and clear.
    setLoggingIn(true);
    setLoginError(false);
    setResetPassword(false);

    const result = await handleLogin(email, password);

    if (result === "reset") {
      setActivatedNewAccount(true);
    } else if (result === "success") {
      router.push("/admin/dashboard");
    } else {
      setLoginError(true);
    }
    setLoggingIn(false);
  };

  return (
    <div className="h-dvh content-center bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 px-8">
      {showPasswordReset && (
        <div className="relative">
          <div className="absolute left-1/2 z-10 max-w-xl -translate-x-1/2 translate-y-16 transform rounded-xl border-4 border-blue-200 bg-white p-8 mb:min-w-[384px] sm:min-w-[448px]">
            <h2 className="mx-auto mb-4 w-fit text-center text-3xl font-semibold">
              Reset Password
            </h2>
            <div style={{ marginBottom: "1rem" }}>
              <label htmlFor="email" className="mb-2 block font-semibold">
                Email:
              </label>
              <input
                type="email"
                id="email"
                value={resetPasswordEmail}
                onChange={(e) => setResetPasswordEmail(e.target.value)}
                className="w-full rounded-md border-2 border-gray-600 p-2 px-4"
              />
            </div>
            <div className="mt-6 flex flex-col items-center">
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-blue-600 py-6 text-xl font-bold shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 mb:w-1/2"
                disabled={loggingIn}
                onClick={() => resetPasswordHandler()}>
                Reset Password
              </Button>
            </div>
          </div>
        </div>
      )}

      <div
        className={`mx-auto max-w-lg rounded-xl border-4 border-blue-200 bg-white p-8 ${showPasswordReset ? "opacity-60" : ""}`}>
        <h2 className="mx-auto w-fit text-3xl font-semibold">Sign Up</h2>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="email" className="mb-2 block font-semibold">
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border-2 border-gray-600 p-2 px-4"
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="password" className="mb-2 block font-semibold">
            Password:
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
        <Button
          type="submit"
          className="ml-4 w-1/3 border-2 border-gray-300 bg-gray-300 py-4 text-base font-semibold text-black shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:bg-gray-400 focus:outline-none"
          disabled={loggingIn}
          onClick={() => setShowPasswordReset(true)}>
          Reset Password
        </Button>

        <div className="mt-6 flex flex-col items-center">
          {activatedNewAccount && (
            <div className="flex w-full flex-col items-center">
              <p className="opacity-9 mb-4 w-3/4 text-center text-lg font-bold italic text-gray-500">
                Your account has been activated and a password reset link has
                been sent.
              </p>
              <p className="mb-4 w-3/4 text-center text-lg font-bold italic text-gray-500 opacity-90">
                Please reset your password before logging in.
              </p>
            </div>
          )}
          {resetPassword && (
            <p className="mb-4 w-3/4 text-center text-lg font-bold italic text-gray-500 opacity-90">
              A password reset link has been sent to your email.
            </p>
          )}
          {loginError && (
            <p className="mb-4 w-2/3 text-center text-xl font-bold text-red-500">
              {loginError}
            </p>
          )}
          <Button
            type="submit"
            className="w-1/2 bg-gradient-to-r from-blue-500 to-blue-600 py-6 text-xl font-bold shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            disabled={loggingIn}
            onClick={() => logIn()}>
            Log In
          </Button>
        </div>
      </div>
    </div>
  );
}
