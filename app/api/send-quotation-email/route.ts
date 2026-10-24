import { NextResponse } from "next/server";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { createClient } from "@/utils/supabase/server";
import { createTransport, escapeHtml, getSiteUrl, isRecent, isValidId } from "@/utils/email";

type QuoteItem = {
  drug?: string;
  quantity?: string | number;
  price?: string | number;
  notes?: string;
};

/**
 * Emails a new quotation (with a PDF) to the patient.
 *
 * The browser only sends the quote id. The signed-in pharmacy must own the quote,
 * and the recipient and every detail come from the database (under Row Level
 * Security), so this route can't be used to send arbitrary email.
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

    const { data: quote } = await supabase
      .from("quotes")
      .select("*")
      .eq("id", quoteId)
      .eq("pharmacy_id", user.id)
      .maybeSingle();
    if (!quote) {
      return NextResponse.json({ error: "Quotation not found" }, { status: 404 });
    }
    if (quote.status !== "pending" || !isRecent(quote.created_at)) {
      return NextResponse.json({ error: "This quotation email has already been sent" }, { status: 409 });
    }

    const { data: prescription } = await supabase
      .from("prescriptions")
      .select("*")
      .eq("id", quote.prescription_id)
      .maybeSingle();
    if (!prescription) {
      return NextResponse.json({ error: "Prescription not found" }, { status: 404 });
    }

    const { data: patient } = await supabase
      .from("profiles")
      .select("name, email")
      .eq("id", prescription.user_id)
      .maybeSingle();
    if (!patient?.email) {
      return NextResponse.json({ error: "The patient has no email address" }, { status: 400 });
    }

    const siteUrl = getSiteUrl(request);
    const quotationsUrl = `${siteUrl}/user/quotations`;
    const items: QuoteItem[] = Array.isArray(quote.items) ? (quote.items as QuoteItem[]) : [];
    const patientName = patient.name || "User";

    // Generate PDF with improved styling
    const doc = new jsPDF();
    let y = 20;

    // Header
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Quotation", 105, y, { align: "center" });
    y += 12;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Patient: ${patient.name || "Unknown"}`, 14, y);
    y += 8;
    doc.text(`Email: ${patient.email}`, 14, y);
    y += 8;
    // Handle multi-line delivery address
    const addressLines = doc.splitTextToSize(`Delivery Address: ${prescription.address}`, 180);
    doc.text(addressLines, 14, y);
    y += addressLines.length * 8;
    doc.text(`Preferred Delivery Time: ${prescription.preferred_time_slot}`, 14, y);
    y += 8;
    doc.text(`Phone: ${prescription.phone}`, 14, y);
    y += 12;

    // Table for items
    autoTable(doc, {
      startY: y,
      head: [["#", "Medicine", "Quantity", "Price", "Notes"]],
      body: items.map((item, idx) => [
        idx + 1,
        String(item.drug ?? ""),
        String(item.quantity ?? ""),
        `$${item.price ?? ""}`,
        String(item.notes ?? ""),
      ]),
      theme: "striped",
      headStyles: { fillColor: [41, 128, 185] }, // blue
    });
    y = (doc as any).lastAutoTable.finalY + 10;

    // Delivery info
    doc.setFont("helvetica", "bold");
    doc.text(`Delivery Fee: $${quote.delivery_fee}`, 14, y);
    y += 8;
    doc.text(`Estimated Delivery: ${quote.estimated_delivery || "-"}`, 14, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.text(`Notes: ${quote.notes || "-"}`, 14, y);
    y += 12;

    // Link
    doc.setTextColor(41, 128, 185); // blue
    doc.textWithLink("Accept or reject this quotation", 14, y, { url: quotationsUrl });
    doc.setTextColor(0, 0, 0);

    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

    await createTransport().sendMail({
      from: process.env.EMAIL_USER,
      to: patient.email,
      subject: "Your Quotation is Ready",
      text: `Dear ${patientName},\n\nA new quotation has been created for your prescription.\n\nYou can view, accept, or reject your quotation at: ${quotationsUrl}\n\nThank you!\n\n--\nPharmacy Team`,
      html: `<p>Dear ${escapeHtml(patientName)},</p><p>A new quotation has been created for your prescription.</p><p><a href="${escapeHtml(quotationsUrl)}" style="color:#2980b9;text-decoration:underline;">View, accept, or reject your quotation</a></p><p>Thank you!<br/>Pharmacy Team</p>`,
      attachments: [
        {
          filename: "quotation.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    return NextResponse.json({ message: "Email sent" }, { status: 200 });
  } catch (error) {
    console.error("Quotation email error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
