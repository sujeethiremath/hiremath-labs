import * as admin from "firebase-admin";
import fs from "fs";
import path from "path";

if (!admin.apps.length) {
  try {
    const credentialString = process.env.GOOGLE_APPLICATION_CREDENTIALS;

    if (credentialString && credentialString.startsWith("{")) {
      // ---
      // VERCEL / PRODUCTION LOGIC
      // The env var is a JSON string
      // ---
      const serviceAccount = JSON.parse(
        credentialString
      ) as admin.ServiceAccount;

      // CRITICAL FIX: The private_key in the Vercel env var has escaped newlines (\\n).
      // We must replace them with actual newlines (\n) for it to be valid.
      if (serviceAccount.privateKey) {
        serviceAccount.privateKey = serviceAccount.privateKey.replace(
          /\\n/g,
          "\n"
        );
      }

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      // ---
      // LOCAL / DEVELOPMENT LOGIC
      // Check if a local serviceAccount.json exists in the project root
      // ---
      const localKeyPath = path.resolve(/*turbopackIgnore: true*/ process.cwd(), "serviceAccount.json");
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;

      if (fs.existsSync(localKeyPath)) {
        admin.initializeApp({
          credential: admin.credential.cert(localKeyPath),
          projectId: projectId || undefined,
        });
      } else if (credentialString && fs.existsSync(path.resolve(/*turbopackIgnore: true*/ process.cwd(), credentialString))) {
        admin.initializeApp({
          credential: admin.credential.cert(path.resolve(/*turbopackIgnore: true*/ process.cwd(), credentialString)),
          projectId: projectId || undefined,
        });
      } else {
        admin.initializeApp({
          credential: admin.credential.applicationDefault(),
          projectId: projectId || undefined,
        });
      }
    }
  } catch (error) {
    console.error("Firebase Admin Initialization Error:", error);
  }
}

const db = admin.firestore();

export { admin, db };
