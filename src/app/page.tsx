"use client";

import SummarySection from "./components/SummarySection";
import ProjectsSection from "./components/ProjectsSection";
import ContactSection from "./components/ContactSection";
import LeetcodeSection from "./components/LeetcodeSection";

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
