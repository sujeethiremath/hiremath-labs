"use client";

import { motion } from "framer-motion";
import { useState } from "react";

// A separate Client Component to handle the interactive parts
function SummaryCard() {
  const [selectedStack, setSelectedStack] = useState<
    "frontend" | "backend" | "devops" | null
  >(null);

  const cardBaseClasses =
    "p-4 md:p-6 rounded-xl transition-all duration-300 border-2";
  const cardHoverClasses = "hover:scale-105";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4 md:p-8 shadow-2xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
        {/* Frontend Layer */}
        <div
          className={`${cardBaseClasses} ${cardHoverClasses} ${
            selectedStack === "frontend"
              ? "bg-blue-900/40 border-blue-600/50"
              : "bg-transparent border-transparent"
          }`}
          onMouseEnter={() => setSelectedStack("frontend")}
          onMouseLeave={() => setSelectedStack(null)}
        >
          <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-blue-400">
            Frontend Development
          </h3>
          <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              React, Next.js & Angular Applications
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              End-to-End ADA/Accessibility Compliance
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              E2E Test Automation with Cypress
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              User Behavior Analytics (Mixpanel Integration)
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              Scalable, Responsive, and Performant UIs
            </li>
          </ul>
        </div>

        {/* Backend Layer */}
        <div
          className={`${cardBaseClasses} ${cardHoverClasses} ${
            selectedStack === "backend"
              ? "bg-purple-900/40 border-purple-600/50"
              : "bg-transparent border-transparent"
          }`}
          onMouseEnter={() => setSelectedStack("backend")}
          onMouseLeave={() => setSelectedStack(null)}
        >
          <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-purple-400">
            Backend Development
          </h3>
          <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
              Enterprise APIs in C# .NET & Node.js, High-Throughput Services
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
              Optimized Data Pipelines
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
              Migration for Petabyte Scalability
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
              Production ML/AI Classification Systems
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
              Apache Spark and Complex ETL/ELT Pipelining
            </li>
          </ul>
        </div>
        {/* DevOps Layer */}
        <div
          className={`${cardBaseClasses} ${cardHoverClasses} ${
            selectedStack === "devops"
              ? "bg-teal-900/40 border-teal-600/50"
              : "bg-transparent border-transparent"
          }`}
          onMouseEnter={() => setSelectedStack("devops")}
          onMouseLeave={() => setSelectedStack(null)}
        >
          <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-teal-400">
            DevOps & Cloud
          </h3>
          <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
              Container Orchestration
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
              Full Stack CI/CD (Azure DevOps, GitHub Actions)
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
              Real-time Monitoring (Prometheus, Kibana)
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
              Automated Infrastructure Migration
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
              Focus on SLAs and High-Availability Design
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

// The main Server Component
export default function SummarySection() {
  return (
    <section
      id="summary"
      className="min-h-screen relative overflow-hidden py-24 md:py-0 bg-gray-900 text-white"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 pt-8 md:pt-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12 max-w-4xl"
        >
          <div className="space-y-3 w-full md:space-y-4 mb-6 md:mb-8">
            <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-teal-400">
              Sujeet Sharad Hiremath
            </h1>
            <h3 className="text-xl md:text-3xl font-bold text-gray-200">
              Engineer. Architect. Mentor. Innovator. Building the systems,
              cultures, and ideas that power the next generation of technology.
            </h3>
            <p className="text-base md:text-lg text-gray-400 max-w-3xl mx-auto">
              I have architected and led the development of enterprise-scale
              platforms serving thousands of users nationwide. My work spans
              large-scale cloud transformations, high-performance system
              architectures, and DevOps innovations that cut costs, increase
              reliability, and accelerate delivery across industries.
            </p>
            <p className="text-sm md:text-base text-gray-500 max-w-3xl mx-auto">
              Alongside my engineering work, I publish insights on software
              design, DevOps strategies, and cloud-native architectures, helping
              engineering teams worldwide build smarter, more resilient
              applications.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6 md:mb-8">
            <span className="px-3 md:px-4 py-1.5 md:py-2 bg-gray-800 rounded-full text-blue-400 text-xs md:text-sm font-semibold">
              Cloud-Native Architectures
            </span>
            <span className="px-3 md:px-4 py-1.5 md:py-2 bg-gray-800 rounded-full text-purple-400 text-xs md:text-sm font-semibold">
              Large-Scale Data Systems
            </span>
            <span className="px-3 md:px-4 py-1.5 md:py-2 bg-gray-800 rounded-full text-teal-400 text-xs md:text-sm font-semibold">
              Enterprise Application Design
            </span>
            <span className="px-3 md:px-4 py-1.5 md:py-2 bg-gray-800 rounded-full text-blue-400 text-xs md:text-sm font-semibold">
              DevOps & CI/CD Automation
            </span>
            <span className="px-3 md:px-4 py-1.5 md:py-2 bg-gray-800 rounded-full text-purple-400 text-xs md:text-sm font-semibold">
              Mentorship & Technical Leadership
            </span>
          </div>
        </motion.div>
        <div className="w-full max-w-7xl mx-auto relative px-2 md:px-4">
          <SummaryCard />
        </div>
      </div>
    </section>
  );
}
