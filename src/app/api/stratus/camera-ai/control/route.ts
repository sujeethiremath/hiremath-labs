import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/app/lib/firebase-admin-init";

export const dynamic = "force-dynamic";

const AUTHORIZED_EMAILS = [
  "sujeetshiremath@gmail.com",
  "hiremath09@gmail.com"
];

const STRATUS_CAMERA_AI_URL = process.env.STRATUS_CAMERA_AI_URL || "https://stratus.sujeethiremath.com/api/camera-ai";
const STRATUS_CONTROL_SECRET = process.env.STRATUS_CONTROL_SECRET || "";

export async function POST(req: NextRequest) {
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

    const body = await req.json().catch(() => ({}));
    const action = body.action;

    if (action !== "start" && action !== "stop") {
      return NextResponse.json(
        { error: "Invalid action. Supported actions are 'start' or 'stop'." },
        { status: 400 }
      );
    }

    if (!STRATUS_CONTROL_SECRET) {
      return NextResponse.json(
        { error: "Configuration Error: STRATUS_CONTROL_SECRET not set on server" },
        { status: 500 }
      );
    }

    const response = await fetch(`${STRATUS_CAMERA_AI_URL}/${action}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Stratus-Control-Secret": STRATUS_CONTROL_SECRET,
        "User-Agent": "HiremathLabs-CameraAIProxy/1.0",
      },
      body: JSON.stringify({
        user: decodedToken.email,
      }),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || `Stratus Camera AI service returned HTTP ${response.status}`, details: data },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Stratus Camera AI control proxy error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error?.message },
      { status: 500 }
    );
  }
}
