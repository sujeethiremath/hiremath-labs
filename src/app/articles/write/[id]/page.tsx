"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, doc, getDoc, Timestamp } from "firebase/firestore";
import { app } from "../../../lib/firebase";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

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

  const [user, setUser] = useState<User | null>(null); // Correctly typed to accept a User object or null
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
      setUser(authUser);
      setLoading(false);

      if (!authUser) {
        // Redirect if no user is authenticated
        router.push("/");
        return;
      }

      if (articleId && articleId !== "new") {
        // Fetch article data if an ID exists
        try {
          const docRef = doc(db, "articles", articleId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setFormData(docSnap.data() as Article);
          } else {
            //console.error(`No such document with ID: ${articleId}`);
            router.push("/articles/write/new"); // Redirect to new article page if not found
          }
        } catch (error) {
          console.error("Error fetching document:", error);
          router.push("/articles/write/new"); // Redirect on any other error
        }
      }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
          {articleId === "new" ? "Write New Article" : "Edit Article"}
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
        >
          <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
            <div className="flex-1 space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Article Title"
                value={formData.title}
                onChange={handleChange}
                className="w-full text-2xl font-bold border-b-2 border-gray-300 focus:border-blue-500 outline-none p-2 transition-colors duration-200"
                required
              />
              <textarea
                name="content"
                placeholder="Write your content here... (Markdown supported)"
                rows={15}
                value={formData.content}
                onChange={handleChange}
                className="w-full border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none p-4 transition-colors duration-200 resize-none"
                required
              />
              <div className="space-y-2">
                <input
                  type="text"
                  name="seoTitle"
                  placeholder="SEO Title (optional)"
                  value={formData.seoTitle}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none p-3 transition-colors duration-200"
                />
                <input
                  type="text"
                  name="seoDescription"
                  placeholder="SEO Description (optional)"
                  value={formData.seoDescription}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none p-3 transition-colors duration-200"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded-md"
                />
                <label htmlFor="isPublic" className="text-gray-700">
                  Publish to public page
                </label>
              </div>
            </div>
            <div className="flex-1 rounded-lg border-2 border-gray-300 bg-gray-100 p-4 overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Preview</h2>
              <div className="prose max-w-none">
                <Markdown rehypePlugins={[rehypeRaw]}>
                  {renderedContent}
                </Markdown>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            Save Article
          </button>
          {status && <p className="text-center text-gray-600 mt-4">{status}</p>}
        </form>
      </div>
    </main>
  );
}
