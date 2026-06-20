"use client";

import { motion } from "framer-motion";

function SummaryCard() {
  const categories = [
    {
      name: "Languages",
      skills: "C#, TypeScript, SQL (T-SQL/PL-SQL), Go, Python, JavaScript, PHP, HCL, C++, Java, YAML",
      color: "text-blue-400",
      border: "border-blue-500/20",
      bg: "bg-blue-500/5",
    },
    {
      name: "DevOps & Cloud",
      skills: "Azure (Blob/Queues/Key Vault/Event Grid/Defender), Terraform (IaC), Kubernetes, Docker, Azure DevOps, GitHub Actions, AWS (Lambda/S3), Prometheus, Kibana",
      color: "text-teal-400",
      border: "border-teal-500/20",
      bg: "bg-teal-500/5",
    },
    {
      name: "Data",
      skills: "SQL Server, PostgreSQL, MySQL, NoSQL (Firebase/Firestore), Database Optimization & Modeling",
      color: "text-purple-400",
      border: "border-purple-500/20",
      bg: "bg-purple-500/5",
    },
    {
      name: "Frameworks",
      skills: ".NET (Core/Framework), Angular 18, Next.js, NestJS, Laravel, Apache Spark, Service Fabric",
      color: "text-indigo-400",
      border: "border-indigo-500/20",
      bg: "bg-indigo-500/5",
    },
    {
      name: "Observability & Security",
      skills: "OpenTelemetry (OTel), DynaTrace, Distroless Containerization, Microsoft Defender for Cloud, Managed Identities (RBAC)",
      color: "text-emerald-400",
      border: "border-emerald-500/20",
      bg: "bg-emerald-500/5",
    },
    {
      name: "Architecture & Patterns",
      skills: "Microservices, Event-Driven, System Optimization (Multithreading/Parallelism), API Design (REST), Distributed Systems, Zero-Trust Security",
      color: "text-amber-400",
      border: "border-amber-500/20",
      bg: "bg-amber-500/5",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-2xl border ${cat.border} ${cat.bg} backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-white/10`}
          >
            <h3 className={`text-lg font-bold mb-3 ${cat.color}`}>
              {cat.name}
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed font-mono">
              {cat.skills}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function SummarySection() {
  return (
    <section
      id="summary"
      className="min-h-screen relative overflow-hidden py-16 md:py-24 bg-gray-900 text-white"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 max-w-4xl"
        >
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-semibold uppercase tracking-wider">
                Senior Software Engineer
              </span>
              <span className="px-3 py-1 bg-gray-800 text-gray-400 rounded-full text-xs font-semibold uppercase tracking-wider">
                Aurora, Colorado
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-teal-400">
              Sujeet Sharad Hiremath
            </h1>
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
              Strategic technical leader with over 5 years of experience architecting resilient, cloud-native infrastructures and high-throughput distributed systems. Specialized in transforming complex legacy monoliths into scalable microservices architectures supporting 200M+ monthly transactions.
            </p>
            <p className="text-base text-gray-400 leading-relaxed">
              Proven expertise in optimizing low-latency data pipelines (resulting in 90%+ performance gains) and maintaining 99.99% availability for mission-critical applications. Focused on engineering excellence, system concurrency at scale, and implementing robust security frameworks.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-gray-800 rounded-full text-gray-300 text-xs font-medium">
              C#/.NET
            </span>
            <span className="px-3 py-1 bg-gray-800 rounded-full text-gray-300 text-xs font-medium">
              Go
            </span>
            <span className="px-3 py-1 bg-gray-800 rounded-full text-gray-300 text-xs font-medium">
              Kubernetes
            </span>
            <span className="px-3 py-1 bg-gray-800 rounded-full text-gray-300 text-xs font-medium">
              Azure/AWS Cloud
            </span>
            <span className="px-3 py-1 bg-gray-800 rounded-full text-gray-300 text-xs font-medium">
              Terraform IaC
            </span>
            <span className="px-3 py-1 bg-gray-800 rounded-full text-gray-300 text-xs font-medium">
              Distributed Systems
            </span>
            <span className="px-3 py-1 bg-gray-800 rounded-full text-gray-300 text-xs font-medium">
              High-Throughput APIs
            </span>
          </div>
        </motion.div>

        <div className="w-full mt-4">
          <h2 className="text-xl font-bold text-gray-300 mb-6 uppercase tracking-wider">
            Technical Expertise
          </h2>
          <SummaryCard />
        </div>
      </div>
    </section>
  );
}
