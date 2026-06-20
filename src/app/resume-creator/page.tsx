"use client";

import React, { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, FileText, Cpu, CheckCircle, AlertTriangle, ArrowLeft } from "lucide-react";
import LoginModal from "../components/LoginModal";
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_GREYMATTER_API_URL || "http://localhost:8000";

export default function ResumeCreator() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [provider, setProvider] = useState<"gemini" | "grok">("gemini");

  // Execution State
  const [generating, setGenerating] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingUser(false);
    });
    return () => unsubscribe();
  }, []);

  const steps = [
    "Initializing multi-agent workflow...",
    "Analyzing target job description for key requirements...",
    "Running gap analysis against your master resume...",
    "Refactoring resume metrics and terminology...",
    "Compiling tailored PDF dossier..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (generating && step < steps.length - 1) {
      interval = setInterval(() => {
        setStep((prev) => prev + 1);
      }, 5000); // Progress step every 5 seconds
    }
    return () => clearInterval(interval);
  }, [generating, step]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setGenerating(true);
    setStep(0);
    setError(null);

    try {
      // Get fresh Firebase ID Token
      const token = await user.getIdToken(true);

      const formData = new URLSearchParams();
      formData.append("title", title);
      formData.append("company", company);
      formData.append("description", description);
      formData.append("provider", provider);

      const response = await fetch(`${API_BASE_URL}/generate`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "Resume tailoring failed");
      }

      // Retrieve PDF Blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Sujeet_Hiremath_${company.replace(/\s+/g, "_")}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      // Finish generation
      setStep(steps.length);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during resume generation.");
    } finally {
      setGenerating(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white/5 border border-white/10 rounded-3xl p-8 text-center backdrop-blur-xl shadow-2xl"
        >
          <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-3">Authentication Required</h2>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            The Resume Creator is locked for public access. Please sign in with your administrator credentials to access the tailoring interface.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setIsLoginOpen(true)}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/20"
            >
              Log In
            </button>
            <Link 
              href="/"
              className="w-full py-3.5 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-2xl border border-white/5 transition-all text-sm flex items-center justify-center gap-2"
            >
              <ArrowLeft size={16} />
              Return to Portfolio
            </Link>
          </div>
          <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Grey Matter: Ghost Scribe
            </h1>
            <p className="text-gray-400 text-sm mt-1">Autonomous Resume Tailoring & Alignment Engine</p>
          </div>
          <Link 
            href="/"
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-white transition-colors bg-white/5 border border-white/5 px-4 py-2.5 rounded-full"
          >
            <ArrowLeft size={14} />
            Back to Site
          </Link>
        </div>

        {/* Status / Error Boxes */}
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex gap-3 items-start text-rose-300 text-sm">
            <AlertTriangle className="flex-shrink-0 mt-0.5" size={18} />
            <div>
              <span className="font-bold">Generation Error:</span> {error}
            </div>
          </div>
        )}

        {/* Loading Execution Screen */}
        {generating && (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-8 backdrop-blur-xl shadow-2xl">
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                <Cpu className="absolute inset-0 m-auto text-purple-400 animate-pulse" size={28} />
              </div>
              <h3 className="text-lg font-bold mb-2">Deploying Architect Agent</h3>
              <p className="text-gray-400 text-sm max-w-md mb-8">
                The agent is currently matching your experiences to the target job description. This may take up to a minute...
              </p>

              {/* Progress Steps */}
              <div className="w-full max-w-md space-y-4 text-left">
                {steps.map((s, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${
                      step > idx 
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                        : step === idx
                          ? "border-purple-500 text-purple-400 animate-pulse bg-purple-500/5"
                          : "border-gray-700 text-gray-500"
                    }`}>
                      {step > idx ? "✓" : idx + 1}
                    </div>
                    <span className={`text-xs ${
                      step === idx 
                        ? "text-purple-400 font-bold"
                        : step > idx 
                          ? "text-gray-300"
                          : "text-gray-500"
                    }`}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Successful generation complete message */}
        {!generating && step === steps.length && (
          <div className="mb-8 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex gap-4 items-center justify-between">
            <div className="flex gap-3 items-center">
              <CheckCircle className="text-emerald-400" size={24} />
              <div>
                <h4 className="font-bold text-emerald-300">Resume Tailored Successfully!</h4>
                <p className="text-gray-400 text-xs mt-0.5">Check your downloads folder for the generated PDF.</p>
              </div>
            </div>
            <button
              onClick={() => setStep(0)}
              className="text-xs font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 bg-emerald-500/5 border border-emerald-500/20 px-4 py-2 rounded-xl transition-all"
            >
              Generate Another
            </button>
          </div>
        )}

        {/* Input Form */}
        {!generating && (step === 0 || step === steps.length) && (
          <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Target Job Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Software Engineer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-gray-600 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-gray-600 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">AI Model Provider</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setProvider("gemini")}
                  className={`py-3.5 rounded-2xl border text-sm font-bold transition-all flex flex-col items-center justify-center ${
                    provider === "gemini"
                      ? "bg-blue-600/10 border-blue-500 text-blue-400"
                      : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  <span>Gemini 2.5 Flash</span>
                  <span className="text-[10px] font-medium opacity-70 mt-0.5">Free API Tier</span>
                </button>
                <button
                  type="button"
                  onClick={() => setProvider("grok")}
                  className={`py-3.5 rounded-2xl border text-sm font-bold transition-all flex flex-col items-center justify-center ${
                    provider === "grok"
                      ? "bg-purple-600/10 border-purple-500 text-purple-400"
                      : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  <span>Grok 4</span>
                  <span className="text-[10px] font-medium opacity-70 mt-0.5">Requires xAI API Key</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Full Job Description</label>
              <textarea
                required
                rows={10}
                placeholder="Paste the full text of the job description here..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-600 focus:border-blue-500 outline-none transition-all resize-none font-sans text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-95 text-white font-bold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Cpu size={18} />
              Deploy Architect Agent
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
