import { Metadata } from "next";
// This imports the client component you already have, which handles the UI and tracking
import ArticlesListingClient from "./articles-client";

// This is the static metadata that provides the title and description for SEO
export const metadata: Metadata = {
  title: "Articles & Insights",
  description:
    "A collection of articles and write-ups on technology, development, and more.",
};

// This Server Component's only job is to render the Client Component
export default function ArticlesPage() {
  return <ArticlesListingClient />;
}
