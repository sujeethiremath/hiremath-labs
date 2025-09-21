"use client";
import { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  onSnapshot,
  where,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../lib/firebase";
import { useRouter } from "next/navigation";
import { Timestamp } from "firebase/firestore";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface Article {
  id: string;
  title?: string;
  content?: string;
  seoTitle?: string;
  seoDescription?: string;
  isPublic?: boolean;
  createdAt?: Timestamp; // Firestore Timestamp
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState("");
  const [confirmArticle, setConfirmArticle] = useState<Article | null>(null);
  const router = useRouter();

  // Listen to authentication state
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribeAuth();
  }, []);

  // Listen to Firestore articles based on login state
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

  const handleReadMore = (article: Article) => setSelectedArticle(article);

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
        res = await fetch(`/api/articles/${confirmArticle.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      } else if (confirmAction === "togglePublic") {
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

      console.log(
        `Article ${confirmAction === "delete" ? "deleted" : "updated"} successfully.`
      );
    } catch (error) {
      console.error(
        `Error ${confirmAction === "delete" ? "deleting" : "updating"} article:`,
        error
      );
    } finally {
      setShowConfirmModal(false);
      setConfirmAction("");
      setConfirmArticle(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading articles...</p>
      </div>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            My Articles
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore my thoughts and insights on software development,
            technology, and design.
          </p>
        </div>

        <div className="flex flex-col items-center space-y-10">
          {articles.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              No articles found. Write your first article!
            </p>
          ) : (
            articles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col max-w-xl w-full"
              >
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {article.title}
                    </h2>
                    {!article.isPublic && (
                      <span className="bg-yellow-200 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-base mb-4 flex-grow">
                    {article.seoDescription ||
                      (article.content
                        ? article.content.substring(0, 150) + "…"
                        : "")}
                  </p>
                  <div className="flex space-x-4 mt-auto">
                    <button
                      onClick={() => handleReadMore(article)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors duration-200"
                    >
                      Read More
                    </button>
                    {isLoggedIn && (
                      <>
                        <button
                          onClick={() => handleEdit(article.id)}
                          className="px-6 py-2 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(article)}
                          className="px-6 py-2 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition-colors duration-200"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handleTogglePublic(article)}
                          className="px-6 py-2 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors duration-200"
                        >
                          {article.isPublic ? "Hide" : "Publish"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 p-4">
            <div
              className="absolute inset-0 bg-black bg-opacity-75 backdrop-blur-sm"
              onClick={() => setSelectedArticle(null)}
              aria-hidden="true"
            />
            <div
              className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 animate-pop-in"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="prose max-w-none text-gray-800">
                <h2 id="modal-title" className="text-4xl font-extrabold mb-4">
                  {selectedArticle.title}
                </h2>
                <Markdown rehypePlugins={[rehypeRaw]}>
                  {selectedArticle.content || ""}
                </Markdown>
              </div>
            </div>
          </div>
        )}

        {showConfirmModal && confirmArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 p-4">
            <div
              className="absolute inset-0 bg-black bg-opacity-75 backdrop-blur-sm"
              onClick={() => setShowConfirmModal(false)}
              aria-hidden="true"
            />
            <div
              className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center animate-pop-in"
              role="dialog"
              aria-modal="true"
              aria-labelledby="confirm-modal-title"
            >
              <h3
                id="confirm-modal-title"
                className="text-2xl font-bold text-gray-900 mb-4"
              >
                {confirmAction === "delete"
                  ? "Are you sure you want to delete this article?"
                  : `Do you want to ${confirmArticle.isPublic ? "hide" : "publish"} this article?`}
              </h3>
              <p className="text-gray-600 mb-6">
                This action cannot be undone.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleConfirmAction}
                  className={`px-6 py-2 rounded-full font-medium transition-colors duration-200 ${
                    confirmAction === "delete"
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {confirmAction === "delete" ? "Confirm Delete" : "Confirm"}
                </button>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-full font-medium hover:bg-gray-300 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
