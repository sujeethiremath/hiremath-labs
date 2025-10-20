// This layout applies to the main /articles listing page and all individual article pages.
// It's a great place for section-wide UI elements like a consistent background.

export default function ArticlesSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This root div wraps every page inside the /articles route.
  // We apply the dark background here to ensure it's consistent across the
  // article list and the individual article pages themselves.
  return <div className="bg-gray-900">{children}</div>;
}
