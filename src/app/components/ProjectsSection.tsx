import React from "react";

const ProjectsSection: React.FC = () => {
  return (
    <section id="projects" className="py-16 px-4 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Professional Experience
        </h2>

        {/* Vertical list of project cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {/* E-470 Card */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 ease-in-out hover:scale-105 group">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl"></div>

            <div className="relative p-8">
              <h3 className="text-2xl font-bold mb-2 text-blue-400">
                Senior Software Developer & Team Lead
              </h3>
              <h4 className="text-lg font-semibold text-gray-300 mb-6">
                E-470 Public Highway Authority, Aurora, CO (Dec 2022 - Present)
              </h4>
              <p className="text-gray-400 mb-8 leading-relaxed">
                E-470 is a 47-mile controlled-access toll road serving the
                eastern Denver metropolitan area. At E-470, I architected,
                modernized, and scaled mission-critical tolling systems, APIs,
                and customer-facing platforms.
              </p>

              {/* Simplified Stacked Sections */}
              <div className="space-y-6 text-sm">
                <div>
                  <h4 className="font-bold text-blue-400 mb-2">Front-End</h4>
                  <ul className="space-y-1 text-gray-400 list-disc list-inside">
                    <li>
                      Modernized ExpressToll website to full ADA compliance
                      (Angular 18, axe).
                    </li>
                    <li>
                      Implemented ADA-compliant PDF generation across web
                      services.
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-purple-400 mb-2">
                    Back-End & Systems
                  </h4>
                  <ul className="space-y-1 text-gray-400 list-disc list-inside">
                    <li>Optimized service APIs (FleetPass by BancPass).</li>
                    <li>
                      Built monitoring for IOP files (STRAN, SCORR, SRECON).
                    </li>
                    <li>
                      Re-engineered console apps for multi-threaded processing
                      of 200M+ records.
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-teal-400 mb-2">
                    DevOps & Cloud
                  </h4>
                  <ul className="space-y-1 text-gray-400 list-disc list-inside">
                    <li>
                      Led repository migration from TFS to Azure DevOps with
                      PowerShell.
                    </li>
                    <li>Created CI/CD pipelines in Azure DevOps.</li>
                    <li>
                      Managed Azure API Management to secure and publish APIs.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Technologies and Impact Section */}
              <div className="mt-8">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-yellow-400 mb-2">Impact</h4>
                    <ul className="space-y-1 text-gray-400 list-disc list-inside">
                      <li>
                        Reduced outbound file processing time from hours to
                        minutes.
                      </li>
                      <li>
                        Improved compliance and accessibility for thousands of
                        customers.
                      </li>
                      <li>
                        Increased scalability for future EZPASS integration.
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-yellow-400 mb-2">
                      Technologies
                    </h4>
                    <p className="text-gray-400 text-sm">
                      <span className="inline-block bg-gray-800 rounded-full px-3 py-1 text-sm font-semibold text-gray-200 mr-2 mb-2">
                        C#
                      </span>
                      <span className="inline-block bg-gray-800 rounded-full px-3 py-1 text-sm font-semibold text-gray-200 mr-2 mb-2">
                        .NET 6
                      </span>
                      <span className="inline-block bg-gray-800 rounded-full px-3 py-1 text-sm font-semibold text-gray-200 mr-2 mb-2">
                        Angular 18
                      </span>
                      <span className="inline-block bg-gray-800 rounded-full px-3 py-1 text-sm font-semibold text-gray-200 mr-2 mb-2">
                        SQL Server
                      </span>
                      <span className="inline-block bg-gray-800 rounded-full px-3 py-1 text-sm font-semibold text-gray-200 mr-2 mb-2">
                        Azure DevOps
                      </span>
                      <span className="inline-block bg-gray-800 rounded-full px-3 py-1 text-sm font-semibold text-gray-200 mr-2 mb-2">
                        APIs
                      </span>
                      <span className="inline-block bg-gray-800 rounded-full px-3 py-1 text-sm font-semibold text-gray-200 mr-2 mb-2">
                        Git
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vettx Inc. Card */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 ease-in-out hover:scale-105 group">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl"></div>

            <div className="relative p-8">
              <h3 className="text-2xl font-bold mb-2 text-blue-400">
                Software Developer
              </h3>
              <h4 className="text-lg font-semibold text-gray-300 mb-6">
                Vettx Inc., Chico, CA (Feb 2022 - Oct 2022)
              </h4>
              <p className="text-gray-400 mb-8 leading-relaxed">
                VETTX is an AI-powered platform that helps car dealerships
                source inventory from private sellers. At VETTX, I engineered
                data-driven tools, APIs, and DevOps pipelines that automated
                inventory acquisition for over 200 dealerships nationwide.
              </p>

              {/* Simplified Stacked Sections */}
              <div className="space-y-6 text-sm">
                <div>
                  <h4 className="font-bold text-blue-400 mb-2">Front-End</h4>
                  <ul className="space-y-1 text-gray-400 list-disc list-inside">
                    <li>
                      Designed and implemented a CRM for dealerships (Laravel).
                    </li>
                    <li>Created a smart data entry tool.</li>
                    <li>Built two-way SMS communication with Twilio APIs.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-purple-400 mb-2">
                    Back-End & Systems
                  </h4>
                  <ul className="space-y-1 text-gray-400 list-disc list-inside">
                    <li>
                      Developed internal APIs with NestJS for data enrichment.
                    </li>
                    <li>Trained a machine learning classifier.</li>
                    <li>
                      Implemented scrapers in Node.js and Python (AWS Lambda,
                      S3).
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-teal-400 mb-2">
                    DevOps & Cloud
                  </h4>
                  <ul className="space-y-1 text-gray-400 list-disc list-inside">
                    <li>
                      Built DevOps infrastructure with GitHub Actions and YAML
                      CI/CD.
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-yellow-400 mb-2">Impact</h4>
                    <ul className="space-y-1 text-gray-400 list-disc list-inside">
                      <li>
                        Automated inventory acquisition, cutting manual work by
                        over 50%.
                      </li>
                      <li>Deployed a scalable scraping/ML pipeline.</li>
                      <li>
                        Reduced deployment time from hours to minutes through
                        CI/CD.
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-yellow-400 mb-2">
                      Technologies
                    </h4>
                    <p className="text-gray-400 text-sm">
                      <span className="inline-block bg-gray-800 rounded-full px-3 py-1 text-sm font-semibold text-gray-200 mr-2 mb-2">
                        PHP
                      </span>
                      <span className="inline-block bg-gray-800 rounded-full px-3 py-1 text-sm font-semibold text-gray-200 mr-2 mb-2">
                        Laravel
                      </span>
                      <span className="inline-block bg-gray-800 rounded-full px-3 py-1 text-sm font-semibold text-gray-200 mr-2 mb-2">
                        NestJS
                      </span>
                      <span className="inline-block bg-gray-800 rounded-full px-3 py-1 text-sm font-semibold text-gray-200 mr-2 mb-2">
                        Python
                      </span>
                      <span className="inline-block bg-gray-800 rounded-full px-3 py-1 text-sm font-semibold text-gray-200 mr-2 mb-2">
                        AWS Lambda
                      </span>
                      <span className="inline-block bg-gray-800 rounded-full px-3 py-1 text-sm font-semibold text-gray-200 mr-2 mb-2">
                        GitHub Actions
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* InvestorKeep Card */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 ease-in-out hover:scale-105 group">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl"></div>

            <div className="relative p-8">
              <h3 className="text-2xl font-bold mb-2 text-blue-400">
                Software Developer
              </h3>
              <h4 className="text-lg font-semibold text-gray-300 mb-6">
                InvestorKeep, Chico, CA (Feb 2021 - Dec 2021)
              </h4>
              <p className="text-gray-400 mb-8 leading-relaxed">
                InvestorKeep is an integrated subscription platform providing
                unbiased monitoring and analysis of client investment accounts.
                At InvestorKeep, I focused on automation, observability, and
                secure scaling of the platform.
              </p>

              {/* Simplified Stacked Sections */}
              <div className="space-y-6 text-sm">
                <div>
                  <h4 className="font-bold text-blue-400 mb-2">Front-End</h4>
                  <ul className="space-y-1 text-gray-400 list-disc list-inside">
                    <li>Managed and maintained the Next.js website.</li>
                    <li>Created insightful dashboards with Mixpanel.</li>
                    <li>
                      Optimized front-end performance (sub-second load times).
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-purple-400 mb-2">
                    Back-End & Systems
                  </h4>
                  <ul className="space-y-1 text-gray-400 list-disc list-inside">
                    <li>Built APIs to capture and process website events.</li>
                    <li>Implemented 2FA with Auth0 and GoLang services.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-teal-400 mb-2">
                    DevOps & Cloud
                  </h4>
                  <ul className="space-y-1 text-gray-400 list-disc list-inside">
                    <li>
                      Deployed 200+ Docker containers to Kubernetes on AWS.
                    </li>
                    <li>Implemented Prometheus and Kibana for monitoring.</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-yellow-400 mb-2">Impact</h4>
                    <ul className="space-y-1 text-gray-400 list-disc list-inside">
                      <li>Strengthened security and compliance.</li>
                      <li>Scaled infrastructure to handle growth.</li>
                      <li>Delivered real-time insights to stakeholders.</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-yellow-400 mb-2">
                      Technologies
                    </h4>
                    <p className="text-gray-400 text-sm">
                      <span className="inline-block bg-gray-800 rounded-full px-3 py-1 text-sm font-semibold text-gray-200 mr-2 mb-2">
                        Next.js
                      </span>
                      <span className="inline-block bg-gray-800 rounded-full px-3 py-1 text-sm font-semibold text-gray-200 mr-2 mb-2">
                        GoLang
                      </span>
                      <span className="inline-block bg-gray-800 rounded-full px-3 py-1 text-sm font-semibold text-gray-200 mr-2 mb-2">
                        Auth0
                      </span>
                      <span className="inline-block bg-gray-800 rounded-full px-3 py-1 text-sm font-semibold text-gray-200 mr-2 mb-2">
                        Kubernetes
                      </span>
                      <span className="inline-block bg-gray-800 rounded-full px-3 py-1 text-sm font-semibold text-gray-200 mr-2 mb-2">
                        AWS
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FIGmd Inc. Card */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 ease-in-out hover:scale-105 group">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl"></div>

            <div className="relative p-8">
              <h3 className="text-2xl font-bold mb-2 text-blue-400">
                Associate Software Engineer
              </h3>
              <h4 className="text-lg font-semibold text-gray-300 mb-6">
                FIGmd Inc., Pune, India (Oct 2017 - Oct 2018)
              </h4>
              <p className="text-gray-400 mb-8 leading-relaxed">
                FIGmd (a Google-funded venture) provides intelligent healthcare
                data solutions and actionable insights for measurable outcomes.
                At FIGmd, I focused on data engineering and ETL pipelines for
                national medical registries.
              </p>

              {/* Simplified Stacked Sections */}
              <div className="space-y-6 text-sm">
                <div>
                  <h4 className="font-bold text-blue-400 mb-2">Front-End</h4>
                  <ul className="space-y-1 text-gray-400 list-disc list-inside">
                    <li>
                      Collaborated with stakeholders to define data mapping
                      requirements.
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-purple-400 mb-2">
                    Back-End & Systems
                  </h4>
                  <ul className="space-y-1 text-gray-400 list-disc list-inside">
                    <li>
                      Designed an internal ETL tool with Python and Apache
                      Spark.
                    </li>
                    <li>
                      Performed data mining, mapping, and ETL for multiple U.S.
                      healthcare registries.
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-teal-400 mb-2">
                    DevOps & Cloud
                  </h4>
                  <ul className="space-y-1 text-gray-400 list-disc list-inside">
                    <li>
                      Automated data workflows and deployments in the cloud.
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-yellow-400 mb-2">Impact</h4>
                    <ul className="space-y-1 text-gray-400 list-disc list-inside">
                      <li>
                        Streamlined large-scale healthcare data processing.
                      </li>
                      <li>
                        Reduced manual effort for healthcare organizations.
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-yellow-400 mb-2">
                      Technologies
                    </h4>
                    <p className="text-gray-400 text-sm">
                      <span className="inline-block bg-gray-800 rounded-full px-3 py-1 text-sm font-semibold text-gray-200 mr-2 mb-2">
                        Python
                      </span>
                      <span className="inline-block bg-gray-800 rounded-full px-3 py-1 text-sm font-semibold text-gray-200 mr-2 mb-2">
                        Apache Spark
                      </span>
                      <span className="inline-block bg-gray-800 rounded-full px-3 py-1 text-sm font-semibold text-gray-200 mr-2 mb-2">
                        SQL
                      </span>
                      <span className="inline-block bg-gray-800 rounded-full px-3 py-1 text-sm font-semibold text-gray-200 mr-2 mb-2">
                        ETL
                      </span>
                      <span className="inline-block bg-gray-800 rounded-full px-3 py-1 text-sm font-semibold text-gray-200 mr-2 mb-2">
                        Git
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
