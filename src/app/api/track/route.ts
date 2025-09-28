import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase-admin-init"; // Import your initialized Firestore instance

const ANALYTICS_COLLECTION = "analytics_events";
// Mixpanel only requires a Project Token
const MIXPANEL_PROJECT_TOKEN = process.env.MIXPANEL_PROJECT_TOKEN;

/**
 * Handles POST requests to log custom user events.
 * * It performs three main actions:
 * 1. Logs the event data (including IP) to Firestore for permanent storage.
 * 2. Prepares to forward the event to Mixpanel's HTTP API.
 * 3. Returns a success response to the client.
 */
export async function POST(req: Request) {
  let eventData;
  try {
    eventData = await req.json();
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // 1. Extract and clean data
  const ipAddress = req.headers.get("x-forwarded-for") || "unknown";
  const timestamp = new Date();
  const { eventName = "default_event", details = {} } = eventData;

  // Check for required Mixpanel environment variables
  const isMixpanelEnabled = !!MIXPANEL_PROJECT_TOKEN;

  // --- 2. LOG TO FIRESTORE (Database for custom analysis/auditing) ---
  try {
    await db.collection(ANALYTICS_COLLECTION).add({
      ipAddress,
      timestamp,
      eventName,
      details,
      userAgent: req.headers.get("user-agent"),
    });
  } catch (error) {
    console.error("Firestore Error:", error);
    // Important: We don't return an error here, as successful logging to Mixpanel is the priority.
  }

  // --- 3. FORWARD TO MIXPANEL HTTP API ---
  if (isMixpanelEnabled) {
    // Mixpanel uses 'distinct_id' instead of 'client_id'
    // We use the IP address as a distinct identifier for anonymous users.
    const distinctId = details.distinctId || ipAddress;

    const mixpanelPayload = {
      event: eventName,
      properties: {
        // REQUIRED: Mixpanel token
        token: MIXPANEL_PROJECT_TOKEN,
        // REQUIRED: User/Client identifier
        distinct_id: distinctId,
        // Time of the event (Mixpanel prefers milliseconds)
        time: timestamp.getTime(),
        // Source details
        ip: ipAddress,
        referrer: details.referrer || req.headers.get("referer"),
        user_agent: req.headers.get("user-agent"),
        // Custom event properties
        ...details,
      },
    };

    // Mixpanel's ingestion endpoint
    const mixpanelUrl = "https://api.mixpanel.com/track";

    try {
      // **NOTE:** In a real application, you would replace this with an actual fetch.
      // Since we cannot execute third-party fetch calls in this environment,
      // we will simulate the attempt and log the payload.
      //
      const mixpanelResponse = await fetch(mixpanelUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([mixpanelPayload]), // Mixpanel API expects an array of events
      });

      //console.log("Mixpanel Payload prepared and simulated:", mixpanelPayload);
    } catch (error) {
      //console.error("Mixpanel API Error:", error);
    }
  }

  return NextResponse.json({
    success: true,
    mixpanel_forwarded: isMixpanelEnabled,
  });
}
