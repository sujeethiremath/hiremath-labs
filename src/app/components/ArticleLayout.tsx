// File: components/ArticleLayout.tsx
// This is the reusable layout component for individual article pages.

interface ArticleLayoutProps {
  title: string;
  date: string;
  children: React.ReactNode;
}

export default function ArticleLayout({
  title,
  date,
  children,
}: ArticleLayoutProps) {
  return (
    <main className="min-h-screen text-white py-20 px-4 sm:px-6 lg:px-8">
      <article className="max-w-4xl mx-auto">
        <header className="mb-10 border-b border-gray-700 pb-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-teal-400 leading-tight mb-4">
            {title}
          </h1>
          <p className="text-gray-400 text-lg">{date}</p>
        </header>
        {/* The 'prose' classes from Tailwind's typography plugin provide nice styling for your article content */}
        <div className="prose prose-invert prose-lg max-w-none text-gray-300">
          {children}
        </div>
      </article>
    </main>
  );
}
