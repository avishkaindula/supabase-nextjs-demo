import nodemailer from "nodemailer";

/** Escape text before putting it into an email's HTML (names, notes, addresses...). */
export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Base URL for links in emails. Taken from configuration or the request itself,
 * never from the request body — otherwise a caller could point the link anywhere.
 */
export function getSiteUrl(request: Request): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin).replace(/\/$/, "");
}

/** Row ids sent by the browser: accept only short, plain identifiers. */
export function isValidId(value: unknown): value is string {
  return typeof value === "string" && /^[A-Za-z0-9-]{1,64}$/.test(value);
}

/**
 * Best-effort check that an email is sent shortly after the action that triggers it.
 *
 * Limitation: in the current schema the browser writes quotes.created_at /
 * accepted_at / rejected_at itself, so a signed-in party could refresh them and
 * re-send the same notification to their own counterparty. For a complete fix,
 * set those timestamps in the database (default/trigger) and record a one-time
 * `notified_at` flag that the route claims atomically before sending.
 */
export function isRecent(timestamp: string | null | undefined, maxAgeMs = 10 * 60 * 1000): boolean {
  if (!timestamp) return false;
  const age = Date.now() - Date.parse(timestamp);
  return Number.isFinite(age) && age >= -60_000 && age <= maxAgeMs;
}

export function createTransport() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}
