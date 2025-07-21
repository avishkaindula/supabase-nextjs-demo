import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

  let userRole: string | undefined;

  if (code) {
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.exchangeCodeForSession(code);

    if (session?.access_token) {
      // Decode the JWT to get the user_role
      const jwt: any = jwtDecode(session.access_token);
      userRole = jwt.user_role;
    }
  }

  // Redirect based on redirectTo if present
  if (redirectTo) {
    return NextResponse.redirect(`${origin}${redirectTo}`);
  }

  // Redirect based on userRole
  if (userRole === "pharmacy") {
    return NextResponse.redirect(`${origin}/pharmacy/dashboard`);
  } else if (userRole === "user") {
    return NextResponse.redirect(`${origin}/user/dashboard`);
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${origin}/sign-in`);
}
