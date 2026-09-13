"use client";

import React, { useState, useEffect, useRef } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lock, 
  ArrowLeft, 
  RefreshCw, 
  Camera, 
  Maximize2, 
  Minimize2, 
  Download, 
  Activity, 
  ShieldCheck, 
  AlertCircle,
  Radio,
  Volume2,
  VolumeX,
  Mic,
  MicOff
} from "lucide-react";
import LoginModal from "../components/LoginModal";
import Link from "next/link";

const AUTHORIZED_EMAILS = [
  "sujeetshiremath@gmail.com",
  "hiremath09@gmail.com"
];

export default function CameraPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Video Stream State
  const [streamError, setStreamError] = useState(false);
  const [streamLoading, setStreamLoading] = useState(true);
  const [streamKey, setStreamKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [snapshotSuccess, setSnapshotSuccess] = useState(false);
  const [liveClock, setLiveClock] = useState("00:00:00");

  // Audio Stream State
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [audioConnecting, setAudioConnecting] = useState(false);

  const videoContainerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const idToken = await currentUser.getIdToken();
          setToken(idToken);
        } catch (e) {
          console.error("Failed to fetch ID token:", e);
        }
      } else {
        setToken(null);
      }
      setLoadingUser(false);
    });
    return () => unsubscribe();
  }, []);

  // Live Clock
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setLiveClock(now.toTimeString().split(" ")[0]);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Sync volume with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Audio toggle handler
  const toggleAudio = async () => {
    if (!audioRef.current || !token) return;

    if (!isAudioActive) {
      try {
        setAudioConnecting(true);
        const freshToken = await user?.getIdToken(true);
        const activeToken = freshToken || token;
        audioRef.current.src = `/api/stratus/audio?token=${encodeURIComponent(activeToken)}&k=${Date.now()}`;
        audioRef.current.volume = isMuted ? 0 : volume;
        await audioRef.current.play();
        setIsAudioActive(true);
      } catch (err) {
        console.error("Audio playback error:", err);
      } finally {
        setAudioConnecting(false);
      }
    } else {
      audioRef.current.pause();
      audioRef.current.src = "";
      setIsAudioActive(false);
    }
  };

  // Reconnect / Refresh stream
  const handleRefresh = async () => {
    setStreamLoading(true);
    setStreamError(false);
    if (user) {
      try {
        const freshToken = await user.getIdToken(true);
        setToken(freshToken);

        // If audio is playing, reconnect audio as well
        if (isAudioActive && audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = `/api/stratus/audio?token=${encodeURIComponent(freshToken)}&k=${Date.now()}`;
          audioRef.current.play().catch(console.error);
        }
      } catch (e) {
        console.error("Failed refreshing token:", e);
      }
    }
    setStreamKey((prev) => prev + 1);
  };

  // Toggle Fullscreen
  const toggleFullscreen = async () => {
    if (!videoContainerRef.current) return;
    if (!document.fullscreenElement) {
      try {
        await videoContainerRef.current.requestFullscreen();
      } catch (err) {
        console.error("Fullscreen error:", err);
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    }
  };

  // Capture Snapshot
  const captureSnapshot = () => {
    if (!imgRef.current) return;
    try {
      const canvas = document.createElement("canvas");
      canvas.width = imgRef.current.naturalWidth || 640;
      canvas.height = imgRef.current.naturalHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(imgRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
        const link = document.createElement("a");
        const ts = new Date().toISOString().replace(/[:.]/g, "-");
        link.download = `stratus-cam-snapshot-${ts}.jpg`;
        link.href = dataUrl;
        link.click();

        setSnapshotSuccess(true);
        setTimeout(() => setSnapshotSuccess(false), 2500);
      }
    } catch (e) {
      console.error("Snapshot capture error:", e);
    }
  };

  const isEmailAuthorized =
    user && user.email && AUTHORIZED_EMAILS.includes(user.email.toLowerCase());

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-[#07090e] text-white flex items-center justify-center font-mono">
        <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in or unauthorized
  if (!user || !isEmailAuthorized) {
    return (
      <div className="min-h-screen bg-[#07090e] text-white flex items-center justify-center px-4 font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-[#0f141f] border border-[#1c2638] rounded-3xl p-8 text-center backdrop-blur-xl shadow-2xl"
        >
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock size={30} />
          </div>
          <h2 className="text-2xl font-bold mb-3 tracking-wide">
            {user ? "Access Restricted" : "Administrator Authentication"}
          </h2>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            {user
              ? `Account (${user.email}) is not authorized to view the live camera feed.`
              : "The Stratus Live Camera & Audio feed is private hardware surveillance. Please log in with your administrator account to stream."}
          </p>
          <div className="flex flex-col gap-3">
            {!user ? (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20 text-sm"
              >
                Authenticate & Connect
              </button>
            ) : null}
            <Link
              href="/"
              className="w-full py-3.5 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-2xl border border-white/5 transition-all text-sm flex items-center justify-center gap-2"
            >
              <ArrowLeft size={16} />
              Return to Portfolio
            </Link>
          </div>
        </motion.div>
        <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      </div>
    );
  }

  const streamSrc = token ? `/api/stratus/camera?token=${encodeURIComponent(token)}&k=${streamKey}` : "";

  return (
    <div className="min-h-screen bg-[#07090e] text-white font-sans selection:bg-emerald-500/30">
      {/* Hidden Live Audio Stream Element */}
      <audio ref={audioRef} preload="none" />

      {/* Top Header */}
      <header className="border-b border-[#141d2c] bg-[#0a0e17]/80 backdrop-blur-md sticky top-0 z-40 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-xs font-mono"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Portfolio</span>
            </Link>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
              <div>
                <h1 className="text-sm font-bold tracking-wider uppercase text-gray-200">
                  Stratus Live Camera & Audio
                </h1>
                <p className="text-[11px] font-mono text-emerald-400/80">
                  RPi 5 CSI-2 • OV5647 5MP + USB PnP Mic
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/server-dashboard"
              className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 text-xs font-mono flex items-center gap-2 transition-all"
            >
              <Activity size={14} />
              <span className="hidden sm:inline">Telemetry Dashboard</span>
            </Link>
            <div className="font-mono text-xs text-gray-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
              {liveClock}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stream Viewport Card */}
        <div className="bg-[#0b101b] border border-[#182338] rounded-3xl overflow-hidden shadow-2xl">
          {/* Stream Top Toolbar */}
          <div className="px-6 py-4 border-b border-[#141d2c] flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                <Radio size={12} className="animate-pulse" />
                LIVE STREAM
              </span>
              <span className="text-xs text-gray-400 font-mono hidden sm:inline">
                MJPEG 640x480 &bull; 44.1kHz MP3
              </span>
            </div>

            {/* Stream & Audio Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Audio Controls */}
              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
                <button
                  onClick={toggleAudio}
                  disabled={audioConnecting}
                  className={`px-3 py-1 rounded-lg text-xs font-mono flex items-center gap-2 transition-all ${
                    isAudioActive
                      ? "bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/20"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                  title={isAudioActive ? "Stop live audio" : "Start live audio"}
                >
                  {isAudioActive ? (
                    <>
                      <Mic size={14} />
                      <span>Audio ON</span>
                      {/* Animated Audio Equalizer Bars */}
                      <span className="flex items-end gap-0.5 h-3 ml-0.5">
                        <span className="w-0.5 bg-black h-2 animate-bounce" style={{ animationDuration: '400ms' }} />
                        <span className="w-0.5 bg-black h-3 animate-bounce" style={{ animationDuration: '600ms' }} />
                        <span className="w-0.5 bg-black h-1.5 animate-bounce" style={{ animationDuration: '500ms' }} />
                      </span>
                    </>
                  ) : (
                    <>
                      <MicOff size={14} />
                      <span>{audioConnecting ? "Connecting..." : "Audio OFF"}</span>
                    </>
                  )}
                </button>

                {isAudioActive && (
                  <>
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1 rounded-md text-gray-400 hover:text-white transition-colors"
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <VolumeX size={14} className="text-rose-400" /> : <Volume2 size={14} className="text-emerald-400" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => {
                        setVolume(parseFloat(e.target.value));
                        if (isMuted) setIsMuted(false);
                      }}
                      className="w-16 h-1 accent-emerald-400 cursor-pointer hidden sm:inline-block"
                      title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
                    />
                  </>
                )}
              </div>

              {/* Snapshot Button */}
              <button
                onClick={captureSnapshot}
                disabled={streamError || streamLoading}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-mono flex items-center gap-2 transition-all disabled:opacity-40"
                title="Download snapshot"
              >
                <Download size={14} />
                <span className="hidden sm:inline">Snapshot</span>
              </button>

              {/* Reconnect Button */}
              <button
                onClick={handleRefresh}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-mono flex items-center gap-2 transition-all"
                title="Reconnect video & audio"
              >
                <RefreshCw size={14} className={streamLoading ? "animate-spin" : ""} />
                <span className="hidden sm:inline">Reconnect</span>
              </button>

              {/* Fullscreen Button */}
              <button
                onClick={toggleFullscreen}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs transition-all"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
            </div>
          </div>

          {/* Video Display Area */}
          <div
            ref={videoContainerRef}
            className="relative w-full aspect-[4/3] max-h-[70vh] bg-[#05070a] flex items-center justify-center overflow-hidden group"
          >
            {/* Snapshot Alert Toast */}
            <AnimatePresence>
              {snapshotSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-emerald-500/90 text-black px-4 py-2 rounded-2xl font-mono text-xs font-bold shadow-2xl flex items-center gap-2"
                >
                  <ShieldCheck size={16} />
                  Snapshot captured and downloaded!
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Overlay */}
            {streamError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20 bg-[#05070a]/90 backdrop-blur-sm">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
                  <AlertCircle size={28} />
                </div>
                <h3 className="text-lg font-bold text-gray-200 mb-2 font-mono">Stream Connection Offline</h3>
                <p className="text-xs text-gray-400 max-w-md mb-6 leading-relaxed">
                  The Stratus camera service on 10.0.0.168:8000 or the Cloudflare Tunnel ingress is currently not receiving frames from the CSI-2 sensor.
                </p>
                <button
                  onClick={handleRefresh}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-black font-bold rounded-xl font-mono text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
                >
                  <RefreshCw size={14} />
                  Retry Connection
                </button>
              </div>
            )}

            {/* Live MJPEG Stream Image */}
            {token && (
              <img
                ref={imgRef}
                key={streamKey}
                src={streamSrc}
                alt="Stratus Live Camera Feed"
                crossOrigin="anonymous"
                className={`w-full h-full object-contain select-none transition-opacity duration-300 ${
                  streamError ? "opacity-0" : "opacity-100"
                }`}
                onLoad={() => {
                  setStreamLoading(false);
                  setStreamError(false);
                }}
                onError={() => {
                  setStreamLoading(false);
                  setStreamError(true);
                }}
              />
            )}

            {/* Stream HUD Overlay */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none text-[11px] font-mono opacity-80 group-hover:opacity-100 transition-opacity">
              <div className="bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10 text-emerald-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>STRATUS-CAM-01</span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-300">{liveClock}</span>
                <span className="text-gray-400">|</span>
                <span className={isAudioActive ? "text-emerald-400 flex items-center gap-1" : "text-gray-500"}>
                  {isAudioActive ? "MIC LIVE" : "MIC MUTED"}
                </span>
              </div>
              <div className="bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10 text-gray-400 hidden sm:block">
                AUTHENTICATED ADMIN
              </div>
            </div>
          </div>

          {/* Stream Footer Telemetry Info */}
          <div className="p-6 bg-[#090d16] border-t border-[#141d2c] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="text-gray-500 uppercase text-[10px] tracking-wider mb-1">Hardware Sensor</div>
              <div className="text-gray-200 font-bold">OmniVision OV5647</div>
              <div className="text-gray-400 text-[11px] mt-0.5">5MP Native CSI-2 Port</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="text-gray-500 uppercase text-[10px] tracking-wider mb-1">Audio Hardware</div>
              <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                <Mic size={14} />
                USB PnP Microphone
              </div>
              <div className="text-gray-400 text-[11px] mt-0.5">ALSA Asym Default • 44.1kHz MP3</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="text-gray-500 uppercase text-[10px] tracking-wider mb-1">Tunnel Pipeline</div>
              <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Cloudflare Quick-Ingress
              </div>
              <div className="text-gray-400 text-[11px] mt-0.5">TLS Edge to Stratus:8000</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="text-gray-500 uppercase text-[10px] tracking-wider mb-1">Access Gate</div>
              <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                <ShieldCheck size={14} />
                Dual-Layer Auth
              </div>
              <div className="text-gray-400 text-[11px] mt-0.5">Firebase Admin Token Verified</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
