import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createTransport, escapeHtml, getSiteUrl, isRecent, isValidId } from "@/utils/email";

type QuoteItem = {
  drug?: string;
  quantity?: string | number;
  price?: string | number;
  amount?: string | number;
  notes?: string;
};

/**
 * Tells the pharmacy that the patient accepted or rejected its quotation.
 *
 * The browser only sends the quote id. The signed-in user must own the
 * prescription, the decision must already be saved, and the recipient and every
 * detail come from the database (under Row Level Security).
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    // getUser() verifies the session with Supabase Auth instead of trusting the cookie.
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "You must be signed in" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const quoteId = body?.quoteId;
    if (!isValidId(quoteId)) {
      return NextResponse.json({ error: "A valid quoteId is required" }, { status: 400 });
    }

    const { data: quote } = await supabase.from("quotes").select("*").eq("id", quoteId).maybeSingle();
    if (!quote) {
      return NextResponse.json({ error: "Quotation not found" }, { status: 404 });
    }

    const { data: prescription } = await supabase
      .from("prescriptions")
      .select("*")
      .eq("id", quote.prescription_id)
      .eq("user_id", user.id)
      .maybeSingle();
    if (!prescription) {
      return NextResponse.json({ error: "Quotation not found" }, { status: 404 });
    }

    const status = quote.status;
    const decidedAt = status === "accepted" ? quote.accepted_at : status === "rejected" ? quote.rejected_at : null;
    if (!decidedAt) {
      return NextResponse.json({ error: "Accept or reject the quotation first" }, { status: 409 });
    }
    if (!isRecent(decidedAt)) {
      return NextResponse.json({ error: "This status email has already been sent" }, { status: 409 });
    }

    const [{ data: pharmacy }, { data: patient }] = await Promise.all([
      supabase.from("profiles").select("name, email").eq("id", quote.pharmacy_id).maybeSingle(),
      supabase.from("profiles").select("name").eq("id", user.id).maybeSingle(),
    ]);
    if (!pharmacy?.email) {
      return NextResponse.json({ error: "The pharmacy has no email address" }, { status: 400 });
    }

    const accepted = status === "accepted";
    const statusText = accepted ? "accepted" : "rejected";
    const items: QuoteItem[] = Array.isArray(quote.items) ? (quote.items as QuoteItem[]) : [];
    const dashboardUrl = `${getSiteUrl(request)}/pharmacy/quotations`;

    // Compose email — every value from the database is escaped before it goes into HTML.
    const html = `
      <p>Dear ${escapeHtml(pharmacy.name || "Pharmacy")},</p>
      <p>Your quotation for the following prescription has been <b style="color:${accepted ? "#16a34a" : "#dc2626"}">${statusText}</b> by the patient.</p>
      <h3>Prescription Details</h3>
      <ul>
        <li><b>Patient:</b> ${escapeHtml(patient?.name || "(hidden)")}</li>
        <li><b>Address:</b> ${escapeHtml(prescription.address)}</li>
        <li><b>Phone:</b> ${escapeHtml(prescription.phone)}</li>
        <li><b>Preferred Date:</b> ${escapeHtml(prescription.preferred_date || "-")}</li>
        <li><b>Preferred Delivery:</b> ${escapeHtml(prescription.preferred_time_slot)}</li>
        <li><b>Note:</b> ${escapeHtml(prescription.note || "-")}</li>
      </ul>
      <h3>Quotation Details</h3>
      <ul>
        <li><b>Status:</b> ${statusText}</li>
        <li><b>Delivery Fee:</b> $${escapeHtml(quote.delivery_fee)}</li>
        <li><b>Estimated Delivery:</b> ${escapeHtml(quote.estimated_delivery || "-")}</li>
        <li><b>Notes:</b> ${escapeHtml(quote.notes || "-")}</li>
      </ul>
      <h4>Items</h4>
      <table border="1" cellpadding="6" style="border-collapse:collapse;">
        <thead><tr><th>#</th><th>Medicine</th><th>Quantity</th><th>Price</th><th>Notes</th></tr></thead>
        <tbody>
          ${items
            .map(
              (item, idx) =>
                `<tr><td>${idx + 1}</td><td>${escapeHtml(item.drug)}</td><td>${escapeHtml(item.quantity)}</td><td>$${escapeHtml(item.price || item.amount)}</td><td>${escapeHtml(item.notes)}</td></tr>`
            )
            .join("")}
        </tbody>
      </table>
      <p style="margin-top:16px;">You can view the prescription and quotation in your dashboard: <a href="${escapeHtml(dashboardUrl)}">View Dashboard</a></p>
      <p>Thank you!<br/>MediScript Team</p>
    `;

    await createTransport().sendMail({
      from: process.env.EMAIL_USER,
      to: pharmacy.email,
      subject: `Quotation ${accepted ? "Accepted" : "Rejected"}`,
      html,
    });

    return NextResponse.json({ message: "Status email sent" }, { status: 200 });
  } catch (error) {
    console.error("Quotation status email error:", error);
    return NextResponse.json({ error: "Failed to send status email" }, { status: 500 });
  }
}
