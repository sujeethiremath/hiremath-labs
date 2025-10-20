/**
 * Sends a standard tracking event to our backend API using fetch.
 * This is for events that happen while the user is active on the page.
 * @param eventName The name of the event (e.g., "Page Viewed").
 * @param details An object containing additional data about the event.
 */
export const trackEvent = async (
  eventName: string,
  details: Record<string, any> = {}
) => {
  try {
    const response = await fetch("/api/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ eventName, details }),
    });

    if (!response.ok) {
      console.error("Failed to log event:", eventName, await response.json());
    }
  } catch (error) {
    console.error("Error sending analytics request:", error);
  }
};

/**
 * Sends a tracking event using navigator.sendBeacon.
 * This is specifically for events that need to fire reliably as the user is leaving the page,
 * such as the "Article Engagement Summary".
 * @param eventName The name of the event.
 * @param details An object containing additional data.
 */
export const trackBeaconEvent = (
  eventName: string,
  details: Record<string, any> = {}
) => {
  try {
    const payload = JSON.stringify({ eventName, details });

    // navigator.sendBeacon is the key to making exit events work reliably.
    if (navigator.sendBeacon) {
      // It sends a POST request with a 'text/plain' content type by default.
      navigator.sendBeacon("/api/track", payload);
    } else {
      // Fallback for very old browsers.
      fetch("/api/track", { method: "POST", body: payload, keepalive: true });
    }
  } catch (error) {
    console.error("Error sending beacon analytics request:", error);
  }
};
