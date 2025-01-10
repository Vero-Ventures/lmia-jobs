"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { handleSignUp } from "@/actions/handle-sign-up";
import { Button } from "@/components/ui/button";

export default function SignUp() {
  const [signUpInProgress, setSignUpInProgress] = useState(false);
  const [signUpError, setSignUpError] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const handleSignUpError = (signUpResult: string) => {
    if (signUpResult === "existing user") {
      setSignUpError("An account with that email already exists.");
    } else if (signUpResult === "different passwords") {
      setSignUpError("Your passwords do not match.");
    } else if (signUpResult === "short password") {
      setSignUpError("Your password must be 8 characters or longer.");
    } else if (signUpResult === "weak password") {
      setSignUpError("Your password must contain a number or symbol.");
    } else if (signUpResult === "bad email") {
      setSignUpError("Entered email is invalid.");
    } else {
      setSignUpError("An error occurred while creating your account.");
    }
  };

  const signUp = async () => {
    setSignUpInProgress(true);
    setSignUpError("");

    const result = await handleSignUp(email, password, confirmPassword);
    console.log(result)

    if (result === "success") {
      router.push("/admin/dashboard");
    } else {
      handleSignUpError(result);
    }
    setSignUpInProgress(false);
  };

  return (
    <div className="h-dvh content-center bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 px-8">
      <div className="mx-auto max-w-lg rounded-xl border-4 border-blue-200 bg-white p-8">
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

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="confirmPassword" className="mb-2 block font-semibold">
            Confirm Password:
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
          {signUpError !== "" && (
            <p className="mb-4 w-2/3 text-center text-xl font-bold text-red-500">
              {signUpError}
            </p>
          )}
          <Button
            type="submit"
            className="w-1/2 bg-gradient-to-r from-blue-500 to-blue-600 py-6 text-xl font-bold shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            disabled={signUpInProgress}
            onClick={() => signUp()}>
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
}
