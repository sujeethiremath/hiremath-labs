import { Metadata } from "next";
import { ArticlesPageClient } from "./articles-client";

// 1. Static Metadata for SEO
// This object provides the specific title and description for search engines.
export const metadata: Metadata = {
  title: "Articles & Insights | Sujeet Hiremath",
  description:
    "A collection of articles, insights, and technical write-ups on enterprise architecture, cloud strategy, DevOps, and modern full-stack development by Sujeet Hiremath.",
  openGraph: {
    title: "Sujeet Hiremath's Technical Articles",
    description:
      "Expert insights on enterprise architecture, cloud strategy, DevOps, and modern full-stack development, and full-stack architecture.",
    url: "https://sujeethiremath.com/articles",
  },
};

// 2. Server Component Entry Point
export default function ArticlesPage() {
  // Renders the client component, giving it the user interface responsibilities.
  return <ArticlesPageClient />;
}
