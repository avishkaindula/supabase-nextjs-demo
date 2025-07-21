import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export async function POST(request: Request) {
  try {
    const { patientName, patientEmail, prescription, items, deliveryFee, estimatedDelivery, notes, origin } = await request.json();

    if (!patientEmail) {
      return NextResponse.json({ error: "No email provided" }, { status: 400 });
    }

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
    doc.text(`Patient: ${patientName || "Unknown"}`, 14, y);
    y += 8;
    doc.text(`Email: ${patientEmail}`, 14, y);
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
      body: items.map((item: any, idx: number) => [
        idx + 1,
        item.drug,
        item.quantity,
        `$${item.price}`,
        item.notes || "",
      ]),
      theme: "striped",
      headStyles: { fillColor: [41, 128, 185] }, // blue
    });
    y = (doc as any).lastAutoTable.finalY + 10;

    // Delivery info
    doc.setFont("helvetica", "bold");
    doc.text(`Delivery Fee: $${deliveryFee}`, 14, y);
    y += 8;
    doc.text(`Estimated Delivery: ${estimatedDelivery}`, 14, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.text(`Notes: ${notes}`, 14, y);
    y += 12;

    // Link
    doc.setTextColor(41, 128, 185); // blue
    doc.textWithLink(
      "Accept or reject this quotation",
      14,
      y,
      { url: `${origin}/user/quotations` }
    );
    doc.setTextColor(0, 0, 0);

    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

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
      to: patientEmail,
      subject: "Your Quotation is Ready",
      text: `Dear ${patientName || "User"},\n\nA new quotation has been created for your prescription.\n\nYou can view, accept, or reject your quotation at: ${origin}/user/quotations\n\nThank you!\n\n--\nPharmacy Team`,
      html: `<p>Dear ${patientName || "User"},</p><p>A new quotation has been created for your prescription.</p><p><a href="${origin}/user/quotations" style="color:#2980b9;text-decoration:underline;">View, accept, or reject your quotation</a></p><p>Thank you!<br/>Pharmacy Team</p>`,
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