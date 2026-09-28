"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Power,
  Cpu,
  Brain,
  Server,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Bell,
  BellOff,
  Radio,
  Zap,
  ShieldAlert,
  Loader2,
  HardDrive
} from "lucide-react";

export interface CameraAIStatus {
  enabled: boolean;
  desired_state: "ON" | "OFF" | string;
  status: "running" | "stopped" | "degraded" | string;
  components: {
    camera: string;
    frigate: string;
    mqtt: string;
    bridge: string;
    ai_server: string;
    ai_model: string;
  };
  last_event: string | null;
  updated_at: string | null;
  updated_by: string | null;
  last_action: string | null;
  error: string | null;
}

interface CameraAIControlCardProps {
  token: string | null;
}

export default function CameraAIControlCard({ token }: CameraAIControlCardProps) {
  const [statusData, setStatusData] = useState<CameraAIStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [transitioning, setTransitioning] = useState<"starting" | "stopping" | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const fetchStatus = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/stratus/camera-ai/status", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error(`Status check returned HTTP ${res.status}`);
      }
      const data = await res.json();
      setStatusData(data);
      setErrorMsg(null);
    } catch (err: any) {
      console.error("Failed to fetch camera AI status:", err);
      setErrorMsg(err.message || "Failed to reach Camera AI service");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Initial load and periodic polling
  useEffect(() => {
    fetchStatus();
    // Poll every 4s if transitioning, else every 8s
    const interval = setInterval(fetchStatus, transitioning ? 3000 : 8000);
    return () => clearInterval(interval);
  }, [fetchStatus, transitioning]);

  const handleAction = async (action: "start" | "stop") => {
    if (!token) return;
    setShowConfirmModal(false);
    setTransitioning(action === "start" ? "starting" : "stopping");
    setErrorMsg(null);

    try {
      const res = await fetch("/api/stratus/camera-ai/control", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || `Control action failed (HTTP ${res.status})`);
      }

      setStatusData(result);
    } catch (err: any) {
      console.error(`Failed to execute ${action}:`, err);
      setErrorMsg(err.message || `Failed to ${action} Camera AI pipeline`);
    } finally {
      // Re-verify after action completes
      await fetchStatus();
      setTransitioning(null);
    }
  };

  const isRunning = statusData?.status === "running";
  const isStopped = statusData?.status === "stopped";
  const isDegraded = statusData?.status === "degraded";

  const formatTimestamp = (isoString?: string | null) => {
    if (!isoString) return "Never";
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="bg-[#0b101b] border border-[#182338] rounded-3xl overflow-hidden shadow-2xl relative">
      {/* Top Banner / Header */}
      <div className="px-6 py-4 border-b border-[#141d2c] flex items-center justify-between flex-wrap gap-4 bg-gradient-to-r from-[#0d1424] to-[#0a0f1d]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Brain size={22} className={isRunning ? "animate-pulse text-emerald-400" : "text-gray-400"} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold tracking-wider uppercase text-gray-200">
                AI Vision & Notification Pipeline
              </h2>
              {/* Status Pill */}
              {loading ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-gray-400 flex items-center gap-1">
                  <Loader2 size={10} className="animate-spin" /> Checking
                </span>
              ) : isRunning ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  ONLINE • ACTIVE
                </span>
              ) : isStopped ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  OFF • STANDBY
                </span>
              ) : isDegraded ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center gap-1 font-bold">
                  <AlertTriangle size={10} />
                  DEGRADED
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
                  UNKNOWN
                </span>
              )}
            </div>
            <p className="text-[11px] font-mono text-gray-400 mt-0.5">
              Frigate Motion Engine • Gemma 3 12B Vision (Mac mini) • ntfy Bridge
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchStatus()}
            disabled={loading || !!transitioning}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all disabled:opacity-40"
            title="Refresh status"
          >
            <RefreshCw size={15} className={loading || transitioning ? "animate-spin" : ""} />
          </button>

          {isRunning ? (
            <button
              onClick={() => setShowConfirmModal(true)}
              disabled={!!transitioning}
              className="px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 hover:text-rose-200 text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-lg shadow-rose-950/30 disabled:opacity-50"
            >
              {transitioning === "stopping" ? (
                <>
                  <Loader2 size={14} className="animate-spin text-rose-400" />
                  <span>Stopping AI Pipeline...</span>
                </>
              ) : (
                <>
                  <Power size={14} className="text-rose-400" />
                  <span>Turn AI Pipeline OFF</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => handleAction("start")}
              disabled={!!transitioning}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {transitioning === "starting" ? (
                <>
                  <Loader2 size={14} className="animate-spin text-black" />
                  <span>Starting AI Pipeline...</span>
                </>
              ) : (
                <>
                  <Power size={14} />
                  <span>Turn AI Pipeline ON</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Error alert if any */}
      {errorMsg && (
        <div className="bg-rose-500/10 border-b border-rose-500/20 px-6 py-2.5 flex items-center gap-2 text-rose-300 text-xs font-mono">
          <AlertTriangle size={14} className="text-rose-400 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Components Grid */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        {/* Frigate NVR */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 uppercase text-[10px] tracking-wider">Detection Engine</span>
              {statusData?.components.frigate === "running" ? (
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                  <CheckCircle2 size={13} /> Active
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] text-gray-500">
                  <XCircle size={13} /> Stopped
                </span>
              )}
            </div>
            <div className="text-gray-200 font-bold flex items-center gap-1.5">
              <Server size={14} className="text-cyan-400" />
              Frigate NVR 0.14
            </div>
            <div className="text-gray-400 text-[11px] mt-1">CSI-2 motion & zone analysis</div>
          </div>
          <div className="text-[10px] text-gray-500 mt-3 pt-2 border-t border-white/5">
            Port 5000 • Pi 5 Container
          </div>
        </div>

        {/* Mac mini Vision AI */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 uppercase text-[10px] tracking-wider">Mac mini AI Server</span>
              {statusData?.components.ai_model === "loaded" ? (
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                  <CheckCircle2 size={13} /> Loaded
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] text-amber-400/80">
                  <HardDrive size={13} /> Unloaded (0 GB)
                </span>
              )}
            </div>
            <div className="text-gray-200 font-bold flex items-center gap-1.5">
              <Brain size={14} className="text-purple-400" />
              Gemma 3 12B Vision
            </div>
            <div className="text-gray-400 text-[11px] mt-1">OMLX MLX-VLM 4-bit Quantized</div>
          </div>
          <div className="text-[10px] text-gray-500 mt-3 pt-2 border-t border-white/5">
            Port 8000 • Apple Silicon M4
          </div>
        </div>

        {/* MQTT & Bridge */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 uppercase text-[10px] tracking-wider">Event & Push Bridge</span>
              {statusData?.components.bridge === "running" ? (
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                  <CheckCircle2 size={13} /> Armed
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] text-gray-500">
                  <XCircle size={13} /> Inactive
                </span>
              )}
            </div>
            <div className="text-gray-200 font-bold flex items-center gap-1.5">
              {statusData?.components.bridge === "running" ? (
                <Bell size={14} className="text-amber-400" />
              ) : (
                <BellOff size={14} className="text-gray-500" />
              )}
              Mosquitto + ntfy Bridge
            </div>
            <div className="text-gray-400 text-[11px] mt-1">Real-time push with photo snapshot</div>
          </div>
          <div className="text-[10px] text-gray-500 mt-3 pt-2 border-t border-white/5">
            Camera Events Topic • Stratus
          </div>
        </div>

        {/* Resource Efficiency Status */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 uppercase text-[10px] tracking-wider">System Impact</span>
              <span className="text-[10px] text-cyan-400/90 font-bold">
                {isRunning ? "SURVEILLANCE" : "POWER SAVER"}
              </span>
            </div>
            <div className="text-gray-200 font-bold flex items-center gap-1.5">
              <Cpu size={14} className={isRunning ? "text-emerald-400" : "text-gray-400"} />
              {isRunning ? "Real-time AI Ingestion" : "Resources Reclaimed"}
            </div>
            <div className="text-gray-400 text-[11px] mt-1 leading-snug">
              {isRunning
                ? "Active zero-shot detection. Low CPU (<10%) & zero disk bloat."
                : "Saved ~1.8GB RAM on Pi & ~7.8GB Unified Memory on Mac mini."}
            </div>
          </div>
          <div className="text-[10px] text-gray-500 mt-3 pt-2 border-t border-white/5">
            Live Stream (port 8000): Always ON
          </div>
        </div>
      </div>

      {/* Footer Info Bar */}
      <div className="px-6 py-3 bg-[#080c15] border-t border-[#141d2c] flex items-center justify-between flex-wrap gap-3 font-mono text-[11px] text-gray-400">
        <div className="flex items-center gap-4 flex-wrap">
          <span>
            Desired:{" "}
            <span className={statusData?.desired_state === "ON" ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
              {statusData?.desired_state || "UNKNOWN"}
            </span>
          </span>
          <span className="text-white/10">•</span>
          <span>
            Last Action:{" "}
            <span className="text-gray-200 capitalize">
              {statusData?.last_action || "None"}
            </span>
          </span>
          <span className="text-white/10">•</span>
          <span>
            Updated:{" "}
            <span className="text-gray-300">
              {formatTimestamp(statusData?.updated_at)}
            </span>
          </span>
          {statusData?.updated_by && (
            <>
              <span className="text-white/10">•</span>
              <span className="text-gray-400 truncate max-w-[200px]">
                By: {statusData.updated_by}
              </span>
            </>
          )}
        </div>
        <div className="text-[10px] text-gray-500 flex items-center gap-1.5">
          <Zap size={11} className="text-emerald-400" />
          Hardware camera unaffected during toggle
        </div>
      </div>

      {/* Confirmation Modal for Turning OFF */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md w-full bg-[#0e1422] border border-[#1e2a40] rounded-3xl p-6 shadow-2xl font-sans"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
                <ShieldAlert size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Turn Off Camera AI Pipeline?
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                This will gracefully stop Frigate motion detection, Mosquitto MQTT, and the notification bridge on Stratus, and unload Gemma 3 12B from Mac mini unified memory.
              </p>
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl mb-6 text-[11px] font-mono text-emerald-400 flex items-center gap-2">
                <Radio size={14} className="flex-shrink-0" />
                <span>Note: The live camera & audio feed above will continue streaming normally.</span>
              </div>
              <div className="flex items-center justify-end gap-3 font-mono text-xs">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAction("stop")}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-lg shadow-rose-900/30 flex items-center gap-2"
                >
                  <Power size={14} />
                  Confirm Power Off
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
