// app/api/order-requests/route.ts

import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

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

    const msg = {
      to: process.env.OFFICE_EMAIL!,
      from: process.env.FROM_EMAIL!,
      subject: `📝 New Order Request: ${item}`,
      text: `
Time: ${timestamp}
Item: ${item}
Category: ${category}
Quantity: ${quantity}
Priority: ${priority}
Location: ${location}
Notes: ${notes || "(none)"}
      `,
    };

    await sgMail.send(msg);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("SendGrid error:", err);
    const message =
      err instanceof Error
        ? err.message
        : typeof err === "string"
        ? err
        : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
