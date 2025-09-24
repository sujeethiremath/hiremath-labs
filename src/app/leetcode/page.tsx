"use client";

import { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";
import { User, Medal, Dumbbell, PieChart, Moon, Sun } from "lucide-react";

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

// Use a CSS-in-JS solution for simplicity in a single file
const cardStyle =
  "relative bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 flex flex-col items-center justify-center text-center transition-all duration-300 transform hover:scale-[1.01] hover:shadow-xl";
const headingStyle =
  "text-xl sm:text-2xl font-bold mb-4 text-gray-900 dark:text-white";

// Helper function to get color based on difficulty
const getColor = (difficulty: string): string => {
  switch (difficulty) {
    case "Easy":
      return "#4caf50"; // Green
    case "Medium":
      return "#ff9800"; // Orange
    case "Hard":
      return "#f44336"; // Red
    default:
      return "#9e9e9e"; // Gray
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
  const percentage = total > 0 ? ((solved / total) * 100).toFixed(1) : 0;
  return (
    <div className="w-full mb-3 last:mb-0">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
          {solved} / {total} ({percentage}%)
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="h-2.5 rounded-full"
          style={{
            width: `${percentage}%`,
            backgroundColor: getColor(label),
          }}
        ></div>
      </div>
    </div>
  );
};

// Main App Component
export default function App() {
  const [data, setData] = useState<LeetCodeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    // Check local storage for dark mode preference
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newMode;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/leetcode-data");
        if (!response.ok) {
          // Mock data fallback if API is not running or fails
          const mockData: LeetCodeData = {
            solvedCounts: [
              { difficulty: "Easy", count: 150 },
              { difficulty: "Medium", count: 80 },
              { difficulty: "Hard", count: 25 },
            ],
            // Re-added mock data for allQuestionsCount
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
      const colorPalette = labels.map(
        (_, i) => `hsl(${(i * 50) % 360},70%,50%)`
      );

      const chartData = {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: colorPalette,
            borderColor: isDarkMode ? "#1f2937" : "#f3f4f6",
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
          cutout: "60%", // gives a nicer “ring” look
          plugins: {
            legend: {
              position: "right" as const,
              labels: { color: isDarkMode ? "#cbd5e1" : "#4b5563" },
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
  }, [data, isDarkMode]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        <div className="text-xl font-semibold">
          Loading your LeetCode data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-red-500 text-center p-4 transition-colors duration-300">
        <div className="text-xl font-semibold">Error: {error}</div>
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Please check your LeetCode username or try again later.
        </div>
      </div>
    );
  }

  const { solvedCounts = [], skillStats = [] } = data || {};
  const easySolved =
    solvedCounts.find((d) => d.difficulty === "Easy")?.count || 0;
  const mediumSolved =
    solvedCounts.find((d) => d.difficulty === "Medium")?.count || 0;
  const hardSolved =
    solvedCounts.find((d) => d.difficulty === "Hard")?.count || 0;
  const totalSolved = easySolved + mediumSolved + hardSolved;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8 flex flex-col items-center transition-colors duration-300">
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white shadow-md transition-transform duration-300 hover:scale-110"
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="container max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* LeetCode Dashboard Card */}
        <div className={`col-span-1 md:col-span-2 lg:col-span-3 ${cardStyle} `}>
          <div className="flex flex-col md:flex-row items-center justify-between w-full">
            <div className="flex flex-col items-center md:items-start text-left md:w-1/3">
              <div className="rounded-full bg-blue-500 p-2 text-white">
                <User size={36} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mt-4 text-gray-900 dark:text-white">
                hiremath09
              </h2>
              <div className="flex items-center mt-2 text-gray-600 dark:text-gray-300">
                <Medal size={16} className="mr-1" />
                <span>Rank: N/A</span>{" "}
                {/* Replace with actual rank data if available */}
              </div>
            </div>
            <div className="md:w-2/3 mt-6 md:mt-0 flex flex-col justify-center">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white text-center">
                Problem-Solving Progress
              </h3>
              <div className="w-full max-w-lg mx-auto">
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
            </div>
          </div>
        </div>

        {/* Algorithmic Skills Doughnut Chart */}
        <div className={`lg:col-span-2 ${cardStyle} `}>
          <div className="flex flex-col w-full h-full">
            <div className="flex items-center mb-4">
              <PieChart size={24} className="mr-2 text-purple-500" />
              <h2 className={headingStyle}>Algorithmic Skills</h2>
            </div>
            <div className="relative flex-grow h-64 sm:h-80 md:h-96">
              <canvas ref={chartRef}></canvas>
            </div>
          </div>
        </div>

        {/* Solved Problems Summary Card */}
        <div className={`${cardStyle} flex-grow`}>
          <div className="flex items-center mb-4">
            <Dumbbell size={24} className="mr-2 text-green-500" />
            <h2 className={headingStyle}>Solved Problems</h2>
          </div>
          <div className="w-full flex justify-between text-gray-600 dark:text-gray-300">
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-green-500">
                {easySolved}
              </div>
              <div className="text-sm">Easy</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-orange-500">
                {mediumSolved}
              </div>
              <div className="text-sm">Medium</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-red-500">
                {hardSolved}
              </div>
              <div className="text-sm">Hard</div>
            </div>
          </div>
          <div className="text-center mt-4">
            <div className="text-4xl font-extrabold text-blue-500">
              {totalSolved}
            </div>
            <div className="text-lg text-gray-700 dark:text-gray-200">
              Total Solved
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
