import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/app/lib/firebase-admin-init";

export const dynamic = "force-dynamic";

const AUTHORIZED_EMAILS = [
  "sujeetshiremath@gmail.com",
  "hiremath09@gmail.com"
];

const STRATUS_CAMERA_AI_URL = process.env.STRATUS_CAMERA_AI_URL || "https://stratus.sujeethiremath.com/api/camera-ai";
const STRATUS_CONTROL_SECRET = process.env.STRATUS_CONTROL_SECRET || "";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    let token = "";
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split("Bearer ")[1];
    } else {
      token = req.nextUrl.searchParams.get("token") || "";
    }

    if (!token) {
      return NextResponse.json({ error: "Unauthorized: Missing authentication token" }, { status: 401 });
    }

    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
    } catch (err: any) {
      return NextResponse.json({ error: "Unauthorized: Token verification failed", details: err?.message }, { status: 401 });
    }

    if (!decodedToken.email || !AUTHORIZED_EMAILS.includes(decodedToken.email.toLowerCase())) {
      return NextResponse.json({ error: "Forbidden: User not permitted" }, { status: 403 });
    }

    const headers: Record<string, string> = {
      "User-Agent": "HiremathLabs-CameraAIProxy/1.0",
    };
    if (STRATUS_CONTROL_SECRET) {
      headers["X-Stratus-Control-Secret"] = STRATUS_CONTROL_SECRET;
    }

    const response = await fetch(`${STRATUS_CAMERA_AI_URL}/status`, {
      cache: "no-store",
      headers,
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Stratus Camera AI service returned HTTP ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Stratus Camera AI status proxy error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error?.message },
      { status: 500 }
    );
  }
}
