"use client";

import { useEffect } from "react";
// FIX: Switched to absolute path aliases for robustness.
// This is the standard and most reliable way to import in Next.js.
import { allArticles } from "../lib/article";
import { trackEvent } from "../utils/analytics";

export default function ArticlesListingClient() {
  // 1. Track when the main articles page is viewed
  useEffect(() => {
    trackEvent("Page Viewed", {
      page_path: "/articles",
      page_title: "Articles & Insights",
    });
  }, []);

  // Sort articles to show the newest ones first
  const sortedArticles = allArticles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // 2. Handle clicks on individual article cards
  const handleArticleClick = (slug: string, title: string) => {
    trackEvent("Article Card Clicked", {
      action: "Read More",
      article_id: slug,
      article_title: title,
      source_page: "/articles",
    });
  };

  return (
    <main className="min-h-screen text-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-teal-400 leading-tight mb-4">
            My Articles
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Explore my thoughts and insights on software development,
            technology, and design.
          </p>
        </div>

        <div className="space-y-8">
          {sortedArticles.map((article) => (
            <a
              key={article.slug}
              href={`/articles/${article.slug}`}
              // 3. Add the onClick handler to each link
              onClick={() => handleArticleClick(article.slug, article.title)}
              className="block p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-cyan-500/10 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <h2 className="text-3xl font-bold text-white mb-2">
                {article.title}
              </h2>
              <p className="text-gray-400 text-lg mb-4">
                {article.description}
              </p>
              <time className="text-gray-500 text-sm">{article.date}</time>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
