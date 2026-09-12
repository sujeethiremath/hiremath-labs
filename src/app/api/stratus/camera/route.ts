import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/app/lib/firebase-admin-init";

export const dynamic = "force-dynamic";

const AUTHORIZED_EMAILS = [
  "sujeetshiremath@gmail.com",
  "hiremath09@gmail.com"
];

const STRATUS_CAMERA_STREAM_URL = process.env.STRATUS_CAMERA_STREAM_URL || "https://camera.sujeethiremath.com/stream.mjpg";

export async function GET(req: NextRequest) {
  try {
    // 1. Extract token from Authorization header or ?token= query parameter
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

    // 2. Verify with Firebase Admin
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
    } catch (err: any) {
      return NextResponse.json({ error: "Unauthorized: Token verification failed", details: err?.message }, { status: 401 });
    }

    // 3. Enforce admin email authorization
    if (!decodedToken.email || !AUTHORIZED_EMAILS.includes(decodedToken.email.toLowerCase())) {
      return NextResponse.json({ error: "Forbidden: User not permitted" }, { status: 403 });
    }

    // 4. Stream MJPEG from Stratus camera service
    const streamRes = await fetch(STRATUS_CAMERA_STREAM_URL, {
      cache: "no-store",
    });

    if (!streamRes.ok || !streamRes.body) {
      return NextResponse.json(
        { error: `Camera stream offline or unreachable (HTTP ${streamRes.status})` },
        { status: 502 }
      );
    }

    return new Response(streamRes.body as any, {
      headers: {
        "Content-Type": "multipart/x-mixed-replace; boundary=FRAME",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error: any) {
    console.error("Camera stream proxy error:", error);
    return NextResponse.json(
      { error: "Camera Stream Error", details: error?.message },
      { status: 500 }
    );
  }
}
