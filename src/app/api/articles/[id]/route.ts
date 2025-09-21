// src/app/api/articles/[id]/route.ts
import { NextResponse } from "next/server";
import { db, admin } from "../../../lib/firebase-admin-init";

// PUT handler
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // <- treat params as Promise
) {
  try {
    const idToken = req.headers.get("authorization")?.split("Bearer ")[1];
    if (!idToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    await admin.auth().verifyIdToken(idToken);

    // ✅ await params before using it
    const { id: articleId } = await params;
    const updateData = await req.json();

    const articleRef = db.collection("articles").doc(articleId);

    const fieldsToUpdate: Record<string, unknown> = {};
    if (updateData.title !== undefined) fieldsToUpdate.title = updateData.title;
    if (updateData.content !== undefined)
      fieldsToUpdate.content = updateData.content;
    if (updateData.seoTitle !== undefined)
      fieldsToUpdate.seoTitle = updateData.seoTitle;
    if (updateData.seoDescription !== undefined)
      fieldsToUpdate.seoDescription = updateData.seoDescription;
    if (updateData.isPublic !== undefined)
      fieldsToUpdate.isPublic = updateData.isPublic;

    fieldsToUpdate.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    await articleRef.update(fieldsToUpdate);

    return NextResponse.json({ success: true, articleId });
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE handler
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // <- Promise here too
) {
  try {
    const idToken = req.headers.get("authorization")?.split("Bearer ")[1];
    if (!idToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    await admin.auth().verifyIdToken(idToken);

    // ✅ await params before using it
    const { id: articleId } = await params;

    const articleRef = db.collection("articles").doc(articleId);
    await articleRef.delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
