import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pill, ArrowLeft } from "lucide-react";
import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<Message>;
}) {
  const message = await searchParams;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="relative flex items-center justify-center mb-8 min-h-[40px]">
          <Link href="/sign-in" className="absolute left-0 flex items-center">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <Pill className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              MediScript
            </span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              Enter your email to receive a password reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={forgotPasswordAction} className="space-y-4">
              {message && <FormMessage message={message} />}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <SubmitButton pendingText="Sending..." className="w-full">
                Send Reset Link
              </SubmitButton>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Remember your password?{" "}
                  <Link
                    href="/sign-in"
                    className="text-blue-600 hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
