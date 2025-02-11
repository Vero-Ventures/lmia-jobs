import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [emailOTPClient()],
});

export const {
  signUp,
  signIn,
  forgetPassword,
  resetPassword,
  emailOtp,
  signOut,
  getSession,
  useSession,
} = authClient;
