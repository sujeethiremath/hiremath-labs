import React from "react";

interface Job {
  company: string;
  role: string;
  dates: string;
  bullets: string[];
}

interface Project {
  title: string;
  bullets: string[];
}

const ProjectsSection: React.FC = () => {
  const experiences: Job[] = [
    {
      company: "E-470 Public Highway Authority",
      role: "Senior Software Engineer",
      dates: "December 2022 - Present",
      bullets: [
        "Architected a Resilient 'Pull-Model' Ingestion Engine: Designed and deployed a secure, decoupled document ingestion system using Azure Storage Queues and a .NET Worker Service to bypass inbound firewall constraints, ensuring 100% data integrity for multi-environment (Dev to ML) deployments.",
        "Engineered a Zero-Trust Cloud Infrastructure: Leveraged Terraform to implement hardened storage security, enforcing IP-based firewalls, RBAC, and Microsoft Defender for Storage to automate malware scanning for high-volume ZIP/CSV inbound data.",
        "Optimized Resource Governance & Storage Lifecycle: Automated end-to-end data cleanup via Azure Lifecycle Management policies and managed high-throughput storage containers, reducing long-term cloud storage costs by 40%.",
        "High-Throughput System Optimization: Re-architected console applications utilizing multi-threading and parallel processing to handle 200+ million outbound TVL records, resulting in a 90%+ reduction in file processing time.",
        "DevOps & Modernization: Directed the repository migration from TFS to Azure DevOps, automating migration with PowerShell and converting legacy build tasks to efficient YAML pipelines.",
        "Proactive Observability & High Availability: Designed and deployed a mission-critical monitoring system to detect and auto-notify on latency in interdependent IOP file processing.",
        "Front-End & Compliance: Led the modernization of the ExpressToll customer platform (Angular 18) to achieve full ADA compliance."
      ]
    },
    {
      company: "Vettx Inc.",
      role: "Software Engineer",
      dates: "February 2022 - October 2022",
      bullets: [
        "Production ML Deployment: Designed, trained, and productionized a machine learning classifier to accurately distinguish individual sellers from dealership listings, automating the core inventory acquisition logic and cutting manual data qualification efforts by over 50%.",
        "Scalable Data Ingestion (Serverless): Engineered and deployed resilient, serverless scraping pipelines (Node.js/Python on AWS Lambda/S3) to collect and store vehicle listings from high-volume sources.",
        "API & Partner Integration: Developed internal NestJS APIs to facilitate complex, two-way data flow with major partners (Carfax, CDK Global, Twilio).",
        "Infrastructure Ownership: Built the company’s entire DevOps infrastructure from scratch using GitHub Actions and YAML CI/CD.",
        "Engineered an Intelligent Data Entry Engine: Architected and deployed a smart data processing tool that automated the extraction and normalization of vehicle data from disparate sources."
      ]
    },
    {
      company: "InvestorKeep Inc.",
      role: "Software Engineer",
      dates: "February 2021 - December 2021",
      bullets: [
        "Testing & Quality Assurance: Wrote over 100 Cypress E2E test cases to automate regression testing across the financial portfolio management website.",
        "Security Modernization: Engineered and implemented GoLang-based services to replace vulnerable legacy authentication and integrate 2FA with Auth0.",
        "Observability & Analytics: Established a complete observability stack using Prometheus and Kibana alongside Mixpanel dashboards.",
        "High-Density Container Orchestration: Designed and deployed a containerized microservice architecture, managing 200+ Docker containers on Kubernetes (AWS)."
      ]
    },
    {
      company: "FigMD Inc.",
      role: "Associate Software Engineer",
      dates: "October 2017 - October 2018",
      bullets: [
        "Big Data Pipeline Design: Designed and built an internal, scalable ETL tool using Python and Apache Spark for processing and standardizing complex, large-scale healthcare data.",
        "Data Integrity & Compliance: Managed full ETL (extract, transform, load) and data mapping for national U.S. healthcare registries."
      ]
    }
  ];

  const projects: Project[] = [
    {
      title: "Grey Matter: Ghost Scribe",
      bullets: [
        "Architected an autonomous multi-agent job-seeking system using Python and Ollama, featuring a headless scraping engine that utilizes Playwright and JobSpy.",
        "Engineered an automated 'Architect' agent using LLM prompt engineering (Dolphin-Llama3) to perform zero-shot resume tailoring.",
        "Implemented a robust background orchestration layer using Cron and Bash on macOS, incorporating proxy rotation (IPRoyal) and exponential backoff logic."
      ]
    },
    {
      title: "Autonomous Sports Analytics Engine",
      bullets: [
        "Engineered a robust Python-based ETL pipeline to ingest, process, and store historical sports data using Parquet, leveraging Pandas.",
        "Architected an Agentic Workflow integrating a local LLM (Dolphin via Ollama) to autonomously analyze real-time unstructured data.",
        "Automated end-to-end operational cycles, seamlessly bridging the statistical modeling and AI inference phases to dynamically generate comprehensive daily PDF analytical dossiers."
      ]
    },
    {
      title: "Personal Portfolio & Technical Blog",
      bullets: [
        "Engineered a High-Performance Technical Hub: Developed a responsive, SEO-optimized professional platform using Next.js and Tailwind CSS.",
        "Implemented Modern Web Architecture: Leveraged Server-Side Rendering (SSR) and Static Site Generation (SSG) to ensure sub-second page loads."
      ]
    }
  ];

  return (
    <section id="projects" className="py-20 px-4 bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-extrabold mb-12 uppercase tracking-wider text-gray-300 border-b border-white/10 pb-4">
          Professional Experience
        </h2>

        {/* Experience Timeline */}
        <div className="space-y-12 mb-20">
          {experiences.map((job, idx) => (
            <div key={idx} className="relative group pl-0 md:pl-6 border-l-2 border-white/5 hover:border-blue-500/50 transition-colors duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                <div>
                  <h3 className="text-xl font-bold text-gray-100">{job.role}</h3>
                  <span className="text-sm font-semibold text-blue-400">{job.company}</span>
                </div>
                <span className="text-xs md:text-sm font-mono text-gray-400 bg-white/5 px-3 py-1 rounded-full w-fit">
                  {job.dates}
                </span>
              </div>
              <ul className="space-y-3.5 text-sm text-gray-300 leading-relaxed list-disc pl-5">
                {job.bullets.map((bullet, bulletIdx) => (
                  <li key={bulletIdx} className="hover:text-white transition-colors duration-200">
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h2 className="text-3xl font-extrabold mb-12 uppercase tracking-wider text-gray-300 border-b border-white/10 pb-4">
          Strategic Projects
        </h2>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, idx) => (
            <div key={idx} className="p-6 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md hover:border-white/10 transition-all duration-300 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold mb-4 text-purple-400">
                  {project.title}
                </h3>
                <ul className="space-y-3 text-xs text-gray-300 leading-relaxed list-disc pl-4">
                  {project.bullets.map((bullet, bulletIdx) => (
                    <li key={bulletIdx}>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
