export default function ProjectsSection() {
    return (
        <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Replaced motion.h2 with a standard h2 */}
                <h2 className="text-3xl font-bold mb-16 text-center text-gray-900">
                    Full Stack Projects
                </h2>

                <div className="space-y-16">
                    {/* E-commerce Platform */}
                    {/* Replaced motion.div with a standard div */}
                    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-lg">
                        <div className="p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-2xl font-bold mb-4 text-gray-900">Enterprise E-commerce Platform</h3>
                                        <p className="text-gray-600">
                                            A high-performance e-commerce solution handling 100K+ daily transactions with real-time inventory and ML-powered recommendations.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="text-sm font-semibold text-blue-600 mb-3">Frontend Architecture</h4>
                                            <ul className="space-y-2 text-sm text-gray-600">
                                                <li>• Next.js Server Components</li>
                                                <li>• Real-time Cart & Inventory</li>
                                                <li>• Stripe Payment Integration</li>
                                                <li>• PWA with Offline Support</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-purple-600 mb-3">Backend Systems</h4>
                                            <ul className="space-y-2 text-sm text-gray-600">
                                                <li>• Node.js Microservices</li>
                                                <li>• Redis Caching Layer</li>
                                                <li>• Kafka Event Streaming</li>
                                                <li>• Elasticsearch Product Search</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold text-teal-600">Key Achievements</h4>
                                        <ul className="space-y-2 text-sm text-gray-600">
                                            <li>• 99.99% Uptime with Blue-Green Deployment</li>
                                            <li>• 300ms Average API Response Time</li>
                                            <li>• 45% Reduction in Infrastructure Costs</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h4 className="text-sm font-semibold text-gray-600 mb-4">System Architecture</h4>
                                    <div className="aspect-[4/3] bg-white rounded-lg p-4 shadow-inner">
                                        {/* Add detailed system architecture diagram here */}
                                        <svg className="w-full h-full" viewBox="0 0 400 300">
                                            {/* Client Layer */}
                                            <g>
                                                <rect x="20" y="20" width="360" height="40" rx="4" className="fill-blue-100 stroke-blue-400" strokeWidth="1" />
                                                <text x="200" y="45" textAnchor="middle" className="fill-gray-600 text-[12px]">
                                                    Next.js Frontend (SSR + Client Components)
                                                </text>
                                            </g>

                                            {/* API Layer */}
                                            <g>
                                                <rect x="20" y="80" width="170" height="40" rx="4" className="fill-purple-100 stroke-purple-400" strokeWidth="1" />
                                                <rect x="210" y="80" width="170" height="40" rx="4" className="fill-purple-100 stroke-purple-400" strokeWidth="1" />
                                                <text x="105" y="105" textAnchor="middle" className="fill-gray-600 text-[12px]">
                                                    Product Service
                                                </text>
                                                <text x="295" y="105" textAnchor="middle" className="fill-gray-600 text-[12px]">
                                                    Order Service
                                                </text>
                                            </g>

                                            {/* Cache Layer */}
                                            <g>
                                                <rect x="20" y="140" width="360" height="30" rx="4" className="fill-teal-100 stroke-teal-400" strokeWidth="1" />
                                                <text x="200" y="160" textAnchor="middle" className="fill-gray-600 text-[12px]">
                                                    Redis Cache Layer
                                                </text>
                                            </g>

                                            {/* Database Layer */}
                                            <g>
                                                <rect x="20" y="190" width="170" height="40" rx="4" className="fill-blue-100 stroke-blue-400" strokeWidth="1" />
                                                <rect x="210" y="190" width="170" height="40" rx="4" className="fill-purple-100 stroke-purple-400" strokeWidth="1" />
                                                <text x="105" y="215" textAnchor="middle" className="fill-gray-600 text-[12px]">
                                                    Product DB (PostgreSQL)
                                                </text>
                                                <text x="295" y="215" textAnchor="middle" className="fill-gray-600 text-[12px]">
                                                    Order DB (MongoDB)
                                                </text>
                                            </g>

                                            {/* Search Layer */}
                                            <g>
                                                <rect x="20" y="250" width="360" height="30" rx="4" className="fill-teal-100 stroke-teal-400" strokeWidth="1" />
                                                <text x="200" y="270" textAnchor="middle" className="fill-gray-600 text-[12px]">
                                                    Elasticsearch Product Search
                                                </text>
                                            </g>

                                            {/* Connection Lines */}
                                            <g className="stroke-gray-400" strokeWidth="1">
                                                <line x1="200" y1="60" x2="200" y2="80" />
                                                <line x1="105" y1="120" x2="105" y2="140" />
                                                <line x1="295" y1="120" x2="295" y2="140" />
                                                <line x1="105" y1="170" x2="105" y2="190" />
                                                <line x1="295" y1="170" x2="295" y2="190" />
                                                <line x1="200" y1="230" x2="200" y2="250" />
                                            </g>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Real-time Analytics Platform */}
                    {/* Replaced motion.div with a standard div */}
                    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-lg">
                        <div className="p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-2xl font-bold mb-4 text-gray-900">Real-time Analytics Platform</h3>
                                        <p className="text-gray-600">
                                            A scalable analytics platform processing 1M+ events per minute with real-time dashboards and ML-powered insights.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="text-sm font-semibold text-blue-600 mb-3">Frontend Features</h4>
                                            <ul className="space-y-2 text-sm text-gray-600">
                                                <li>• Real-time Data Visualization</li>
                                                <li>• Interactive Dashboards</li>
                                                <li>• Custom Chart Components</li>
                                                <li>• Data Export Tools</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-purple-600 mb-3">Backend Pipeline</h4>
                                            <ul className="space-y-2 text-sm text-gray-600">
                                                <li>• Apache Kafka Streams</li>
                                                <li>• ClickHouse Analytics DB</li>
                                                <li>• Python Data Processing</li>
                                                <li>• Redis Time Series</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold text-teal-600">Performance Metrics</h4>
                                        <ul className="space-y-2 text-sm text-gray-600">
                                            <li>• 1M+ Events/Minute Processing</li>
                                            <li>• Sub-second Query Response</li>
                                            <li>• 99.99% Data Accuracy</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h4 className="text-sm font-semibold text-gray-600 mb-4">Data Flow Architecture</h4>
                                    <div className="aspect-[4/3] bg-white rounded-lg p-4 shadow-inner">
                                        <svg className="w-full h-full" viewBox="0 0 400 300">
                                            {/* Data Sources */}
                                            <g>
                                                <rect x="20" y="20" width="110" height="30" rx="4" className="fill-blue-100 stroke-blue-400" strokeWidth="1" />
                                                <rect x="145" y="20" width="110" height="30" rx="4" className="fill-blue-100 stroke-blue-400" strokeWidth="1" />
                                                <rect x="270" y="20" width="110" height="30" rx="4" className="fill-blue-100 stroke-blue-400" strokeWidth="1" />
                                                <text x="75" y="40" textAnchor="middle" className="fill-gray-600 text-[12px]">
                                                    Web Events
                                                </text>
                                                <text x="200" y="40" textAnchor="middle" className="fill-gray-600 text-[12px]">
                                                    Mobile Events
                                                </text>
                                                <text x="325" y="40" textAnchor="middle" className="fill-gray-600 text-[12px]">
                                                    API Events
                                                </text>
                                            </g>

                                            {/* Event Processing */}
                                            <g>
                                                <rect x="20" y="80" width="360" height="40" rx="4" className="fill-purple-100 stroke-purple-400" strokeWidth="1" />
                                                <text x="200" y="105" textAnchor="middle" className="fill-gray-600 text-[12px]">
                                                    Kafka Event Streaming
                                                </text>
                                            </g>

                                            {/* Processing Layer */}
                                            <g>
                                                <rect x="20" y="150" width="170" height="40" rx="4" className="fill-teal-100 stroke-teal-400" strokeWidth="1" />
                                                <rect x="210" y="150" width="170" height="40" rx="4" className="fill-teal-100 stroke-teal-400" strokeWidth="1" />
                                                <text x="105" y="175" textAnchor="middle" className="fill-gray-600 text-[12px]">
                                                    Stream Processing
                                                </text>
                                                <text x="295" y="175" textAnchor="middle" className="fill-gray-600 text-[12px]">
                                                    Batch Processing
                                                </text>
                                            </g>

                                            {/* Storage Layer */}
                                            <g>
                                                <rect x="20" y="220" width="170" height="30" rx="4" className="fill-blue-100 stroke-blue-400" strokeWidth="1" />
                                                <rect x="210" y="220" width="170" height="30" rx="4" className="fill-purple-100 stroke-purple-400" strokeWidth="1" />
                                                <text x="105" y="240" textAnchor="middle" className="fill-gray-600 text-[12px]">
                                                    ClickHouse
                                                </text>
                                                <text x="295" y="240" textAnchor="middle" className="fill-gray-600 text-[12px]">
                                                    Redis Time Series
                                                </text>
                                            </g>

                                            {/* API Layer */}
                                            <g>
                                                <rect x="20" y="270" width="360" height="30" rx="4" className="fill-teal-100 stroke-teal-400" strokeWidth="1" />
                                                <text x="200" y="290" textAnchor="middle" className="fill-gray-600 text-[12px]">
                                                    GraphQL API Layer
                                                </text>
                                            </g>

                                            {/* Connection Lines */}
                                            <g className="stroke-gray-400" strokeWidth="1">
                                                <line x1="75" y1="50" x2="75" y2="80" />
                                                <line x1="200" y1="50" x2="200" y2="80" />
                                                <line x1="325" y1="50" x2="325" y2="80" />
                                                <line x1="200" y1="120" x2="200" y2="150" />
                                                <line x1="105" y1="190" x2="105" y2="220" />
                                                <line x1="295" y1="190" x2="295" y2="220" />
                                                <line x1="200" y1="250" x2="200" y2="270" />
                                            </g>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
