"use client";

import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { PhoneInput } from "@/components/ui/phone-input";
import Link from "next/link";

export default function UserSignUpForm({ message }: { message?: Message }) {
  const userType = "user";
  return (
    <form action={signUpAction} className="space-y-4">
      <input type="hidden" name="userType" value={userType} />
      {message && <FormMessage message={message} />}
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" name="name" required />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div>
        <Label htmlFor="phone">Contact Number</Label>
        <PhoneInput id="phone" name="phone" required defaultCountry="LK" international />
      </div>
      <div>
        <Label htmlFor="dob">Date of Birth</Label>
        <Input id="dob" name="dob" type="date" required />
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea id="address" name="address" required />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required />
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
        />
      </div>
      <SubmitButton
        pendingText="Creating Account..."
        className="w-full"
      >
        Create Account
      </SubmitButton>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-blue-600 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
} 