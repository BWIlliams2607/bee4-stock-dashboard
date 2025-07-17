import { NextRequest, NextResponse } from "next/server";
import formData from "form-data";
import * as MailgunNamespace from "mailgun.js";

// Allow this specific any for Mailgun’s namespace-to-constructor cast
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Mailgun: any = MailgunNamespace;

const mgClient = new Mailgun(formData).client({
  username: "api",
  key: process.env.MAILGUN_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
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

    await mgClient.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: process.env.FROM_EMAIL!,
      to: process.env.OFFICE_EMAIL!,
      subject,
      text,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Mailgun error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
