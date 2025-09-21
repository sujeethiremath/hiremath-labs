'use client'; // This directive is required for the component to use client-side features.

import { motion } from 'framer-motion';
import { useState } from 'react';

// A separate Client Component to handle the interactive parts
function SummaryCard() {
    const [selectedStack, setSelectedStack] = useState<'frontend' | 'backend' | 'devops' | null>(null);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/50 backdrop-blur-sm rounded-lg border border-gray-200 p-4 md:p-8 shadow-lg"
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                {/* Frontend Layer */}
                <div
                    className={`p-4 md:p-6 rounded-lg transition-colors border-2 ${
                        selectedStack === 'frontend' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 hover:bg-gray-100 border-transparent'
                    }`}
                    onMouseEnter={() => setSelectedStack('frontend')}
                    onMouseLeave={() => setSelectedStack(null)}
                >
                    <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-blue-600">Frontend Development</h3>
                    <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                            React, Next.js & Angular Applications
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                            Scalable Component Architectures
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                            Responsive & Accessible Design
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                            Performance Optimization for Large UIs
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                            Integration with Cloud & APIs
                        </li>
                    </ul>
                </div>

                {/* Backend Layer */}
                <div
                    className={`p-4 md:p-6 rounded-lg transition-colors border-2 ${
                        selectedStack === 'backend' ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 hover:bg-gray-100 border-transparent'
                    }`}
                    onMouseEnter={() => setSelectedStack('backend')}
                    onMouseLeave={() => setSelectedStack(null)}
                >
                    <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-purple-600">Backend Development</h3>
                    <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                            Enterprise APIs in C# .NET & Node.js
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                            Microservices & Event-driven Systems
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                            SQL Server & NoSQL Data Modeling
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                            High-performance ETL & Data Pipelines
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                           Real-time Transaction Processing
                        </li>
                    </ul>
                </div>
                <div
                    className={`p-4 md:p-6 rounded-lg transition-colors border-2 ${
                        selectedStack === 'devops' ? 'bg-teal-50 border-teal-200' : 'bg-gray-50 hover:bg-gray-100 border-transparent'
                    }`}
                    onMouseEnter={() => setSelectedStack('devops')}
                    onMouseLeave={() => setSelectedStack(null)}
                >
                    <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-teal-600">DevOps & Cloud</h3>
                    <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                            Azure & AWS Cloud Architecture
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                            CI/CD Pipelines with Azure DevOps & GitHub Actions
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                            Docker & Kubernetes Orchestration
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                            Monitoring & Reliability Engineering
                        </li>
                    </ul>
                </div>
            </div>
        </motion.div>
    );
}

// The main Server Component, now without 'use client' or state
export default function SummarySection() {
    return (
        <section id="summary" className="min-h-screen relative overflow-hidden py-24 md:py-0">
             
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
            </div>

            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 pt-8 md:pt-0">

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8 md:mb-12">
                    <div className="space-y-3 w-7xl md:space-y-4 mb-6 md:mb-8">
                        <h1 className="text-2xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600">
                            Sujeet Hiremath
                        </h1>
                        <h3 className="text-xl md:text-3xl font-bold text-gray-900">Engineer. Architect. Mentor. Innovator. Building the systems, cultures, and ideas that power the next generation of technology.</h3>
                        <p className="text-xl md:text-xl text-gray-600">
                          I have architected and led the development of enterprise-scale platforms serving thousands of users nation wide. My work spans large-scale cloud transformations, high-performance system architectures, and DevOps innovations that cut costs, increase reliability, and accelerate delivery across industries.
                        </p>
                        <p className="text-base md:text-lg text-gray-500">
                          Alongside my engineering work, I publish insights on software design, DevOps strategies, and cloud-native architectures, helping engineering teams worldwide build smarter, more resilient applications.
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6 md:mb-8">
                        <span className="px-3 md:px-4 py-1.5 md:py-2 bg-blue-100 rounded-full text-blue-600 text-xs md:text-sm">Cloud-Native Architectures</span>
                        <span className="px-3 md:px-4 py-1.5 md:py-2 bg-purple-100 rounded-full text-purple-600 text-xs md:text-sm">Large-Scale Data Systems</span>
                        <span className="px-3 md:px-4 py-1.5 md:py-2 bg-teal-100 rounded-full text-teal-600 text-xs md:text-sm">Enterprise Application Design</span>
                        <span className="px-3 md:px-4 py-1.5 md:py-2 bg-blue-100 rounded-full text-blue-600 text-xs md:text-sm">DevOps & CI/CD Automation</span>
                        <span className="px-3 md:px-4 py-1.5 md:py-2 bg-purple-100 rounded-full text-purple-600 text-xs md:text-sm">Mentorship & Technical Leadership</span>
                    </div>
                </motion.div>
                <div className="w-full max-w-7xl mx-auto relative px-2 md:px-4">
                    <SummaryCard />
                </div>
            </div>
        </section>
    );
}
