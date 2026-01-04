import { GeistSans, GeistMono } from "geist/font";
import "./globals.css";
import ClientWrapper from "./components/ClientWrapper"; // New import
import { Metadata } from "next"; // Import the required Metadata type

// Define static metadata for SEO (Site-wide defaults)
export const metadata: Metadata = {
  title: "Sujeet Hiremath | Software Engineer & Cloud/AI Specialist",
  description:
    "Portfolio of Sujeet Hiremath, architect of mission-critical tolling, automotive, finance and healthcare platforms. 5+ years of extraordinary leadership in enterprise architecture, full-stack development (.NET, Next.js, Azure/AWS), DevOps automation and AI/ML solutions.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
    metadataBase: new URL("https://www.sujeethiremath.com"), // IMPORTANT: Replace with your actual domain
  openGraph: {
    title: "Sujeet Hiremath | Writes Code. Saves Servers. Superman.",
    description:
      "Explore Sujeet Hiremath’s portfolio showcasing mission-critical tolling, automotive, finance and healthcare systems; .NET, Next.js, Azure/AWS and AI/ML expertise.",
    url: "https://www.sujeethiremath.com", // Replace
    siteName: "Hiremath Labs",
    images: [
      {
        url: "/og-image.png", // Ensure you create a 1200x630 image at the root /public folder
        width: 1200,
        height: 630,
        alt: "Sujeet Hiremath - Software Engineer & Cloud/AI Specialist",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sujeet Hiremath | Software Engineer & Cloud/AI Specialist",
    description:
      "Architecting scalable cloud-native, AI-driven and enterprise systems across tolling, automotive, finance and healthcare.",
    images: ["/og-image.png"], // Ensure you create a 1200x630 image at the root /public folder
  },
  authors: [{ name: "Sujeet Hiremath" }],
  keywords: [
    "Sujeet Hiremath",
    "Software Architect",
    "Full Stack Developer",
    "Cloud Architect",
    ".NET C#",
    "Next.js",
    "Azure",
    "AWS",
    "Machine Learning",
    "DevOps Automation",
    "Extraordinary Ability Engineer",
    "Enterprise Architecture",
    "Portfolio",
    "Tolling Systems",
    "Automotive Software",
    "Finance Technology",
    "Healthcare IT",
    "AI Solutions",
    "Microservices",
    "Serverless Architecture",
    "CI/CD Pipelines",
    "Infrastructure as Code",
    "Kubernetes",
    "Docker",
    "Prometheus",
    "Grafana",
    "GitHub Actions",
    "Azure DevOps",
    "Cloud Migrations",
    "High Availability Design",
    "Scalable Systems",
    "Tech Leadership",
    "Software Development",
    "Web Development",
    "Mobile Development",
    "Sujeet Hiremath Portfolio",
    "Hiremath Labs",
    "Sujeet H",
    "Sujeet Hiremath Blog",
    "Sujeet Hiremath",
    "Sujeet Hiremath Resume",
    "Sujeet Hiremath Projects",
    "Sujeet Hiremath Blog",
    "Sujeet Hiremath Contact",
    "Sujeet Hiremath GitHub",
    "Sujeet Hiremath LinkedIn",
    "Sujeet Hiremath Twitter",
    "Sujeet Hiremath LeetCode",
    "Sujeet Hiremath Coding Challenges",
    "Sujeet Hiremath Open Source",
    "Sujeet Hiremath AI/ML",
    "Sujeet Hiremath Data Science",
    "Sujeet Hiremath Big Data",
    "Sujeet Hiremath ETL",
    "Denver Software Engineer",
    "Colorado Developer",
    "E-470 Tolling",
  ],
};

const geistSans = GeistSans;
const geistMono = GeistMono;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white`}
      >
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
