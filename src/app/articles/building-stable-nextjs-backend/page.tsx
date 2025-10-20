import { Metadata } from "next";
// FIX: Corrected paths to navigate up three levels to the project root
import ArticleLayout from "../../components/ArticleLayout";
import { allArticles } from "../../lib/article";
import ArticleAnalyticsTracker from "../../components/ArticleAnalyticsTracker";

export async function generateMetadata(): Promise<Metadata> {
  const article = allArticles.find(
    (p) => p.slug === "building-stable-nextjs-backend"
  );
  if (!article) {
    return { title: "Article Not Found" };
  }
  return {
    title: article.title,
    description: article.description,
  };
}

export default function PortfolioBackendArticlePage() {
  const article = allArticles.find(
    (p) => p.slug === "building-stable-nextjs-backend"
  );

  if (!article) {
    return (
      <main className="min-h-screen text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold">404 - Article Not Found</h1>
        </div>
      </main>
    );
  }

  const TableHeader = ({ children }: { children: React.ReactNode }) => (
    <th className="p-4 text-left font-semibold text-cyan-300 border-b border-white/10">
      {children}
    </th>
  );
  const TableCell = ({ children }: { children: React.ReactNode }) => (
    <td className="p-4 border-b border-white/10">{children}</td>
  );

  return (
    <ArticleLayout title={article.title} date={article.date}>
      <ArticleAnalyticsTracker slug={article.slug} title={article.title}>
        <p className="text-xl leading-relaxed mb-6">
          When creating a portfolio application, the goal is not just to have a
          beautiful frontend, but to implement a stable, and feature-rich
          backend to manage content, track user engagement, and handle
          communication. This article breaks down the architectural decisions
          and key services that power my Next.js portfolio, leveraging its
          native API Routes feature alongside Google Firebase and external APIs
          for a truly modern experience.
        </p>

        <div className="my-12">
          <img
            src="/Flowchart.svg"
            alt="Portfolio Backend Architecture Flowchart"
            className="rounded-lg shadow-2xl border border-white/10"
          />
          <p className="text-center text-sm text-gray-400 mt-2">
            High-level architecture of the backend services.
          </p>
        </div>

        <h2 className="text-3xl font-bold text-cyan-300 mt-12 mb-4">
          The Central Hub: Next.js API Router
        </h2>
        <p className="mb-6">
          The foundation of this architecture is the Next.js API Router. Instead
          of deploying a separate server (like Node/Express), the API Router
          acts as the single-entry point for all incoming user requests. This
          approach offers significant advantages:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-8 pl-4">
          <li>
            <strong>Unified Deployment:</strong> I deployed the entire stack,
            frontend and backend, as a single unit.
          </li>
          <li>
            <strong>Zero-Configuration Routing:</strong> Next.js handles the
            mapping of API file paths (e.g., /api/articles) to the downstream
            services, allowing the router to focus solely on inspecting the
            request’s path, method (GET, POST), and then directing that request
            to the appropriate internal service handler.
          </li>
          <li>
            <strong>Seamless Integration:</strong> It sits between the user's
            browser and my core business logic, providing a clean separation of
            concerns.
          </li>
        </ul>

        <h2 className="text-3xl font-bold text-cyan-300 mt-12 mb-4">
          Service 1: The Articles Service (Secure Content Management)
        </h2>
        <p className="mb-6">
          This service is solely responsible for handling my portfolio's core
          written content, requiring robust security measures for creation and
          editing. For content creation (/api/articles/write), security is
          paramount. The flow is strictly controlled:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-8 pl-4">
          <li>A request to write or edit an article hits the API Router.</li>
          <li>
            The Articles Service immediately checks if the user is
            authenticated.
          </li>
          <li>
            If authentication fails, the request is directed through a Firebase
            Authentication gateway to ensure the logged-in user has the correct
            permissions.
          </li>
          <li>
            Only an authenticated user can perform the final Database Write
            operation to store the article.
          </li>
        </ul>

        <h2 className="text-3xl font-bold text-cyan-300 mt-12 mb-4">
          Service 2: LeetCode Data Service (External API Caching)
        </h2>
        <p className="mb-6">
          A key feature is displaying up-to-date competitive programming stats
          from the LeetCode API. To avoid hitting the external API on every page
          load, this dedicated service manages a time-based caching strategy.
          The cache is deemed valid only if its update timestamp is less than 30
          days old. If the data is stale, the system invalidates the cache,
          fetches fresh data, and performs a Cache Update in Firebase.
        </p>

        <h2 className="text-3xl font-bold text-cyan-300 mt-12 mb-4">
          Service 3: Contact Form Service (Anti-Spam Cooldown)
        </h2>
        <p className="mb-6">
          Handling contacts requests efficiently while preventing spam is
          crucial. This service implements a 24-hour request cooldown per user
          to prevent abuse. If a recent message is found, the application
          displays a cooldown message. If not, the system sends an email
          notification and stores a timestamp to begin the next cooldown period.
        </p>

        <h2 className="text-3xl font-bold text-cyan-300 mt-12 mb-4">
          Service 4: Event Tracking Service
        </h2>
        <p className="mb-6">
          To understand how visitors use the portfolio, any meaningful user
          action (e.g., "article_opened," "project_clicked") triggers the
          service. The Event Tracking Service forwards the raw event data to the
          dedicated Analytics Platform (Mixpanel), allowing for behavioral
          analysis and funnel tracking.
        </p>

        <h2 className="text-3xl font-bold text-cyan-300 mt-12 mb-4">
          Key Technology Decisions: Why I Chose My Stack
        </h2>
        <p className="mb-6">
          My technology choices were driven by the need for quick development,
          high stability, and seamless integration within the Next.js and
          serverless ecosystem.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse bg-white/5 rounded-lg">
            <thead>
              <tr>
                <TableHeader>Feature</TableHeader>
                <TableHeader>Firebase (Firestore)</TableHeader>
                <TableHeader>Other Databases</TableHeader>
                <TableHeader>My Rationale</TableHeader>
              </tr>
            </thead>
            <tbody>
              <tr>
                <TableCell>Setup & Maintenance</TableCell>
                <TableCell>
                  Serverless, fully managed, zero setup time.
                </TableCell>
                <TableCell>
                  Requires server provisioning, connection management, and
                  scaling efforts.
                </TableCell>
                <TableCell>
                  <strong>Rapid Prototyping:</strong> I needed a zero-config
                  solution that scales automatically.
                </TableCell>
              </tr>
              <tr>
                <TableCell>Real-time Capabilities</TableCell>
                <TableCell>
                  Built-in real-time listeners for instant content updates.
                </TableCell>
                <TableCell>
                  Requires setting up WebSockets or polling mechanisms.
                </TableCell>
                <TableCell>
                  <strong>Developer Experience:</strong> Simplifies complex
                  real-time features with minimal code.
                </TableCell>
              </tr>
              <tr>
                <TableCell>Integration</TableCell>
                <TableCell>
                  Deeply integrated with Firebase Authentication and Hosting.
                </TableCell>
                <TableCell>
                  Requires manual setup of separate auth and hosting services.
                </TableCell>
                <TableCell>
                  <strong>Ecosystem:</strong> Seamless, native integration with
                  the rest of my chosen stack.
                </TableCell>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="overflow-x-auto mt-12">
          <table className="w-full text-left border-collapse bg-white/5 rounded-lg">
            <thead>
              <tr>
                <TableHeader>Feature</TableHeader>
                <TableHeader>Mixpanel</TableHeader>
                <TableHeader>Google Analytics (GA4)</TableHeader>
                <TableHeader>My Rationale</TableHeader>
              </tr>
            </thead>
            <tbody>
              <tr>
                <TableCell>Focus</TableCell>
                <TableCell>
                  Primarily focused on user behavior, events, and funnels
                  (Action-centric).
                </TableCell>
                <TableCell>
                  Primarily focused on traffic, page views, and sessions
                  (Volume-centric).
                </TableCell>
                <TableCell>
                  <strong>Behavioral Insight:</strong> Mixpanel's event-driven
                  model is better for optimizing user journeys.
                </TableCell>
              </tr>
              <tr>
                <TableCell>Data Model</TableCell>
                <TableCell>
                  Event-based from the ground up, making custom event properties
                  easier to manage.
                </TableCell>
                <TableCell>
                  Requires more effort to define and track complex custom
                  events.
                </TableCell>
                <TableCell>
                  <strong>Granularity:</strong> I can track micro-interactions
                  with precision.
                </TableCell>
              </tr>
              <tr>
                <TableCell>Simplicity in Reporting</TableCell>
                <TableCell>
                  Funnels and Cohorts are native and highly visual.
                </TableCell>
                <TableCell>
                  Requires more complex configurations for deep behavioral
                  analysis.
                </TableCell>
                <TableCell>
                  <strong>Clarity:</strong> It offers immediate, clear visual
                  reports on conversion and retention.
                </TableCell>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="overflow-x-auto mt-12">
          <table className="w-full text-left border-collapse bg-white/5 rounded-lg">
            <thead>
              <tr>
                <TableHeader>Feature</TableHeader>
                <TableHeader>Firebase Authentication</TableHeader>
                <TableHeader>Custom JWT Authentication</TableHeader>
                <TableHeader>My Rationale</TableHeader>
              </tr>
            </thead>
            <tbody>
              <tr>
                <TableCell>Speed to Implement</TableCell>
                <TableCell>Ready-to-use SDKs and UI components.</TableCell>
                <TableCell>
                  Requires building user databases, hashing passwords,
                  generating tokens, etc.
                </TableCell>
                <TableCell>
                  <strong>Time Savings:</strong> Reduces development time from
                  weeks to hours.
                </TableCell>
              </tr>
              <tr>
                <TableCell>Security & Maintenance</TableCell>
                <TableCell>
                  Managed by Google; handles encryption, password recovery, and
                  vulnerability patching.
                </TableCell>
                <TableCell>
                  Requires continuous vigilance to maintain security and rotate
                  keys.
                </TableCell>
                <TableCell>
                  <strong>Security Assurance:</strong> I trust Google's security
                  engineers over building my own system.
                </TableCell>
              </tr>
              <tr>
                <TableCell>Provider Support</TableCell>
                <TableCell>
                  Supports Google, GitHub, Email/Password, etc., out-of-the-box.
                </TableCell>
                <TableCell>
                  Each new provider (OAuth) requires setting up dedicated
                  endpoints.
                </TableCell>
                <TableCell>
                  <strong>Flexibility:</strong> Easy to add other login options
                  in the future.
                </TableCell>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mb-6">
          By structuring the backend around Next.js API Routes and delegating
          specialized tasks to four distinct services—content security, external
          API caching, anti-spam logic, and analytics, I achieved a highly
          maintainable and scalable portfolio. This architecture provides a
          robust foundation that is ready to handle growth and future feature
          development. I'm excited to hear your thoughts on this updated
          structure! It now better aligns with the independent roles of your
          LeetCode and Articles components.
        </p>
      </ArticleAnalyticsTracker>
    </ArticleLayout>
  );
}
