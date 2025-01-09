"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const router = useRouter();

  const signUp = async () => {
    await authClient.signUp.email(
      {
        email,
        password,
        name,
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

  const signUpWithGoogle = async () => {
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
        type="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
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
      <button onClick={signUp}>Sign Up</button>
      <button onClick={signUpWithGoogle}>Sign Up With Google</button>
    </div>
  );
}
