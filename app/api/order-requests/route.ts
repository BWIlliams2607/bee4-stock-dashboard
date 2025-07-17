import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Dynamically import form-data and mailgun.js
    const formDataModule = await import("form-data");
    const mailgunModule = await import("mailgun.js");
    const FormData = formDataModule.default;
    const Mailgun = mailgunModule.default;

    // Create the Mailgun client
    const mgClient = new Mailgun(FormData).client({
      username: "api",
      key: process.env.MAILGUN_API_KEY!,
    });

    // Parse the incoming JSON body
    const data = await req.json();
    const { timestamp, item, category, quantity, priority, location, notes } = data;

    // Build email content
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

    // Send the message
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
