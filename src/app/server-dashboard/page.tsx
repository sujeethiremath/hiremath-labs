"use client";

import React, { useState, useEffect, useRef } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../lib/firebase";
import { motion } from "framer-motion";
import { Lock, ArrowLeft, RefreshCw, Radio } from "lucide-react";
import LoginModal from "../components/LoginModal";
import Link from "next/link";

interface StratusMetrics {
  timestamp: string;
  system: {
    hostname: string;
    model: string;
    kernel: string;
    uptime: string;
    uptime_seconds: number;
    health: string;
    warnings: string[];
  };
  cpu: {
    percent: number;
    cores: number[];
    frequency_mhz: number;
    load_avg: number[];
    temperature: number;
  };
  memory: {
    total_mb: number;
    used_mb: number;
    available_mb: number;
    percent: number;
  };
  storage: Array<{
    path: string;
    label: string;
    total_gb: number;
    used_gb: number;
    free_gb: number;
    percent: number;
  }>;
  network: {
    ip: string;
    interface: string;
    status: string;
    rx_speed_kb: number;
    tx_speed_kb: number;
  };
  hardware: {
    camera: string;
    camera_model?: string;
    pironman: string;
    fan_mode: string;
    fan_speed: string;
    oled: string;
    rgb_style: string;
    audio: string;
  };
}

export default function ServerDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const [metrics, setMetrics] = useState<StratusMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [clock, setClock] = useState("00:00:00");
  const [dateStr, setDateStr] = useState("---, --- --");
  const [syncing, setSyncing] = useState(false);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingUser(false);
    });
    return () => unsubscribe();
  }, []);

  // Live Local Clock
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setClock(now.toTimeString().split(" ")[0]);
      setDateStr(now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Telemetry Poller
  const fetchTelemetry = async () => {
    if (!user) return;
    try {
      setSyncing(true);
      const token = await user.getIdToken();
      const res = await fetch("/api/stratus/status", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Telemetry request failed (HTTP ${res.status})`);
      }

      const data: StratusMetrics = await res.json();
      setMetrics(data);
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Failed to reach Stratus telemetry service");
    } finally {
      setTimeout(() => setSyncing(false), 250);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchTelemetry();
    const poller = setInterval(fetchTelemetry, 1000);
    return () => clearInterval(poller);
  }, [user]);

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-[#07090e] text-white flex items-center justify-center font-mono">
        <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#07090e] text-white flex items-center justify-center px-4 font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-[#0f141f] border border-[#1c2638] rounded-3xl p-8 text-center backdrop-blur-xl shadow-2xl"
        >
          <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock size={30} />
          </div>
          <h2 className="text-2xl font-bold mb-3 tracking-wide">Administrator Authentication</h2>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            The Stratus Command Dashboard is private hardware telemetry. Please log in with your administrator account to connect to the live server.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setIsLoginOpen(true)}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:opacity-90 text-white font-bold rounded-2xl transition-all shadow-lg shadow-cyan-500/20 text-sm"
            >
              Authenticate & Connect
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

  const cpuPct = metrics?.cpu.percent ?? 0;
  const memPct = metrics?.memory.percent ?? 0;
  const memUsedMb = metrics?.memory.used_mb ?? 0;
  const memAvailGb = metrics ? (metrics.memory.available_mb / 1024).toFixed(1) : "--";
  const tempVal = metrics?.cpu.temperature ?? 0;
  const disk0 = metrics?.storage[0];
  const disk1 = metrics?.storage[1];

  return (
    <div className="min-h-screen bg-[#07090e] text-[#f0f6fc] pt-20 pb-12 px-4 md:px-8 font-mono select-none">
      {/* Top Nav Breadcrumb */}
      <div className="max-w-[840px] mx-auto mb-4 flex items-center justify-between text-xs">
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors bg-[#0f141f] border border-[#1c2638] px-3.5 py-1.5 rounded-full"
        >
          <ArrowLeft size={14} />
          <span>Back to Site</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/camera"
            className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-white transition-colors bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-full"
          >
            <Radio size={12} className="animate-pulse" />
            <span>Live Camera</span>
          </Link>
          <button
            onClick={fetchTelemetry}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white bg-[#0f141f] border border-[#1c2638] px-3 py-1.5 rounded-full transition-all"
          >
            <RefreshCw size={12} className={syncing ? "animate-spin text-cyan-400" : ""} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Main 800x480 Visual Frame */}
      <div className="max-w-[840px] mx-auto bg-[#07090e] border border-[#1c2638] rounded-2xl p-3 md:p-4 shadow-2xl shadow-cyan-950/20">
        {/* Command Header */}
        <header className="flex items-center justify-between border-b border-[#1c2638] pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#00f0ff] animate-pulse" />
            <h1 className="text-base font-extrabold tracking-[2px] text-white">STRATUS</h1>
            <span className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold px-2 py-0.5 rounded">
              PI 5 &bull; 16GB
            </span>
          </div>

          <div className="flex items-center gap-2 bg-[#0f141f] border border-[#1c2638] px-3 py-1 rounded-full">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#00ff88]" />
            <span className="text-[11px] font-bold text-emerald-300">
              {metrics?.system.health || "SYSTEM OPTIMAL"}
            </span>
          </div>

          <div className="text-right">
            <div className="text-xs font-bold text-white tracking-wider">{clock}</div>
            <div className="text-[10px] text-gray-400">
              <span>{dateStr}</span> &bull; <span className="text-cyan-400">UP: {metrics?.system.uptime || "--"}</span>
            </div>
          </div>
        </header>

        {/* 7-Card Telemetry Grid */}
        <main className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {/* Card 1: CPU */}
          <section className="bg-[#0f141f] border border-[#1c2638] rounded-xl p-3 flex flex-col justify-between hover:border-[#2d3e5c] transition-all">
            <div className="flex justify-between items-center text-[10px] text-gray-400 border-b border-white/5 pb-1 mb-2">
              <span className="font-bold tracking-wider text-gray-300">CPU PROCESSOR</span>
              <span>{metrics?.cpu.frequency_mhz || 2400} MHz</span>
            </div>
            <div className="flex items-end justify-between my-1">
              <span className="text-3xl font-black text-cyan-400">{cpuPct.toFixed(0)}%</span>
              <div className="flex items-end gap-1.5 h-10">
                {(metrics?.cpu.cores || [0, 0, 0, 0]).map((core, i) => (
                  <div key={i} className="flex flex-col items-center gap-0.5">
                    <div className="w-2 h-8 bg-black/40 rounded-sm overflow-hidden flex flex-col justify-end">
                      <div
                        className="w-full bg-gradient-to-t from-cyan-500 to-emerald-400 transition-all duration-500"
                        style={{ height: `${Math.min(100, Math.max(5, core))}%` }}
                      />
                    </div>
                    <span className="text-[8px] text-gray-500">C{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden my-2">
              <div className="bg-cyan-400 h-full transition-all duration-300" style={{ width: `${cpuPct}%` }} />
            </div>
            <div className="flex justify-between text-[9px] text-gray-400">
              <span>Load: <b className="text-gray-300">{metrics?.cpu.load_avg.join(" ") || "0.00 0.00 0.00"}</b></span>
              <span>Gov: <b className="text-gray-300">schedutil</b></span>
            </div>
          </section>

          {/* Card 2: Memory */}
          <section className="bg-[#0f141f] border border-[#1c2638] rounded-xl p-3 flex flex-col justify-between hover:border-[#2d3e5c] transition-all">
            <div className="flex justify-between items-center text-[10px] text-gray-400 border-b border-white/5 pb-1 mb-2">
              <span className="font-bold tracking-wider text-gray-300">SYSTEM MEMORY</span>
              <span>16 GB RAM</span>
            </div>
            <div className="flex items-end justify-between my-1">
              <span className="text-3xl font-black text-purple-400">{memPct.toFixed(1)}%</span>
              <div className="text-right">
                <span className="text-sm font-bold text-white block">{memUsedMb} MB</span>
                <span className="text-[9px] text-gray-500">USED</span>
              </div>
            </div>
            <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden my-2">
              <div className="bg-purple-400 h-full transition-all duration-300" style={{ width: `${memPct}%` }} />
            </div>
            <div className="flex justify-between text-[9px] text-gray-400">
              <span>Avail: <b className="text-gray-300">{memAvailGb} GB</b></span>
              <span>Swap: <b className="text-gray-300">2.0 GB</b></span>
            </div>
          </section>

          {/* Card 3: Thermals & Fans */}
          <section className="bg-[#0f141f] border border-[#1c2638] rounded-xl p-3 flex flex-col justify-between hover:border-[#2d3e5c] transition-all">
            <div className="flex justify-between items-center text-[10px] text-gray-400 border-b border-white/5 pb-1 mb-2">
              <span className="font-bold tracking-wider text-gray-300">THERMALS & FANS</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {tempVal < 60 ? "COOL" : tempVal < 75 ? "WARM" : "HOT"}
              </span>
            </div>
            <div className="flex items-end justify-between my-1">
              <span className="text-3xl font-black text-amber-400">{tempVal.toFixed(1)}&deg;C</span>
              <div className="text-right">
                <span className="text-xs font-bold text-white block">{metrics?.hardware.fan_mode || "PWM AUTO"}</span>
                <span className="text-[9px] text-gray-500">TOWER COOLER</span>
              </div>
            </div>
            <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden my-2">
              <div
                className="bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 h-full transition-all duration-300"
                style={{ width: `${Math.min(100, (tempVal / 85) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-gray-400">
              <span>Pironman 5 Pro</span>
              <span>RGB: <b className="text-gray-300">{metrics?.hardware.rgb_style || "BREATHING"}</b></span>
            </div>
          </section>

          {/* Card 4: Dual NVMe Storage */}
          <section className="bg-[#0f141f] border border-[#1c2638] rounded-xl p-3 flex flex-col justify-between hover:border-[#2d3e5c] transition-all">
            <div className="flex justify-between items-center text-[10px] text-gray-400 border-b border-white/5 pb-1 mb-2">
              <span className="font-bold tracking-wider text-gray-300">STORAGE SUBSYSTEM</span>
              <span>DUAL NVMe</span>
            </div>
            <div className="space-y-2 text-[10px]">
              <div>
                <div className="flex justify-between text-gray-400 mb-1">
                  <span>NVMe 0 &bull; OS</span>
                  <span className="text-cyan-400 font-bold">{disk0?.percent.toFixed(1) || 0}%</span>
                </div>
                <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-400 h-full" style={{ width: `${disk0?.percent || 0}%` }} />
                </div>
                <div className="text-[9px] text-gray-500 mt-0.5">{disk0?.used_gb || 0} GB / {disk0?.total_gb || 0} GB</div>
              </div>
              <div>
                <div className="flex justify-between text-gray-400 mb-1">
                  <span>NVMe 1 &bull; Data</span>
                  <span className="text-emerald-400 font-bold">{disk1?.percent.toFixed(1) || 0}%</span>
                </div>
                <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full" style={{ width: `${disk1?.percent || 0}%` }} />
                </div>
                <div className="text-[9px] text-gray-500 mt-0.5">{disk1?.used_gb || 0} GB / {disk1?.total_gb || 0} GB</div>
              </div>
            </div>
          </section>

          {/* Card 5: Network */}
          <section className="bg-[#0f141f] border border-[#1c2638] rounded-xl p-3 flex flex-col justify-between hover:border-[#2d3e5c] transition-all">
            <div className="flex justify-between items-center text-[10px] text-gray-400 border-b border-white/5 pb-1 mb-2">
              <span className="font-bold tracking-wider text-gray-300">NETWORK (eth0)</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {metrics?.network.status || "ONLINE"}
              </span>
            </div>
            <div className="my-1">
              <div className="text-lg font-bold text-white tracking-wide">{metrics?.network.ip || "Connected LAN"}</div>
              <span className="text-[9px] text-gray-500">GIGABIT LAN</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] pt-2 border-t border-white/5">
              <div>
                <div className="text-emerald-400 font-bold">&darr; {metrics?.network.rx_speed_kb.toFixed(1) || 0} KB/s</div>
                <div className="text-[8px] text-gray-500">DOWNLOAD</div>
              </div>
              <div>
                <div className="text-cyan-400 font-bold">&uarr; {metrics?.network.tx_speed_kb.toFixed(1) || 0} KB/s</div>
                <div className="text-[8px] text-gray-500">UPLOAD</div>
              </div>
            </div>
          </section>

          {/* Card 6: Hardware Modules */}
          <section className="bg-[#0f141f] border border-[#1c2638] rounded-xl p-3 flex flex-col justify-between hover:border-[#2d3e5c] transition-all">
            <div className="flex justify-between items-center text-[10px] text-gray-400 border-b border-white/5 pb-1 mb-2">
              <span className="font-bold tracking-wider text-gray-300">HARDWARE MODULES</span>
              <span>PERIPHERALS</span>
            </div>
            <div className="space-y-1.5 text-[10px]">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Camera (CSI)</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  {metrics?.hardware.camera || "READY"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Small OLED (I2C)</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  {metrics?.hardware.oled || "ACTIVE"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">USB Audio DAC</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  {metrics?.hardware.audio || "PCM2902"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">PCIe Gen 2</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-500/10 text-gray-300 border border-gray-500/20">
                  DUAL LINK
                </span>
              </div>
            </div>
          </section>
        </main>

        {/* System Status Footer Bar */}
        <footer className="mt-3 pt-3 border-t border-[#1c2638] flex items-center justify-between text-[10px] text-gray-400">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">ALL SYSTEMS OPERATIONAL</span>
            <div className="flex gap-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-sm bg-cyan-400" />
              ))}
            </div>
          </div>
          <div className="text-[9px] text-gray-500">
            STRATUS RASPBERRY PI 5 COMMAND CENTER
          </div>
        </footer>
      </div>
    </div>
  );
}
