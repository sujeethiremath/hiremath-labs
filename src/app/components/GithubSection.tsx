"use client";

import { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";
import { GitFork, Star, BookOpen, Github, Users, Layers } from "lucide-react";
import { motion } from "framer-motion";

interface Language {
  name: string;
  count: number;
}

interface TopRepo {
  name: string;
  stars: number;
  forks: number;
  language: string;
  url: string;
}

interface GitHubData {
  profile: {
    login: string;
    avatarUrl: string;
    followers: number;
    publicRepos: number;
    name: string;
  };
  stats: {
    totalStars: number;
    totalForks: number;
    languages: Language[];
    topRepos: TopRepo[];
  };
}

export default function GithubSection() {
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/github-data");
        if (!response.ok) {
          // Fallback mock data in case of GitHub API issues
          const mockData: GitHubData = {
            profile: {
              login: "hiremath09",
              name: "Sujeet Sharad Hiremath",
              avatarUrl: "https://github.com/hiremath09.png",
              followers: 15,
              publicRepos: 24,
            },
            stats: {
              totalStars: 18,
              totalForks: 8,
              languages: [
                { name: "TypeScript", count: 12 },
                { name: "Python", count: 7 },
                { name: "C#", count: 4 },
                { name: "Go", count: 1 },
              ],
              topRepos: [
                {
                  name: "GreyMatter",
                  stars: 8,
                  forks: 3,
                  language: "Python",
                  url: "https://github.com/hiremath09/GreyMatter",
                },
                {
                  name: "ghost-protocol",
                  stars: 6,
                  forks: 2,
                  language: "Python",
                  url: "https://github.com/hiremath09/ghost-protocol",
                },
                {
                  name: "hiremath-labs",
                  stars: 4,
                  forks: 3,
                  language: "TypeScript",
                  url: "https://github.com/hiremath09/hiremath-labs",
                },
              ],
            },
          };
          setData(mockData);
        } else {
          const result: GitHubData = await response.json();
          setData(result);
        }
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data && chartRef.current) {
      chartInstance.current?.destroy();

      const relevantLanguages = (data.stats.languages || [])
        .slice(0, 5);

      const labels = relevantLanguages.map((l) => l.name);
      const values = relevantLanguages.map((l) => l.count);
      const colorPalette = [
        "#60a5fa", // Blue
        "#34d399", // Emerald Green
        "#f59e0b", // Amber Yellow
        "#a78bfa", // Purple
        "#ec4899", // Pink
      ];

      chartInstance.current = new Chart(chartRef.current, {
        type: "polarArea",
        data: {
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: colorPalette.map(c => `${c}80`), // transparent
              borderColor: "#1f2937",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              grid: { color: "rgba(255, 255, 255, 0.05)" },
              angleLines: { color: "rgba(255, 255, 255, 0.05)" },
              pointLabels: { color: "#cbd5e1" },
              ticks: { display: false }
            }
          },
          plugins: {
            legend: {
              position: "right" as const,
              labels: { color: "#cbd5e1" },
            },
          },
        },
      });
    }
    return () => chartInstance.current?.destroy();
  }, [data]);

  if (loading) {
    return (
      <section id="github" className="py-16 px-4 bg-gray-900/50">
        <div className="flex items-center justify-center min-h-[300px] text-gray-400">
          <div className="text-lg font-semibold">Loading GitHub statistics...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="github" className="py-16 px-4 bg-gray-900/50 text-center">
        <div className="text-red-400 font-semibold">Failed to load GitHub stats: {error}</div>
      </section>
    );
  }

  const { profile, stats } = data || {};

  return (
    <section id="github" className="py-20 px-4 bg-gray-900 text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
          GitHub Activity & Repositories
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1: Profile & Star Count */}
          <div className="space-y-6">
            {/* Profile Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl flex items-center gap-5"
            >
              {profile?.avatarUrl && (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-16 h-16 rounded-full border-2 border-blue-500"
                />
              )}
              <div>
                <h3 className="font-bold text-lg">{profile?.name}</h3>
                <a
                  href={`https://github.com/${profile?.login}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:underline flex items-center gap-1 mt-1"
                >
                  <Github size={12} />
                  @{profile?.login}
                </a>
              </div>
            </motion.div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center flex flex-col justify-center"
              >
                <div className="flex justify-center text-blue-400 mb-2">
                  <Star size={20} />
                </div>
                <div className="text-2xl font-black">{stats?.totalStars}</div>
                <div className="text-[10px] uppercase tracking-wider text-gray-400 mt-1">Repo Stars</div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center flex flex-col justify-center"
              >
                <div className="flex justify-center text-teal-400 mb-2">
                  <GitFork size={20} />
                </div>
                <div className="text-2xl font-black">{stats?.totalForks}</div>
                <div className="text-[10px] uppercase tracking-wider text-gray-400 mt-1">Repo Forks</div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center flex flex-col justify-center"
              >
                <div className="flex justify-center text-purple-400 mb-2">
                  <Layers size={20} />
                </div>
                <div className="text-2xl font-black">{profile?.publicRepos}</div>
                <div className="text-[10px] uppercase tracking-wider text-gray-400 mt-1">Public Repos</div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center flex flex-col justify-center"
              >
                <div className="flex justify-center text-pink-400 mb-2">
                  <Users size={20} />
                </div>
                <div className="text-2xl font-black">{profile?.followers}</div>
                <div className="text-[10px] uppercase tracking-wider text-gray-400 mt-1">Followers</div>
              </motion.div>
            </div>
          </div>

          {/* Column 2: Top Languages Chart */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between"
          >
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={20} className="text-blue-400" />
              <h3 className="font-bold text-lg">Language Distribution</h3>
            </div>
            <div className="relative h-60 w-full">
              <canvas ref={chartRef}></canvas>
            </div>
          </motion.div>

          {/* Column 3: Featured Repositories */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2 px-1">
              <Github size={20} className="text-teal-400" />
              Featured Repositories
            </h3>

            {stats?.topRepos.map((repo, idx) => (
              <motion.a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.08)" }}
                className="block bg-white/5 border border-white/10 rounded-2xl p-4 transition-all"
              >
                <div className="flex justify-between items-start">
                  <span className="font-extrabold text-sm text-blue-400">{repo.name}</span>
                  <span className="text-[9px] uppercase font-black bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-gray-300">
                    {repo.language}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Star size={12} className="text-yellow-400" /> {repo.stars}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork size={12} className="text-teal-400" /> {repo.forks}
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
