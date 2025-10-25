// app/api/contact/corrected_route.ts
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { db, admin } from "../../lib/firebase-admin-init";

/**
 * Handles POST requests to the contact form API.
 * The core logic has been refactored into separate functions for clarity and maintainability.
 */
export async function POST(req: Request) {
  try {
    const { name, phone, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const ipAddress =
      (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "")
        .split(",")[0]
        .trim() || "unknown";

    // Check rate limit for the IP address. This is the part that requires a composite index.
    const rateLimitExceeded = await checkRateLimit(ipAddress);
    if (rateLimitExceeded) {
      return NextResponse.json(
        { error: "Please wait 24 hours before sending another message." },
        { status: 429 }
      );
    }

    // Save the message to Firestore.
    await saveMessageToFirestore({ name, phone, email, message, ipAddress });

    // Send the contact email using nodemailer.
    await sendContactEmail({ name, phone, email, message });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Checks if an IP address has submitted a form within the last 24 hours.
 * @param ipAddress The IP address to check.
 * @returns A boolean indicating if the rate limit has been exceeded.
 */
async function checkRateLimit(ipAddress: string): Promise<boolean> {
  const messagesRef = db.collection("messages");
  const oneDayAgoTs = admin.firestore.Timestamp.fromDate(
    new Date(Date.now() - 24 * 60 * 60 * 1000)
  );
  // This query requires a composite index on `ipAddress` (ascending) and `timestamp` (ascending).
  // If you see an error about an index, follow the link in the error message to create it.
  const recentQuery = messagesRef
    .where("ipAddress", "==", ipAddress)
    .where("timestamp", ">", oneDayAgoTs)
    .limit(1);

  const recentSnap = await recentQuery.get();
  return !recentSnap.empty;
}

/**
 * Saves a new contact message to the Firestore database.
 * @param data The contact form data.
 */
async function saveMessageToFirestore(data: {
  name: string;
  phone: string | null;
  email: string;
  message: string;
  ipAddress: string;
}) {
  const messagesRef = db.collection("messages");
  await messagesRef.add({
    name: data.name,
    phone: data.phone || null,
    email: data.email,
    message: data.message,
    ipAddress: data.ipAddress,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });
}

/**
 * Sends a contact email using the provided form data.
 * @param data The contact form data.
 */
async function sendContactEmail(data: {
  name: string;
  phone: string | null;
  email: string;
  message: string;
}) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Website Contact" <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_EMAIL,
    replyTo: data.email,
    subject: `New contact from ${data.name}`,
    text: `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || "-"}\n\nMessage:\n${data.message}`,
  });
}
