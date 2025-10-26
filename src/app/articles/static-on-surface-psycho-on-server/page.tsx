import { Metadata } from "next";
// Using absolute paths as they seem more reliable in your setup
import ArticleLayout from "../../components/ArticleLayout";
import { allArticles } from "../../lib/article";
import ArticleAnalyticsTracker from "../../components/ArticleAnalyticsTracker";
import Image from "next/image"; //  correct

export async function generateMetadata(): Promise<Metadata> {
  const article = allArticles.find(
    (p) => p.slug === "static-on-surface-psycho-on-server"
  );
  if (!article) {
    return { title: "Article Not Found" };
  }
  return {
    title: article.title,
    description: article.description,
  };
}

export default function StaticPsychoArticlePage() {
  const article = allArticles.find(
    (p) => p.slug === "static-on-surface-psycho-on-server"
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

  return (
    <ArticleLayout title={article.title} date={article.date}>
      <ArticleAnalyticsTracker slug={article.slug} title={article.title}>
        <p className="text-xl leading-relaxed mb-6 italic">
          Every developer has that one project that starts with, &quot;This will
          be simple,&quot; and ends with five sleepless nights, three
          existential crises, and a website that somehow tracks scroll depth.
          Yeah… this is that story.
        </p>

        <div className="flex flex-col items-center justify-center text-center my-12">
          <Image
            src="/imagewin.png" // Make sure this image is in your /public folder
            alt="Logo - Am I right or am I right?" // Updated alt text for context
            width={200}
            height={200}
            className="mb-4"
          />
          <p className="text-xl font-bold text-center">
            Am I right or am I right?
          </p>
        </div>

        <p className="mb-6">
          The decisions I&apos;ve made so far while building this portfolio
          website, oh boy, it&apos;s been a journey.
        </p>
        <p className="mb-6">
          Let&apos;s start from the top: I&apos;m a backend developer.
          That&apos;s my home turf, my comfort zone, my coffee. Frontend? Not
          really my forte. So when I decided to build my portfolio website, I
          had a little identity crisis, what am I really going to show here?
          Some flashy frontend animations? Nah. I&apos;m not here to make a
          digital Disneyland.
        </p>
        <p className="mb-6">
          So I thought, fine, I&apos;ll make something clean in React, a nice,
          static looking website. Simple, elegant, functional. But then it hit
          me: &quot;Wait… what&apos;s the point of building a static site if it
          just sits there doing nothing?&quot;
        </p>
        <p className="mb-6">
          That&apos;s when the evil genius in me whispered, what if it looks
          static… but secretly runs a serious backend behind the scenes?
        </p>

        <h2 className="text-3xl font-bold text-cyan-300 mt-12 mb-4">
          Choosing the Framework
        </h2>
        <p className="mb-6">
          My first plan was React for the frontend, NestJS for the backend
          classic combo, right? But soon I realized I&apos;d be juggling
          routing, API endpoints, and two separate deployments. That&apos;s like
          ordering a pizza and getting a side of homework.
        </p>
        <p className="mb-6">
          Then I thought, &quot;Okay, maybe Angular, everything in one giant
          framework!&quot; But nah, Angular felt like bringing a tank to a water
          balloon fight. Too heavy, too much ceremony.
        </p>
        <p className="mb-6">
          Finally, the lightbulb moment:{" "}
          <strong className="text-white">Next.js</strong>. React? Check.
          Routing? Automatically handled. Server side rendering? Included. API
          routes? Built in. The routing is file based, simple as dropping a file
          in a folder. Want dynamic routes? Just wrap it in brackets{" "}
          <code>[id].tsx</code>. Done. Beautiful.
        </p>
        <p className="mb-6 font-bold">So yeah, Next.js it is.</p>

        <h2 className="text-3xl font-bold text-cyan-300 mt-12 mb-4">
          The Website
        </h2>
        <p className="mb-6">
          Here it is, my portfolio website, built using Next.js. At first
          glance, it looks like your average static website. Nothing fancy. But
          oh, the twist…
        </p>
        <p className="mb-6">
          Behind that calm, minimal frontend lives a backend that&apos;s
          constantly crunching data, tracking user actions, and talking to the
          database. It looks peaceful, but trust me, it&apos;s doing some
          serious lifting behind the scenes.
        </p>

        <h2 className="text-3xl font-bold text-cyan-300 mt-12 mb-4">
          I know you before you know me! (Mixpanel vs Google Analytics)
        </h2>
        <p className="mb-6">
          I track everything. Yes,{" "}
          <strong className="text-white">everything</strong>. Even how far you
          scroll. Google Analytics? Sure, it&apos;s great, but you can&apos;t do
          what I&apos;m doing with just two lines of code.{" "}
          <strong className="text-white">Mixpanel</strong> lets me see what you
          click, how long you stay, and even which part of the page you rage
          scroll through at 2 AM.
        </p>
        <p className="mb-6 italic text-red-400">
          So you better goddamn read this whole article, I&apos;ll know if you
          didn&apos;t.
        </p>

        <h2 className="text-3xl font-bold text-cyan-300 mt-12 mb-4">
          Database Decisions: Firebase vs Relational Databases
        </h2>
        <p className="mb-6">
          Now, for data storage, I went with{" "}
          <strong className="text-white">Firebase Firestore</strong> a NoSQL,
          document based database. Why? Because all I needed was a Gmail
          account, a cup of coffee, and boom! database ready. It&apos;s free,
          offers 1 GB of storage, and handles 50,000 reads and 20,000 writes per
          day. Perfect for a portfolio site.
        </p>
        <p className="mb-6">
          Hosting a relational database would&apos;ve just made my life
          complicated more servers, more maintenance, more &quot;why is this
          connection string not working again?&quot; headaches. So yeah,
          Firestore was a no-brainer.
        </p>

        <h2 className="text-3xl font-bold text-cyan-300 mt-12 mb-4">
          Cloudflare vs GoDaddy: The Final Battle
        </h2>
        <p className="mb-6">
          Now comes the domain decision, the unsung hero of every website. I
          compared <strong className="text-white">Cloudflare</strong> and{" "}
          <strong className="text-white">GoDaddy</strong>. GoDaddy tempted me
          with that sweet $0.01 first-year price. But the catch? Renewal for
          $20+ every year after that. Classic move.
        </p>
        <p className="mb-6">
          Cloudflare, on the other hand, charged around $10 per year, same price
          every time, no surprises, no hidden nonsense. Reliable, transparent,
          chill. So Cloudflare it is.
        </p>

        <h2 className="text-3xl font-bold text-cyan-300 mt-12 mb-4">
          Hosting on Vercel: My Little DevOps Adventure
        </h2>
        <p className="mb-6">
          Now, what good is all this code without some DevOps magic, right?
          Enter<strong className="text-white">Vercel</strong> the perfect home
          for my Next.js app.
        </p>
        <p className="mb-6">
          Every time I push to my GitHub repo, Vercel automatically builds and
          deploys my site. I&apos;m literally running a CI/CD pipeline without
          lifting a finger. Commit. Push. Deploy. Done.
        </p>
        <p className="mb-6">
          It even feels like my own mini DevOps operation, just way cooler and
          way less stressful. CI/CD? Wihuuu!
        </p>

        <p className="mt-12 mb-6">
          And that&apos;s how I ended up with a site that looks calm on the
          surface but works like a caffeinated backend engineer underneath.
        </p>
        <p className="mb-6 font-bold text-center">
          Static? Sure. Boring? Never.
        </p>
        <p className="mb-6 text-center italic">
          Because every scroll, every click, and every route you take, I already
          know you were coming.
        </p>
        {/* FIX: Removed the section containing improperly formatted code examples within comments */}
      </ArticleAnalyticsTracker>
    </ArticleLayout>
  );
}
