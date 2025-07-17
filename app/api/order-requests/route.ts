// app/api/order-requests/route.ts

import { NextRequest, NextResponse } from "next/server";
// @ts-ignore: no types for nodemailer in this project
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req: NextRequest) {
  try {
    const {
      timestamp,
      item,
      category,
      quantity,
      priority,
      location,
      notes,
    } = await req.json();

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
  } catch (err: unknown) {
    console.error("SMTP error:", err);
    const message =
      err instanceof Error
        ? err.message
        : typeof err === "string"
        ? err
        : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
