"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { motion } from "framer-motion";

export default function WriteArticlePage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  // Check for login status on component mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
        router.push("/");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    seoTitle: "",
    seoDescription: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleClose = () => {
    router.push("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Get the JWT token from the client-side session
    const token = await auth.currentUser?.getIdToken();

    if (!token) {
      setMessage("You must be logged in to submit an article.");
      return;
    }

    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("Article submitted successfully!");
        setFormData({
          title: "",
          content: "",
          seoTitle: "",
          seoDescription: "",
        });
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      setMessage("An unexpected error occurred. Please try again.");
      console.error("Failed to submit article:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400 text-lg">Loading...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Will be redirected by useEffect
  }

  return (
    <div className="container mx-auto p-4 pt-20 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Write an Article
        </h1>
        <div className="relative bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 md:p-10 shadow-2xl border border-white/10 text-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Article Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Article Content
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={10}
                required
                className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors resize-y"
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="seoTitle"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                SEO Title (Optional)
              </label>
              <input
                type="text"
                id="seoTitle"
                name="seoTitle"
                value={formData.seoTitle}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label
                htmlFor="seoDescription"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                SEO Description (Optional)
              </label>
              <textarea
                id="seoDescription"
                name="seoDescription"
                value={formData.seoDescription}
                onChange={handleChange}
                rows={3}
                className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors resize-y"
              ></textarea>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleClose}
                className="py-3 px-6 bg-gray-700/50 border border-gray-600 text-gray-200 rounded-full font-semibold hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105"
              >
                Submit Article
              </button>
            </div>
          </form>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`mt-6 p-4 rounded-lg text-center font-medium ${
                message.startsWith("Error")
                  ? "bg-red-900/40 text-red-300 border border-red-800"
                  : "bg-green-900/40 text-green-300 border border-green-800"
              }`}
            >
              {message}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
