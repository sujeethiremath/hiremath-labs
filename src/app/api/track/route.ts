import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase-admin-init"; // Import your initialized Firestore instance

const ANALYTICS_COLLECTION = "analytics_events";
const MIXPANEL_PROJECT_TOKEN = process.env.MIXPANEL_PROJECT_TOKEN;

export async function POST(req: Request) {
  let eventData;
  const contentType = req.headers.get("content-type") || "";

  // This block now handles both content types, making the endpoint
  // compatible with both fetch() and navigator.sendBeacon().
  try {
    if (contentType.includes("application/json")) {
      // Handle standard JSON requests from trackEvent
      eventData = await req.json();
    } else {
      // Handle 'text/plain' requests from trackBeaconEvent
      const textData = await req.text();
      eventData = JSON.parse(textData);
    }
  } catch (error) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  // --- The rest of your logic remains the same and will now work correctly ---

  const ipAddress = req.headers.get("x-forwarded-for") || "unknown";
  const timestamp = new Date();
  const { eventName = "default_event", details = {} } = eventData;
  const isMixpanelEnabled = !!MIXPANEL_PROJECT_TOKEN;

  // LOG TO FIRESTORE
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
  }

  // FORWARD TO MIXPANEL
  if (isMixpanelEnabled) {
    const distinctId = details.distinctId || ipAddress;
    const mixpanelPayload = {
      event: eventName,
      properties: {
        token: MIXPANEL_PROJECT_TOKEN,
        distinct_id: distinctId,
        time: timestamp.getTime(),
        ip: ipAddress,
        referrer: details.referrer || req.headers.get("referer"),
        user_agent: req.headers.get("user-agent"),
        ...details,
      },
    };

    try {
      await fetch("https://api.mixpanel.com/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([mixpanelPayload]),
      });
    } catch (error) {
      console.error("Mixpanel API Error:", error);
    }
  }

  return NextResponse.json({
    success: true,
    mixpanel_forwarded: isMixpanelEnabled,
  });
}
