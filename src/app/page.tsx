import SummarySection from "./components/SummarySection";
import ProjectsSection from "./components/ProjectsSection";
import ContactSection from "./components/ContactSection";
import LeetcodeSection from "./components/LeetcodeSection";
import { Metadata } from "next"; // Import the required Metadata type

// Specific metadata for the homepage (overrides layout.tsx defaults)
export const metadata: Metadata = {
  title: "Sujeet Hiremath | Software Architect & Cloud/AI Specialist",
  description:
    "Portfolio of Sujeet Hiremath, architect of mission-critical tolling, automotive, finance and healthcare platforms. 5+ years of extraordinary leadership in enterprise architecture, full-stack development (.NET, Next.js, Azure/AWS), DevOps automation and AI/ML solutions.",
};

export default function Portfolio() {
  return (
    <main className="min-h-screen">
      {/* Added pt-20 to push content down, clearing space for the fixed navbar */}
      <div className="pt-20 flex flex-col items-center w-full">
        <SummarySection />
        <ProjectsSection />
        <LeetcodeSection />
        <ContactSection />
      </div>
    </main>
  );
}
