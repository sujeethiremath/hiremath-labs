"use server";

import { NextResponse } from "next/server";
import { admin } from "../../lib/firebase-admin-init"; // Imports the configured admin instance

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Authorization token is missing or invalid." },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // Verify the ID token using the Firebase Admin SDK
    // This confirms the token is valid and issued by Firebase.
    const decodedToken = await admin.auth().verifyIdToken(token);
    if (!decodedToken || !decodedToken.uid) {
      return NextResponse.json(
        { message: "Unauthorized: Invalid token." },
        { status: 401 }
      );
    }

    // Now that we've verified the user is authenticated,
    // we can safely process their request.
    const articleData = await request.json();

    // Add the article to a Firestore collection
    const articlesRef = admin.firestore().collection("articles");
    await articlesRef.add({
      ...articleData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json(
      { message: "Article submitted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Article submission failed:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
