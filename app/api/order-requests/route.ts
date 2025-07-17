import { NextRequest, NextResponse } from "next/server";
import formData from "form-data";
import Mailgun from "mailgun.js";

const mg = new (Mailgun(formData)).client({
  username: "api",
  key: process.env.MAILGUN_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { timestamp, item, category, quantity, priority, location, notes } = data;

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

    await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: process.env.FROM_EMAIL!,
      to: process.env.OFFICE_EMAIL!,
      subject,
      text,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Mailgun error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
