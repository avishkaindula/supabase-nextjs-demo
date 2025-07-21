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
import { resetPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<Message>;
}) {
  const message = await searchParams;

  if ("message" in message) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={message} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="relative flex items-center justify-center mb-8 min-h-[40px]">
          <Link href="/" className="absolute left-0 flex items-center">
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
            <CardTitle>Reset your password</CardTitle>
            <CardDescription>
              Please enter your new password below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={resetPasswordAction} className="space-y-4">
              <div>
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="New password"
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  required
                />
              </div>
              <SubmitButton pendingText="Resetting...">
                Reset password
              </SubmitButton>
              <FormMessage message={message} />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 