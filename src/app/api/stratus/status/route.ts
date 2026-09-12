import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/app/lib/firebase-admin-init";

export const dynamic = "force-dynamic";

const AUTHORIZED_EMAILS = [
  "sujeetshiremath@gmail.com",
  "hiremath09@gmail.com"
];

const STRATUS_STATUS_URL = process.env.STRATUS_STATUS_URL || "https://stratus.sujeethiremath.com/api/status";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized: Missing or invalid token" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
    } catch (err: any) {
      return NextResponse.json({ error: "Unauthorized: Token verification failed", details: err?.message }, { status: 401 });
    }

    if (!decodedToken.email || !AUTHORIZED_EMAILS.includes(decodedToken.email.toLowerCase())) {
      return NextResponse.json({ error: "Forbidden: User not permitted" }, { status: 403 });
    }

    // Fetch telemetry from Stratus internal/tunnel service
    const response = await fetch(STRATUS_STATUS_URL, {
      cache: "no-store",
      headers: {
        "User-Agent": "HiremathLabs-InternalProxy/1.0",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Stratus telemetry returned HTTP ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Stratus status proxy error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error?.message },
      { status: 500 }
    );
  }
}
