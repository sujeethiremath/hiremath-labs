"use client";

import { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  onSnapshot,
  where,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { app } from "../lib/firebase";
import { useRouter } from "next/navigation";
import { Timestamp } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

interface Article {
  id: string;
  title?: string;
  content?: string;
  seoDescription?: string;
  isPublic?: boolean;
  createdAt?: Timestamp;
}

const ArticleCard = ({
  article,
  isLoggedIn,
  onDelete,
  onTogglePublic,
  onEdit,
  onReadMore,
}: {
  article: Article;
  isLoggedIn: boolean;
  onDelete: (article: Article) => void;
  onTogglePublic: (article: Article) => void;
  onEdit: (articleId: string) => void;
  onReadMore: (articleId: string) => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="relative bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl overflow-hidden flex flex-col max-w-xl w-full p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
  >
    <div className="flex flex-col flex-grow">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-2xl font-bold text-white">{article.title}</h2>
        {!article.isPublic && (
          <span className="bg-yellow-600 text-yellow-100 text-xs font-semibold px-2 py-1 rounded-full">
            Draft
          </span>
        )}
      </div>
      <p className="text-gray-400 text-base mb-4 flex-grow">
        {article.seoDescription ||
          (article.content ? article.content.substring(0, 150) + "…" : "")}
      </p>
      <div className="flex flex-wrap space-x-2 mt-auto text-sm">
        <span className="text-gray-500">
          {article.createdAt?.toDate?.().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>
    </div>
    <div className="mt-6 flex flex-wrap gap-3">
      <button
        onClick={() => onReadMore(article.id)}
        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium hover:opacity-90 transition-all duration-300"
      >
        Read More
      </button>
      {isLoggedIn && (
        <>
          <button
            onClick={() => onEdit(article.id)}
            className="px-6 py-2 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors duration-200"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(article)}
            className="px-6 py-2 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition-colors duration-200"
          >
            Delete
          </button>
          <button
            onClick={() => onTogglePublic(article)}
            className="px-6 py-2 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors duration-200"
          >
            {article.isPublic ? "Hide" : "Publish"}
          </button>
        </>
      )}
    </div>
  </motion.div>
);

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState("");
  const [confirmArticle, setConfirmArticle] = useState<Article | null>(null);
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const db = getFirestore(app);
    const articlesCollection = collection(db, "articles");
    const q = isLoggedIn
      ? query(articlesCollection)
      : query(articlesCollection, where("isPublic", "==", true));

    const unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
      const articlesData: Article[] = [];
      querySnapshot.forEach((doc) =>
        articlesData.push({
          id: doc.id,
          ...(doc.data() as Omit<Article, "id">),
        })
      );

      articlesData.sort(
        (a, b) =>
          (b.createdAt?.toDate?.().getTime() || 0) -
          (a.createdAt?.toDate?.().getTime() || 0)
      );

      setArticles(articlesData);
      setLoading(false);
    });

    return () => unsubscribeSnapshot();
  }, [isLoggedIn]);

  const handleDelete = (article: Article) => {
    setConfirmAction("delete");
    setConfirmArticle(article);
    setShowConfirmModal(true);
  };

  const handleTogglePublic = (article: Article) => {
    setConfirmAction("togglePublic");
    setConfirmArticle(article);
    setShowConfirmModal(true);
  };

  const handleEdit = (articleId: string) =>
    router.push(`/articles/write/${articleId}`);

  const handleReadMore = (articleId: string) => {
    router.push(`/articles/${articleId}`);
  };

  const handleConfirmAction = async () => {
    if (!confirmArticle) return;

    try {
      const auth = getAuth(app);
      const user = auth.currentUser;
      if (!user) {
        console.error("Not authenticated");
        return;
      }
      const token = await user.getIdToken();

      let res;
      if (confirmAction === "delete") {
        setIsDeleting(true);
        res = await fetch(`/api/articles/${confirmArticle.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      } else if (confirmAction === "togglePublic") {
        setIsToggling(true);
        res = await fetch(`/api/articles/${confirmArticle.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isPublic: !confirmArticle.isPublic }),
        });
      }

      if (!res?.ok) {
        throw new Error(
          `Failed to ${confirmAction === "delete" ? "delete" : "update"} article.`
        );
      }
    } catch (error) {
      console.error(
        `Error ${confirmAction === "delete" ? "deleting" : "updating"} article:`,
        error
      );
    } finally {
      setShowConfirmModal(false);
      setConfirmAction("");
      setConfirmArticle(null);
      setIsDeleting(false);
      setIsToggling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <p className="text-gray-400 text-lg animate-pulse">
          Loading articles...
        </p>
      </div>
    );
  }

  return (
    <main className="bg-gray-900 text-white min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-teal-400 leading-tight mb-4">
            My Articles
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Explore my thoughts and insights on software development,
            technology, and design.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.length === 0 ? (
            <p className="col-span-full text-center text-gray-400 text-lg">
              No articles found. Write your first article!
            </p>
          ) : (
            articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                isLoggedIn={isLoggedIn}
                onDelete={handleDelete}
                onTogglePublic={handleTogglePublic}
                onEdit={handleEdit}
                onReadMore={handleReadMore}
              />
            ))
          )}
        </div>

        <AnimatePresence>
          {showConfirmModal && confirmArticle && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 p-4"
            >
              <div
                className="absolute inset-0 bg-black bg-opacity-75 backdrop-blur-sm"
                onClick={() => setShowConfirmModal(false)}
                aria-hidden="true"
              />
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="relative bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center"
                role="dialog"
                aria-modal="true"
              >
                <h3 className="text-2xl font-bold text-white mb-4">
                  {confirmAction === "delete"
                    ? "Are you sure you want to delete this article?"
                    : `Do you want to ${confirmArticle.isPublic ? "hide" : "publish"} this article?`}
                </h3>
                <p className="text-gray-400 mb-6">
                  This action cannot be undone.
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleConfirmAction}
                    disabled={isDeleting || isToggling}
                    className={`px-6 py-2 rounded-full font-medium transition-colors duration-200 ${
                      confirmAction === "delete"
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    } ${isDeleting || isToggling ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {isDeleting
                      ? "Deleting..."
                      : isToggling
                        ? "Updating..."
                        : "Confirm"}
                  </button>
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="px-6 py-2 bg-gray-700 text-gray-200 rounded-full font-medium hover:bg-gray-600 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
