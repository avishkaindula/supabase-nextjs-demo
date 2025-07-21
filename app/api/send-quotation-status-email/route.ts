import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const {
      pharmacyEmail,
      pharmacyName,
      patientName,
      prescription,
      quote,
      status,
      origin,
    } = await request.json();

    if (!pharmacyEmail) {
      return NextResponse.json({ error: "No pharmacy email provided" }, { status: 400 });
    }

    // Compose email
    const subject = `Quotation ${status === "accepted" ? "Accepted" : "Rejected"}`;
    const statusText = status === "accepted" ? "accepted" : "rejected";
    const html = `
      <p>Dear ${pharmacyName || "Pharmacy"},</p>
      <p>Your quotation for the following prescription has been <b style="color:${status === "accepted" ? "#16a34a" : "#dc2626"}">${statusText}</b> by the patient.</p>
      <h3>Prescription Details</h3>
      <ul>
        <li><b>Patient:</b> ${patientName || "(hidden)"}</li>
        <li><b>Address:</b> ${prescription.address}</li>
        <li><b>Phone:</b> ${prescription.phone}</li>
        <li><b>Preferred Date:</b> ${prescription.preferred_date || "-"}</li>
        <li><b>Preferred Delivery:</b> ${prescription.preferred_time_slot}</li>
        <li><b>Note:</b> ${prescription.note || "-"}</li>
      </ul>
      <h3>Quotation Details</h3>
      <ul>
        <li><b>Status:</b> ${statusText}</li>
        <li><b>Delivery Fee:</b> $${quote.delivery_fee}</li>
        <li><b>Estimated Delivery:</b> ${quote.estimated_delivery || "-"}</li>
        <li><b>Notes:</b> ${quote.notes || "-"}</li>
      </ul>
      <h4>Items</h4>
      <table border="1" cellpadding="6" style="border-collapse:collapse;">
        <thead><tr><th>#</th><th>Medicine</th><th>Quantity</th><th>Price</th><th>Notes</th></tr></thead>
        <tbody>
          ${(Array.isArray(quote.items)
            ? quote.items
                .map(
                  (item: any, idx: number) =>
                    `<tr><td>${idx + 1}</td><td>${item.drug}</td><td>${item.quantity}</td><td>$${item.price || item.amount}</td><td>${item.notes || ""}</td></tr>`
                )
                .join("")
            : "")}
        </tbody>
      </table>
      <p style="margin-top:16px;">You can view the prescription and quotation in your dashboard: <a href="${origin}/pharmacy/quotations">View Dashboard</a></p>
      <p>Thank you!<br/>MediScript Team</p>
    `;

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: pharmacyEmail,
      subject,
      html,
    });

    return NextResponse.json({ message: "Status email sent" }, { status: 200 });
  } catch (error) {
    console.error("Quotation status email error:", error);
    return NextResponse.json({ error: "Failed to send status email" }, { status: 500 });
  }
} 