import { Message } from "@/components/form-message";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pill, ArrowLeft } from "lucide-react";
import UserSignUpForm from "@/components/forms/user-signup-form";

export default async function UserSignUpPage({
  searchParams,
}: {
  searchParams: Promise<Message>;
}) {
  const message = await searchParams;
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="relative flex items-center justify-center mb-8 min-h-[40px]">
          <Link href="/" className="absolute left-0 flex items-center">
            <button
              type="button"
              className="bg-transparent border-none p-0 m-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
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
            <CardTitle className="text-center mb-4">
              Sign Up as Patient
            </CardTitle>
            <CardDescription className="text-center">
              Create your MediScript account as a patient to manage your
              prescriptions digitally.
            </CardDescription>
            <div className="text-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Want to sign up as a pharmacy?{" "}
                <Link
                  href="/sign-up/pharmacy"
                  className="font-semibold text-green-700 hover:underline"
                >
                  Pharmacy Sign Up
                </Link>
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <UserSignUpForm message={message} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
