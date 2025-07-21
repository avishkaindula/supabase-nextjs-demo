"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const name = formData.get("name")?.toString();
  const phone = formData.get("phone")?.toString();
  const dob = formData.get("dob")?.toString();
  const address = formData.get("address")?.toString();
  const license = formData.get("license")?.toString();
  const registration = formData.get("registration")?.toString();
  const userType = formData.get("userType")?.toString() || "user";
  const confirmPassword = formData.get("confirmPassword")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      userType === "pharmacy" ? "/sign-up/pharmacy" : "/sign-up/user",
      "Email and password are required"
    );
  }
  if (password !== confirmPassword) {
    return encodedRedirect(
      "error",
      userType === "pharmacy" ? "/sign-up/pharmacy" : "/sign-up/user",
      "Passwords do not match"
    );
  }

  // You can add more validation for required fields based on userType here if needed

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        name,
        phone,
        dob,
        address,
        license,
        registration,
        userType,
        email,
      },
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect(
      "error",
      userType === "pharmacy" ? "/sign-up/pharmacy" : "/sign-up/user",
      error.message
    );
  } else {
    return encodedRedirect(
      "success",
      userType === "pharmacy" ? "/sign-up/pharmacy" : "/sign-up/user",
      "Thanks for signing up! Please check your email for a verification link."
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const {
    error,
    data: { session },
  } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  // Role-based redirection
  let userRole: string | undefined;
  if (session?.access_token) {
    try {
      const jwt: any = jwtDecode(session.access_token);
      userRole = jwt.user_role;
    } catch (e) {
      // If decoding fails, fallback to generic protected route
      return redirect("/protected");
    }
  }

  if (userRole === "pharmacy") {
    return redirect("/pharmacy/dashboard");
  } else if (userRole === "user") {
    return redirect("/user/dashboard");
  }

  return redirect("/protected");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect("error", "/reset-password", "Passwords do not match");
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect("error", "/reset-password", "Password update failed");
  }

  encodedRedirect("success", "/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};
