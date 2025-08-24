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
                            Modern React Architectures
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                            Performance Optimization
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                            Responsive & Interactive UIs
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
                            API Design & Development
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                            Database Architecture
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                            Real-time Systems
                        </li>
                    </ul>
                </div>

                {/* DevOps Layer */}
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
                            AWS Infrastructure
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                            CI/CD Pipelines
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                            Scalable Architecture
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
        <section className="min-h-screen relative overflow-hidden py-24 md:py-0">
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
            </div>

            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 pt-8 md:pt-0">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8 md:mb-12">
                    <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                        <h1 className="text-4xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600">
                            David Miller
                        </h1>
                        <h2 className="text-2xl md:text-4xl font-bold text-gray-900">Full Stack Developer</h2>
                        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                            I craft end-to-end solutions with 8+ years of experience building scalable applications and leading development teams.
                        </p>
                        <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto">
                            Previously Senior Full Stack Developer at <span className="text-blue-600">Stripe</span> and Tech Lead at{' '}
                            <span className="text-purple-600">Vercel</span>
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6 md:mb-8">
                        <span className="px-3 md:px-4 py-1.5 md:py-2 bg-blue-100 rounded-full text-blue-600 text-xs md:text-sm">TypeScript</span>
                        <span className="px-3 md:px-4 py-1.5 md:py-2 bg-purple-100 rounded-full text-purple-600 text-xs md:text-sm">React & Next.js</span>
                        <span className="px-3 md:px-4 py-1.5 md:py-2 bg-teal-100 rounded-full text-teal-600 text-xs md:text-sm">Node.js</span>
                        <span className="px-3 md:px-4 py-1.5 md:py-2 bg-blue-100 rounded-full text-blue-600 text-xs md:text-sm">Python</span>
                        <span className="px-3 md:px-4 py-1.5 md:py-2 bg-purple-100 rounded-full text-purple-600 text-xs md:text-sm">AWS</span>
                    </div>
                </motion.div>

                {/* Interactive System Architecture */}
                <div className="w-full max-w-5xl mx-auto relative px-2 md:px-4">
                    <SummaryCard />
                </div>
            </div>
        </section>
    );
}
