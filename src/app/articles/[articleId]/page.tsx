import { getFirestore, doc, getDoc, Timestamp } from "firebase/firestore";
import { app } from "../../lib/firebase"; // Assuming the path is correct
import { Metadata } from "next";
import ArticlePageClient from "./article-client"; // Import the client component

// Interface for fetching data
interface ArticleData {
  title?: string;
  content?: string;
  seoTitle?: string;
  seoDescription?: string;
  isPublic?: boolean;
}

// --- Dynamic Metadata Generation (Server Component) ---
export async function generateMetadata({
  params,
}: {
  params: { articleId: string };
}): Promise<Metadata> {
  const db = getFirestore(app);
  const articleRef = doc(db, "articles", params.articleId);

  try {
    const articleSnap = await getDoc(articleRef);

    if (!articleSnap.exists()) {
      return {
        title: "Article Not Found",
        description: "The requested article could not be located.",
      };
    }

    const data = articleSnap.data() as ArticleData;

    // Use SEO fields if they exist, otherwise fall back to title/description
    const title = data.seoTitle || data.title || "My Article";
    const description =
      data.seoDescription ||
      data.content?.substring(0, 150) + "..." ||
      "Explore deep insights and technical write-ups by Sujeet Hiremath.";

    return {
      title: title,
      description: description,
      openGraph: {
        title: title,
        description: description,
        type: "article",
        // Optional: Include image URL for social sharing if available
      },
      twitter: {
        card: "summary_large_image",
        title: title,
        description: description,
      },
    };
  } catch (e) {
    console.error("Error fetching article for metadata:", e);
    return {
      title: "Loading Article...",
    };
  }
}

// --- Default Export (Server Component) ---
export default function ArticlePage({
  params,
}: {
  params: { articleId: string };
}) {
  // Pass the ID to the client component for rendering and client-side logic
  return <ArticlePageClient articleId={params.articleId} />;
}
