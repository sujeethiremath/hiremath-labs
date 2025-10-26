// This file acts as a simple, static "database" for your articles.
// By keeping metadata here, you can easily list all articles on the main /articles page.

export interface ArticleMeta {
  slug: string; // Corresponds to the folder name in /app/articles/
  title: string;
  description: string;
  date: string; // Format: "Month Day, Year"
}

export const allArticles: ArticleMeta[] = [
  {
    slug: "building-stable-nextjs-backend",
    title: "Building a Stable Next.js Backend",
    description:
      "An architectural breakdown of the services that power my portfolio, from API routing to analytics.",
    date: "October 19, 2025",
  },
  {
    slug: "static-on-surface-psycho-on-server", // New article slug
    title: "Static on the Surface, Psycho on the Server", // New article title
    description:
      "The story behind my portfolio's architecture: A static look with a dynamic backend.", // New article description
    date: "October 26, 2025", // New article date
  },
  // To add a new article, simply add a new object to this array.
];
