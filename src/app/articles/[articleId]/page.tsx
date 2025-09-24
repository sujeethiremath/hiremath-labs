"use client";

import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../../lib/firebase";
import { useRouter, useParams } from "next/navigation";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { motion } from "framer-motion";

interface Article {
  id: string;
  title?: string;
  content?: string;
  createdAt?: { toDate: () => Date };
  seoDescription?: string;
}

export default function ArticlePage() {
  const { articleId } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!articleId || typeof articleId !== "string") return;

    const fetchArticle = async () => {
      setLoading(true);
      const db = getFirestore(app);
      const articleRef = doc(db, "articles", articleId);
      const articleSnap = await getDoc(articleRef);

      if (articleSnap.exists()) {
        const data = articleSnap.data() as Omit<Article, "id">;
        setArticle({ id: articleSnap.id, ...data });
        // Set document title and SEO description
        document.title = data.seoTitle || data.title || "Article";
        const metaDescription = document.querySelector(
          'meta[name="description"]'
        );
        if (metaDescription) {
          metaDescription.setAttribute(
            "content",
            data.seoDescription ||
              data.title ||
              "An article from Sujeet Hiremath's portfolio."
          );
        }
      } else {
        router.push("/articles"); // Redirect to articles page if not found
      }
      setLoading(false);
    };

    fetchArticle();
  }, [articleId, router]);

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
    return null; // or a 404 page
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

          <div className="prose prose-invert max-w-none text-gray-300">
            <Markdown rehypePlugins={[rehypeRaw]}>
              {article.content || ""}
            </Markdown>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
