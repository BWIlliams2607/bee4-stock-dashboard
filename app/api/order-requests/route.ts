import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req: NextRequest) {
  try {
    const { timestamp, item, category, quantity, priority, location, notes } = await req.json();

    const subject = `📝 New Order Request: ${item}`;
    const text = `
Time: ${timestamp}
Item: ${item}
Category: ${category}
Quantity: ${quantity}
Priority: ${priority}
Location: ${location}
Notes: ${notes || "(none)"}
    `;

    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: process.env.OFFICE_EMAIL,
      subject,
      text,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("SMTP error:", err);
    return NextResponse.json({ error: err.message ?? "Unknown error" }, { status: 500 });
  }
}
