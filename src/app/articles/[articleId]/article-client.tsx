"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../../lib/firebase"; // Adjust relative path as needed
import { useRouter } from "next/navigation";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { motion } from "framer-motion";
import { trackEvent } from "../../utils/analytics"; // Adjust relative path as needed

interface Article {
  // ... (Your existing interface remains the same)
  id: string;
  title?: string;
  content?: string;
  createdAt?: { toDate: () => Date };
  seoDescription?: string;
  isPublic?: boolean; // Added isPublic to check if it's a draft
  seoTitle?: string; // Added seoTitle for cleaner structure
}

export default function ArticlePageClient({
  articleId,
}: {
  articleId: string;
}) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Refs and State for engagement tracking (rest of the tracking logic remains)
  const startTimeRef = useRef(Date.now());
  const maxScrollDepthRef = useRef(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // ... (Your existing tracking and scroll handlers: trackArticleView, handleScroll, trackFinalEngagement) ...

  const trackArticleView = useCallback(
    (
      articleData: Article,
      duration: number = 0,
      eventType: string = "Article Content Viewed"
    ) => {
      trackEvent(eventType, {
        article_id: articleData.id,
        article_title: articleData.title,
        content_length: articleData.content?.length || 0,
        duration_ms: duration,
        source: "Article Page",
      });
    },
    []
  );

  const handleScroll = useCallback(() => {
    if (!contentRef.current) return;

    const contentHeight = contentRef.current.scrollHeight;
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY;

    // Calculate how far the top of the viewport is from the top of the content
    const topOfContentY = contentRef.current.offsetTop;

    // Total scrollable distance within the content area
    const totalContentScrollable = contentHeight - windowHeight;

    if (totalContentScrollable <= 0) return; // No need to scroll

    // Calculate the scroll position relative to the content start
    const relativeScroll = scrollY - topOfContentY;

    // Calculate percentage read (clamped between 0 and 1)
    let percentRead = 0;
    if (relativeScroll > 0) {
      percentRead = Math.min(1, relativeScroll / totalContentScrollable);
    }

    // Convert to 0-100 range and update max depth
    const currentDepth = Math.round(percentRead * 100);
    maxScrollDepthRef.current = Math.max(
      maxScrollDepthRef.current,
      currentDepth
    );
  }, []);

  const trackFinalEngagement = useCallback(() => {
    if (!article || loading) return;

    const totalTimeMs = Date.now() - startTimeRef.current;
    const scrollDepth = maxScrollDepthRef.current;

    // We only log if the user showed some minimal engagement (scrolled past 0%)
    if (scrollDepth > 0) {
      trackEvent("Article Engagement Summary", {
        article_id: article.id,
        article_title: article.title,
        time_spent_seconds: Math.round(totalTimeMs / 1000),
        max_scroll_percent: scrollDepth,
        is_completed: scrollDepth >= 95, // Define completion as 95% scrolled
        is_engaged_reader: scrollDepth >= 75 && totalTimeMs > 10000, // E.g., read 75% and spent > 10 seconds
      });
    }
  }, [article, loading]);

  useEffect(() => {
    // Listener setup and cleanup
    window.addEventListener("scroll", handleScroll);

    const handleBeforeUnload = () => {
      trackFinalEngagement();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      trackFinalEngagement();
    };
  }, [trackFinalEngagement, handleScroll]);

  // Main data fetching logic
  useEffect(() => {
    if (!articleId) return;

    // Reset start time and scroll depth when loading a new article
    startTimeRef.current = Date.now();
    maxScrollDepthRef.current = 0;

    // Track initial page load intent
    trackEvent("Article Page Loaded", {
      article_id: articleId,
      source: "Direct URL/Read More",
    });

    const fetchArticle = async () => {
      setLoading(true);
      const db = getFirestore(app);
      const articleRef = doc(db, "articles", articleId);
      const articleSnap = await getDoc(articleRef);

      const loadDuration = Date.now() - startTimeRef.current;

      if (articleSnap.exists()) {
        const data = articleSnap.data() as Omit<Article, "id">;
        const fetchedArticle: Article = { id: articleSnap.id, ...data };

        // Ensure that articles marked as Draft are only viewable by you (the admin)
        // You would need to add admin check logic here if you want to enforce it.

        setArticle(fetchedArticle);

        // Track successful content load
        trackArticleView(
          fetchedArticle,
          loadDuration,
          "Article Content Loaded Successfully"
        );

        // **IMPORTANT:** Client-side metadata logic is REMOVED here because generateMetadata handles it.
      } else {
        // Track failure to find article
        trackEvent("Article Load Failed", {
          article_id: articleId,
          reason: "Article Not Found",
          load_duration: loadDuration,
        });
        router.push("/articles"); // Redirect to articles page if not found
      }
      setLoading(false);
    };

    fetchArticle();
  }, [articleId, router, trackArticleView]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <p className="text-gray-400 text-lg animate-pulse">
          Loading article...
        </p>
      </div>
    );
  }

  if (!article) {
    // Note: If the article is not found, the generateMetadata function will have already run,
    // setting the title to "Article Not Found".
    return null;
  }

  return (
    <main className="bg-gray-900 text-gray-200 min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
              {article.title}
            </h1>
            <p className="text-sm text-gray-500">
              Published on{" "}
              {article.createdAt?.toDate?.().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div
            className="prose prose-invert max-w-none text-gray-300"
            ref={contentRef} // Attach ref here to measure content height
          >
            <Markdown rehypePlugins={[rehypeRaw]}>
              {article.content || ""}
            </Markdown>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
