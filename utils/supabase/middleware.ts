import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

const PUBLIC_PATHS = [
  "/sign-in",
  "/sign-up/user",
  "/sign-up/pharmacy",
  "/forgot-password",
  "/reset-password",
  "/about",
  "/contact",
  "/help",
  "/how-it-works",
  "/privacy",
  "/terms",
  "/",
  "/auth/callback",
  "/auth/callback?redirect_to=/reset-password",
];

export const updateSession = async (request: NextRequest) => {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const user = await supabase.auth.getUser();

    // Get the session and decode the user role
    const {
      data: { session },
    } = await supabase.auth.getSession();

    let userRole;

    if (session?.access_token) {
      const jwt = jwtDecode(session.access_token) as any;
      userRole = jwt.user_role;
    }

    const path = request.nextUrl.pathname;

    // If not authenticated and not on a public path, redirect to sign-in
    if (user.error && !PUBLIC_PATHS.includes(path)) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // If authenticated and on root, redirect to dashboard
    if (!user.error && path === "/") {
      if (userRole === "pharmacy") {
        return NextResponse.redirect(
          new URL("/pharmacy/dashboard", request.url)
        );
      } else if (userRole === "user") {
        return NextResponse.redirect(new URL("/user/dashboard", request.url));
      }
    }

    // If authenticated and accessing a route not matching their role, redirect to their dashboard
    if (!user.error) {
      if (userRole === "pharmacy" && path.startsWith("/user")) {
        return NextResponse.redirect(
          new URL("/pharmacy/dashboard", request.url)
        );
      } else if (userRole === "user" && path.startsWith("/pharmacy")) {
        return NextResponse.redirect(new URL("/user/dashboard", request.url));
      }
    }

    return response;
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
