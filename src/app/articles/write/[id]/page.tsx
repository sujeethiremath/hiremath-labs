"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, doc, getDoc, Timestamp } from "firebase/firestore";
import { app } from "../../../lib/firebase";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { motion } from "framer-motion";

// Interface for the article data
interface Article {
  id?: string;
  title?: string;
  content?: string;
  seoTitle?: string;
  seoDescription?: string;
  isPublic?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export default function WriteArticlePage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Article>({
    title: "",
    content: "",
    seoTitle: "",
    seoDescription: "",
    isPublic: false,
  });
  const [status, setStatus] = useState("");

  // Handle authentication and data fetching
  useEffect(() => {
    const auth = getAuth(app);
    const db = getFirestore(app);
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (!authUser) {
        // Redirect if no user is authenticated
        router.push("/");
      } else {
        setUser(authUser);
        if (articleId && articleId !== "new") {
          // Fetch article data if an ID exists
          try {
            const docRef = doc(db, "articles", articleId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              setFormData(docSnap.data() as Article);
            } else {
              router.push("/articles/write/new");
            }
          } catch (error) {
            console.error("Error fetching document:", error);
            router.push("/articles/write/new");
          }
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, articleId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const isPublic =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: isPublic }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      setStatus("You must be logged in to save an article.");
      return;
    }

    setStatus("Saving...");
    try {
      const token = await user.getIdToken();
      const method = articleId === "new" ? "POST" : "PUT";
      const url =
        articleId === "new" ? "/api/articles" : `/api/articles/${articleId}`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to save article.");
      }

      const data = await res.json();
      setStatus(`Article saved successfully!`);
      if (articleId === "new") {
        router.push(`/articles/write/${data.articleId}`);
      }
    } catch (error) {
      console.error("Error saving article:", error);
      setStatus("Error saving article. Please try again.");
    }
  };

  const renderedContent = useMemo(() => {
    return formData.content || "";
  }, [formData.content]);

  // Handle loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  // Handle unauthorized state (this is now safe because we've waited for loading to finish)
  if (!user) {
    // This is a safety check, but the redirect in useEffect should handle this
    return null;
  }

  return (
    <main className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            {articleId === "new" ? "Write New Article" : "Edit Article"}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
              {/* Main Form Section */}
              <div className="relative flex-1 bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/10 text-white space-y-6">
                <input
                  type="text"
                  name="title"
                  placeholder="Article Title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full text-2xl font-bold bg-transparent border-b-2 border-gray-600 focus:border-blue-500 outline-none p-2 transition-colors duration-200 placeholder-gray-400"
                  required
                />
                <textarea
                  name="content"
                  placeholder="Write your content here... (Markdown supported)"
                  rows={15}
                  value={formData.content}
                  onChange={handleChange}
                  className="w-full h-80 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 p-4 transition-colors duration-200 resize-none"
                  required
                />
                <div className="space-y-4">
                  <input
                    type="text"
                    name="seoTitle"
                    placeholder="SEO Title (optional)"
                    value={formData.seoTitle}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <input
                    type="text"
                    name="seoDescription"
                    placeholder="SEO Description (optional)"
                    value={formData.seoDescription}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleChange}
                    className="form-checkbox h-5 w-5 bg-gray-700 border-gray-600 rounded-md text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="isPublic" className="text-gray-400">
                    Publish to public page
                  </label>
                </div>
              </div>

              {/* Live Preview Section */}
              <div className="relative flex-1 bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/10 text-white overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                  Preview
                </h2>
                <div className="prose prose-invert max-w-none text-gray-200">
                  <Markdown rehypePlugins={[rehypeRaw]}>
                    {renderedContent}
                  </Markdown>
                </div>
              </div>
            </div>

            {/* Submit Button and Status Message */}
            <div className="flex flex-col items-center space-y-4">
              <button
                type="submit"
                className="w-full max-w-md py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105"
              >
                Save Article
              </button>
              {status && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`text-center font-medium mt-4 p-3 rounded-lg ${
                    status.startsWith("Error")
                      ? "bg-red-900/40 text-red-300 border border-red-800"
                      : "bg-green-900/40 text-green-300 border border-green-800"
                  }`}
                >
                  {status}
                </motion.p>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
