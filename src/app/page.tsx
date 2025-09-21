"use client";

import TopNav from "./components/TopNav";
import SummarySection from "./components/SummarySection";
import ProjectsSection from "./components/ProjectsSection";
import ContactSection from "./components/ContactSection";

export default function Portfolio() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      <TopNav />
      <div className="pt-6 flex flex-col items-center w-full">
        <SummarySection />
        <ProjectsSection />
        <ContactSection />
      </div>
    </main>
  );
}
