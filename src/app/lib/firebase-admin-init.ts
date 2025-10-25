import * as admin from "firebase-admin";

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
      // The env var is a file path (or default)
      // ---
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
    }
  } catch (error) {
    console.error("Firebase Admin Initialization Error:", error);
  }
}

const db = admin.firestore();

export { admin, db };
