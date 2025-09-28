import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../../lib/firebase";
import { Metadata } from "next";
import ArticlePageClient from "./article-client";

// Define the synchronous shape of the parameters (the inner structure)
interface ArticlePageParams {
  articleId: string;
}

// Define the comprehensive props structure for Next.js 15 Server Components
// CRUCIALLY, params is now wrapped in a Promise<T>
interface ArticlePageProps {
  params: Promise<ArticlePageParams>;
  // If searchParams were used, they would also be Promise-wrapped
  // searchParams?: Promise<any>;
}

interface ArticleData {
  title?: string;
  content?: string;
  seoTitle?: string;
  seoDescription?: string;
  isPublic?: boolean;
}

// Corrected generateMetadata: Must be 'async' and use the Promise-wrapped type
export async function generateMetadata(
  // Use the new Promise-wrapped type
  { params }: ArticlePageProps
): Promise<Metadata> {
  // CORRECTED: Must await the params object before destructuring
  const { articleId } = await params;

  const db = getFirestore(app);
  const articleRef = doc(db, "articles", articleId);

  try {
    const articleSnap = await getDoc(articleRef);

    if (!articleSnap.exists()) {
      return {
        title: "Article Not Found",
        description: "The requested article could not be located.",
      };
    }

    const data = articleSnap.data() as ArticleData;
    const title = data.seoTitle || data.title || "My Article";
    const description =
      data.seoDescription ||
      data.content?.substring(0, 150) + "..." ||
      "Explore deep insights and technical write-ups.";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  } catch (e) {
    console.error("Error fetching article for metadata:", e);
    return { title: "Loading Article..." };
  }
}

// Corrected Page Component: Must be 'async' and use the Promise-wrapped type
export default async function ArticlePage({ params }: ArticlePageProps) {
  // CORRECTED: Resolve the Promise to obtain the synchronous parameter object
  const { articleId } = await params;

  // Pass the now synchronous string ID to the Client Component
  // Client Components are designed to receive synchronous, serializable props.
  return <ArticlePageClient articleId={articleId} />;
}
