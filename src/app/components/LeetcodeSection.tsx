"use client";

import { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";
import { User, Dumbbell, PieChart } from "lucide-react";
import { motion } from "framer-motion";

// Define the types for your data to ensure type safety with TypeScript
interface SolvedCount {
  difficulty: string;
  count: number;
}

interface AllQuestionCount {
  difficulty: string;
  count: number;
}

interface SkillStat {
  tagName: string;
  problemsSolved: number;
}

interface LeetCodeData {
  solvedCounts: SolvedCount[];
  allQuestionsCount: AllQuestionCount[];
  skillStats: SkillStat[];
}

// Helper function to get color based on difficulty
const getColor = (difficulty: string): string => {
  switch (difficulty) {
    case "Easy":
      return "#4ade80"; // Light Green
    case "Medium":
      return "#facc15"; // Light Yellow
    case "Hard":
      return "#f87171"; // Light Red
    default:
      return "#94a3b8"; // Slate Gray
  }
};

// Component for a styled progress bar
const ProgressBar = ({
  label,
  solved,
  total,
}: {
  label: string;
  solved: number;
  total: number;
}) => {
  // Use a fallback of 1 if total is 0 to avoid division by zero
  const safeTotal = total > 0 ? total : 1;
  const percentage = ((solved / safeTotal) * 100).toFixed(1);

  return (
    <div className="w-full mb-3 last:mb-0">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-200">{label}</span>
        <span className="text-xs font-semibold text-gray-400">
          {solved} / {total} ({percentage}%)
        </span>
      </div>
      <div className="w-full bg-gray-700/50 rounded-full h-2.5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-2.5 rounded-full"
          style={{
            backgroundColor: getColor(label),
          }}
        ></motion.div>
      </div>
    </div>
  );
};

// Main LeetcodeSection Component
export default function LeetcodeSection() {
  const [data, setData] = useState<LeetCodeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/leetcode-data");
        if (!response.ok) {
          const mockData: LeetCodeData = {
            solvedCounts: [
              { difficulty: "Easy", count: 150 },
              { difficulty: "Medium", count: 80 },
              { difficulty: "Hard", count: 25 },
            ],
            allQuestionsCount: [
              { difficulty: "Easy", count: 800 },
              { difficulty: "Medium", count: 1600 },
              { difficulty: "Hard", count: 350 },
            ],
            skillStats: [
              { tagName: "Arrays", problemsSolved: 120 },
              { tagName: "Strings", problemsSolved: 90 },
              { tagName: "Dynamic Programming", problemsSolved: 45 },
              { tagName: "Data Structures", problemsSolved: 110 },
              { tagName: "Graph Theory", problemsSolved: 0 },
            ],
          };
          setData(mockData);
        } else {
          const result: LeetCodeData = await response.json();
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

      const relevantSkills = (data.skillStats || [])
        .filter((s) => s.problemsSolved > 0)
        .sort((a, b) => b.problemsSolved - a.problemsSolved)
        .slice(0, 6);

      const labels = relevantSkills.map((s) => s.tagName);
      const values = relevantSkills.map((s) => s.problemsSolved);
      const colorPalette = [
        "#f87171", // Red
        "#facc15", // Yellow
        "#4ade80", // Green
        "#60a5fa", // Blue
        "#a855f7", // Purple
        "#f472b6", // Pink
      ];

      const chartData = {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: colorPalette,
            borderColor: "#1f2937",
            borderWidth: 2,
          },
        ],
      };

      chartInstance.current = new Chart(chartRef.current, {
        type: "doughnut",
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "60%",
          plugins: {
            legend: {
              position: "right" as const,
              labels: { color: "#cbd5e1" },
            },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const label = ctx.label || "";
                  const value = ctx.raw as number;
                  const total = ctx.dataset.data.reduce(
                    (a, c) => a + (c as number),
                    0
                  );
                  const pct =
                    total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                  return `${label}: ${value} (${pct}%)`;
                },
              },
            },
          },
        },
      });
    }
    return () => chartInstance.current?.destroy();
  }, [data]);

  if (loading) {
    return (
      <section id="leetcode" className="py-16 px-4">
        <div className="flex items-center justify-center min-h-screen text-gray-400">
          <div className="text-xl font-semibold">
            Loading your LeetCode data...
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="leetcode" className="py-16 px-4">
        <div className="flex items-center justify-center min-h-screen text-red-400 text-center p-4">
          <div className="text-xl font-semibold">Error: {error}</div>
          <div className="mt-2 text-sm text-gray-400">
            Please check your LeetCode username or try again later.
          </div>
        </div>
      </section>
    );
  }

  const {
    solvedCounts = [],
    allQuestionsCount = [],
    skillStats = [],
  } = data || {};
  const easySolved =
    solvedCounts.find((d) => d.difficulty === "Easy")?.count || 0;
  const mediumSolved =
    solvedCounts.find((d) => d.difficulty === "Medium")?.count || 0;
  const hardSolved =
    solvedCounts.find((d) => d.difficulty === "Hard")?.count || 0;
  const totalSolved = easySolved + mediumSolved + hardSolved;
  const totalQuestions =
    allQuestionsCount.reduce((sum, q) => sum + q.count, 0) || 0;

  return (
    <section id="leetcode" className="py-16 px-4 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          LeetCode Progress
        </h2>
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Solved Problems Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            // Add whileHover animation
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
            }}
            className="relative bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/10 text-white flex flex-col justify-between"
          >
            <div className="flex items-center mb-6">
              <Dumbbell size={28} className="mr-3 text-blue-400" />
              <h3 className="text-2xl font-bold">Solved Problems</h3>
            </div>
            <div className="w-full flex justify-between text-gray-300 mb-6">
              <div className="text-center p-2">
                <div className="text-3xl font-extrabold text-green-400">
                  {easySolved}
                </div>
                <div className="text-sm text-gray-400">Easy</div>
              </div>
              <div className="text-center p-2">
                <div className="text-3xl font-extrabold text-yellow-400">
                  {mediumSolved}
                </div>
                <div className="text-sm text-gray-400">Medium</div>
              </div>
              <div className="text-center p-2">
                <div className="text-3xl font-extrabold text-red-400">
                  {hardSolved}
                </div>
                <div className="text-sm text-gray-400">Hard</div>
              </div>
            </div>
            <div className="text-center mt-auto">
              <div className="text-5xl font-extrabold text-white">
                {totalSolved}
              </div>
              <div className="text-lg text-gray-400">Total Solved</div>
            </div>
          </motion.div>

          {/* Progress Bars Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            // Add whileHover animation
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
            }}
            className="relative bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/10 text-white flex flex-col justify-between lg:col-span-2"
          >
            <div className="flex items-center mb-6">
              <User size={28} className="mr-3 text-purple-400" />
              <h3 className="text-2xl font-bold">Progress Overview</h3>
            </div>
            <div className="w-full">
              <ProgressBar
                label="Easy"
                solved={easySolved}
                total={totalSolved}
              />
              <ProgressBar
                label="Medium"
                solved={mediumSolved}
                total={totalSolved}
              />
              <ProgressBar
                label="Hard"
                solved={hardSolved}
                total={totalSolved}
              />
            </div>
          </motion.div>

          {/* Algorithmic Skills Doughnut Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            // Add whileHover animation
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
            }}
            className="relative bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/10 text-white lg:col-span-2 flex flex-col"
          >
            <div className="flex items-center mb-6">
              <PieChart size={28} className="mr-3 text-teal-400" />
              <h3 className="text-2xl font-bold">Algorithmic Skills</h3>
            </div>
            <div className="flex-grow flex items-center justify-center h-80">
              <canvas ref={chartRef}></canvas>
            </div>
          </motion.div>

          {/* Total Questions Solved Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            // Add whileHover animation
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
            }}
            className="relative bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/10 text-white flex flex-col justify-center items-center text-center"
          >
            <h3 className="text-2xl font-bold mb-4">Total Solved</h3>
            <div className="text-6xl font-extrabold text-blue-400">
              {totalSolved}
            </div>
            <p className="mt-2 text-lg text-gray-400">
              out of {totalQuestions}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
