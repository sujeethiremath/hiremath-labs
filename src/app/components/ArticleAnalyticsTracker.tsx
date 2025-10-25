"use client";

import { useEffect, useRef, useCallback, ReactNode } from "react";
// FIX: Corrected the path to be a relative path from the /components directory
// up to the project root, then down into /utils.
import { trackEvent } from "../utils/analytics";

interface ArticleAnalyticsTrackerProps {
  slug: string;
  title: string;
  children: ReactNode;
}

export default function ArticleAnalyticsTracker({
  slug,
  title,
  children,
}: ArticleAnalyticsTrackerProps) {
  // We no longer need startTimeRef or the manual engagement summary function.

  const contentRef = useRef<HTMLDivElement>(null);

  // The scroll handler is no longer needed for a summary event,
  // but is kept here in case you want to add scroll-based milestone events later.
  const handleScroll = useCallback(() => {
    // Scroll tracking logic would go here if needed.
  }, []);

  useEffect(() => {
    // This is the core of the new strategy.

    // 1. Start a timer for the "Article Viewed" event.
    // Mixpanel's time_event is not directly available client-side,
    // but we can tell our backend to handle it.
    // We send a special property to our analytics utility.
    trackEvent("Article Viewed", {
      article_id: slug,
      article_title: title,
      source: "Direct URL/Static Page",
      // This special instruction tells our analytics utility to START the timer.
      action: "start_timer",
    });

    const handlePageExit = () => {
      // 2. When the user leaves, track the SAME event again.
      // Mixpanel's library will automatically see the started timer and add
      // a "Duration" property with the elapsed time.
      trackEvent("Article Viewed", {
        article_id: slug,
        article_title: title,
        // This special instruction tells our analytics utility to STOP the timer.
        action: "stop_timer",
      });
    };

    window.addEventListener("scroll", handleScroll);
    // Use 'visibilitychange' as a more reliable alternative to 'beforeunload'
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        handlePageExit();
      }
    });

    return () => {
      document.removeEventListener("visibilitychange", handlePageExit);
      // Ensure the event fires if the component unmounts for other reasons
      handlePageExit();
    };
  }, [slug, title, handleScroll]);

  return <div ref={contentRef}>{children}</div>;
}
