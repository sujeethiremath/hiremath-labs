import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/app/lib/firebase-admin-init";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

const AUTHORIZED_EMAILS = [
  "sujeetshiremath@gmail.com",
  "hiremath09@gmail.com"
];

const STRATUS_TERMINAL_SECRET =
  process.env.STRATUS_TERMINAL_SECRET || "stratus-remote-terminal-secret-2026";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: Missing authentication token" },
        { status: 401 }
      );
    }

    const token = authHeader.split("Bearer ")[1];
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
    } catch (err: any) {
      return NextResponse.json(
        { error: "Unauthorized: Token verification failed", details: err?.message },
        { status: 401 }
      );
    }

    if (!decodedToken.email || !AUTHORIZED_EMAILS.includes(decodedToken.email.toLowerCase())) {
      return NextResponse.json(
        { error: "Forbidden: Account not authorized for remote SSH access" },
        { status: 403 }
      );
    }

    // Generate short-lived (60s) HMAC ticket for WebSocket terminal connection
    const payload = {
      email: decodedToken.email.toLowerCase(),
      sub: decodedToken.uid,
      type: "terminal_access",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60, // 60-second expiry
    };

    const ticket = jwt.sign(payload, STRATUS_TERMINAL_SECRET, { algorithm: "HS256" });

    return NextResponse.json({
      ticket,
      expiresIn: 60,
      email: decodedToken.email.toLowerCase(),
      wsUrl: process.env.STRATUS_WS_TERMINAL_URL || "wss://ssh.sujeethiremath.com/ws",
    });
  } catch (error: any) {
    console.error("Terminal ticket creation error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error?.message },
      { status: 500 }
    );
  }
}
