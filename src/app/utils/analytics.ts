/**
 * Sends a custom event payload to the server-side tracking API.
 * @param eventName The name of the event (e.g., "Resume Downloaded", "Nav Click").
 * @param details Any extra properties you want to log (e.g., { page: '/about', target: 'resume_button' }).
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
      body: JSON.stringify({
        eventName,
        details,
        // Optional: Include distinctId if the user is logged in
        // distinctId: userId || undefined,
      }),
    });

    if (!response.ok) {
      console.error("Failed to log event:", eventName, await response.json());
    } else {
      console.log("Event logged successfully:", eventName);
    }
  } catch (error) {
    console.error("Error sending analytics request:", error);
  }
};
