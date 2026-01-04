import { Metadata } from "next";

// --- EXTREME SEO METADATA ---
// Optimized based on competitor analysis (Habitica, Habitify, Notion, Strides)
export const metadata: Metadata = {
  title: "Focus Habit Tracker | Minimalist Habitify & Habitica Alternative",
  description: "Experience the cleanest, fastest habit tracker on the web. A powerful alternative to Habitify and Habitica with daily check-offs, streak visuals, and deep progress analytics. No bloat, just productivity.",
  icons: {
    icon: "/favicon.ico", // Explicitly setting the favicon for this route
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png", // Recommended for iOS home screen consistency
  },
  keywords: [
    "habit tracker", 
    "habitify alternative", 
    "habitica alternative",
    "notion habit tracker template",
    "daily routine tracker", 
    "productivity dashboard", 
    "free habit tracker online", 
    "streak counter",
    "best habit tracking app 2026",
    "gamified productivity tool",
    "minimalist routine builder"
  ],
  authors: [{ name: "Sujeet Hiremath" }],
  openGraph: {
    title: "Focus Habit Tracker - The Minimalist Way to Build Streaks",
    description: "Track daily habits and achieve your goals with a data-driven dashboard. Better than a Notion template, faster than an app.",
    url: "https://sujeethiremath.com/habit-tracker",
    siteName: "Hiremath Labs",
    images: [
      {
        url: "/habit-tracker-preview.png",
        width: 1200,
        height: 630,
        alt: "Focus Habit Tracker Dashboard - Weekly and Monthly Views",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Focus Habit Tracker | Better Routine Management",
    description: "The cleanest free alternative to Habitify and Productive. Build streaks that last.",
    images: ["/habit-tracker-preview.png"],
  },
  alternates: {
    canonical: "https://sujeethiremath.com/habit-tracker",
  },
};

export default function HabitTrackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // --- JSON-LD STRUCTURED DATA (Schema.org) ---
  // Expanded to include specific features like "Streaks" and "Analytics"
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Focus Habit Tracker",
    "operatingSystem": "Web, Windows, macOS, Linux, Android, iOS",
    "applicationCategory": "ProductivityApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "A high-performance, minimalist web-based habit tracker. Features include daily check-offs, automated streak counting, weekly/monthly grid views, and consistency analytics.",
    "featureList": [
      "Daily habit check-offs",
      "Automated streak tracking",
      "Weekly and Monthly grid views",
      "Cross-device synchronization",
      "Real-time progress analytics"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "128"
    }
  };

  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </section>
  );
}