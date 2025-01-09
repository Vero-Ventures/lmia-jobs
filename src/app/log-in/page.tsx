"use client";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const signIn = async () => {
    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onSuccess: () => {
          router.push("/admin/dashboard");
        },
        onError: (response) => {
          alert(response.error.message);
        },
      }
    );
  };

  const signInWithGoogle = async () => {
    await authClient.signIn.social(
      {
        provider: "google",
        callbackURL: "/admin/dashboard",
      },
      {
        onSuccess: () => {
          router.push("/admin/dashboard");
        },
        onError: (response) => {
          alert(response.error.message);
        },
      }
    );
  };

  return (
    <div>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={signIn}>Log In</button>
      <button onClick={signInWithGoogle}>Sign In With Google</button>
    </div>
  );
}
