"use client";

import React, { useState, useEffect, useRef } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lock, 
  ArrowLeft, 
  RefreshCw, 
  Terminal as TerminalIcon, 
  Maximize2, 
  Minimize2, 
  Trash2, 
  Activity, 
  Camera, 
  ShieldCheck, 
  AlertCircle,
  Radio,
  Cpu,
  Server
} from "lucide-react";
import LoginModal from "../components/LoginModal";
import Link from "next/link";
import "@xterm/xterm/css/xterm.css";

const AUTHORIZED_EMAILS = [
  "sujeetshiremath@gmail.com",
  "hiremath09@gmail.com"
];

export default function TerminalPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Terminal connection state
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected" | "error">("disconnected");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [liveClock, setLiveClock] = useState("00:00:00");

  const terminalContainerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<any>(null);
  const fitAddonRef = useRef<any>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
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
      setTimeout(() => fitAddonRef.current?.fit(), 100);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Toggle Fullscreen
  const toggleFullscreen = async () => {
    if (!wrapperRef.current) return;
    if (!document.fullscreenElement) {
      try {
        await wrapperRef.current.requestFullscreen();
      } catch (err) {
        console.error("Fullscreen error:", err);
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    }
  };

  // Connect to Remote Web Terminal
  const connectTerminal = async () => {
    if (!user) return;

    setConnectionStatus("connecting");
    setErrorMessage(null);

    // Clean up previous connection if any
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch {}
      wsRef.current = null;
    }

    try {
      const idToken = await user.getIdToken();

      // 1. Request single-use ticket from backend
      let wsUrl = "wss://ssh.sujeethiremath.com/ws";
      let ticketParam = "";

      try {
        const ticketRes = await fetch("/api/stratus/terminal-ticket", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (ticketRes.ok) {
          const ticketData = await ticketRes.json();
          ticketParam = `?ticket=${encodeURIComponent(ticketData.ticket)}`;
          if (ticketData.wsUrl) {
            wsUrl = ticketData.wsUrl;
          }
        } else {
          // Fallback to direct ID token
          ticketParam = `?token=${encodeURIComponent(idToken)}`;
        }
      } catch {
        ticketParam = `?token=${encodeURIComponent(idToken)}`;
      }

      const fullWsUrl = `${wsUrl}${ticketParam}`;

      // 2. Open WebSocket
      const ws = new WebSocket(fullWsUrl);
      wsRef.current = ws;
      ws.binaryType = "arraybuffer";

      ws.onopen = () => {
        setConnectionStatus("connected");
        setErrorMessage(null);
        if (termRef.current) {
          termRef.current.focus();
          // Send initial terminal resize
          if (fitAddonRef.current) {
            fitAddonRef.current.fit();
            ws.send(JSON.stringify({
              type: "resize",
              cols: termRef.current.cols,
              rows: termRef.current.rows,
            }));
          }
        }
      };

      ws.onmessage = (event) => {
        if (termRef.current) {
          if (event.data instanceof ArrayBuffer) {
            termRef.current.write(new Uint8Array(event.data));
          } else {
            termRef.current.write(event.data);
          }
        }
      };

      ws.onerror = (e) => {
        console.error("WebSocket error:", e);
        setConnectionStatus("error");
        setErrorMessage("Connection to Stratus remote terminal failed or was rejected.");
      };

      ws.onclose = (event) => {
        setConnectionStatus("disconnected");
        if (event.code === 4003) {
          setErrorMessage("Authentication rejected: Account not authorized for remote SSH access.");
        }
      };

    } catch (err: any) {
      setConnectionStatus("error");
      setErrorMessage(err?.message || "Failed to initialize terminal connection");
    }
  };

  // Initialize xterm.js inside container
  useEffect(() => {
    if (!user || !terminalContainerRef.current) return;

    let isMounted = true;

    const initXterm = async () => {
      const { Terminal } = await import("@xterm/xterm");
      const { FitAddon } = await import("@xterm/addon-fit");

      if (!isMounted || !terminalContainerRef.current) return;

      // Clean up previous instance
      if (termRef.current) {
        termRef.current.dispose();
      }

      const term = new Terminal({
        cursorBlink: true,
        cursorStyle: "block",
        fontSize: fontSize,
        fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
        theme: {
          background: "#07090e",
          foreground: "#e2e8f0",
          cursor: "#00e5ff",
          cursorAccent: "#07090e",
          selectionBackground: "rgba(0, 229, 255, 0.3)",
          black: "#1e293b",
          red: "#f43f5e",
          green: "#10b981",
          yellow: "#f59e0b",
          blue: "#38bdf8",
          magenta: "#c084fc",
          cyan: "#00e5ff",
          white: "#f8fafc",
          brightBlack: "#475569",
          brightRed: "#fb7185",
          brightGreen: "#34d399",
          brightYellow: "#fbbf24",
          brightBlue: "#60a5fa",
          brightMagenta: "#d8b4fe",
          brightCyan: "#22d3ee",
          brightWhite: "#ffffff",
        },
      });

      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);

      term.open(terminalContainerRef.current);
      fitAddon.fit();

      termRef.current = term;
      fitAddonRef.current = fitAddon;

      // Forward user keystrokes to WebSocket
      term.onData((data) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(data);
        }
      });

      // Handle window resize
      const handleResize = () => {
        if (fitAddonRef.current && termRef.current && wsRef.current?.readyState === WebSocket.OPEN) {
          fitAddonRef.current.fit();
          wsRef.current.send(JSON.stringify({
            type: "resize",
            cols: termRef.current.cols,
            rows: termRef.current.rows,
          }));
        }
      };

      window.addEventListener("resize", handleResize);

      // Connect session
      connectTerminal();

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    };

    initXterm();

    return () => {
      isMounted = false;
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (termRef.current) {
        termRef.current.dispose();
      }
    };
  }, [user]);

  // Adjust font size
  const adjustFontSize = (delta: number) => {
    const newSize = Math.max(10, Math.min(24, fontSize + delta));
    setFontSize(newSize);
    if (termRef.current) {
      termRef.current.options.fontSize = newSize;
      setTimeout(() => fitAddonRef.current?.fit(), 50);
    }
  };

  // Clear Terminal Buffer
  const clearTerminal = () => {
    if (termRef.current) {
      termRef.current.clear();
      termRef.current.focus();
    }
  };

  const isEmailAuthorized =
    user && user.email && AUTHORIZED_EMAILS.includes(user.email.toLowerCase());

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-[#07090e] text-white flex items-center justify-center font-mono">
        <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    );
  }

  // Unauthorized or Unauthenticated Screen
  if (!user || !isEmailAuthorized) {
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
          <h2 className="text-2xl font-bold mb-3 tracking-wide">
            {user ? "Access Restricted" : "Administrator Authentication"}
          </h2>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            {user
              ? `Account (${user.email}) is not authorized for remote SSH terminal access.`
              : "The Stratus Remote Terminal is a protected system interface. Please authenticate with your administrator credentials to open an interactive session."}
          </p>
          <div className="flex flex-col gap-3">
            {!user ? (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:opacity-90 text-white font-bold rounded-2xl transition-all shadow-lg shadow-cyan-500/20 text-sm"
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

  return (
    <div className="min-h-screen bg-[#07090e] text-white font-sans selection:bg-cyan-500/30">
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
              <div className={`w-2.5 h-2.5 rounded-full ${
                connectionStatus === "connected" ? "bg-cyan-400 animate-pulse shadow-sm shadow-cyan-400/50" :
                connectionStatus === "connecting" ? "bg-amber-400 animate-ping" : "bg-rose-500"
              }`} />
              <div>
                <h1 className="text-sm font-bold tracking-wider uppercase text-gray-200">
                  Stratus Remote SSH Terminal
                </h1>
                <p className="text-[11px] font-mono text-cyan-400/80">
                  RPi 5 &bull; Authenticated PTY Shell (mrguntherr)
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
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <Link
              href="/camera"
              className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-mono flex items-center gap-2 transition-all"
            >
              <Camera size={14} />
              <span className="hidden sm:inline">Camera</span>
            </Link>
            <div className="font-mono text-xs text-gray-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
              {liveClock}
            </div>
          </div>
        </div>
      </header>

      {/* Main Terminal Container */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div 
          ref={wrapperRef}
          className="bg-[#0b101b] border border-[#182338] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        >
          {/* Terminal Toolbar */}
          <div className="px-6 py-4 border-b border-[#141d2c] flex items-center justify-between flex-wrap gap-3 bg-[#0a0e17]">
            <div className="flex items-center gap-3">
              <span className={`flex items-center gap-2 text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full border ${
                connectionStatus === "connected" ? "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" :
                connectionStatus === "connecting" ? "text-amber-400 bg-amber-500/10 border-amber-500/20" :
                "text-rose-400 bg-rose-500/10 border-rose-500/20"
              }`}>
                <Radio size={12} className={connectionStatus === "connected" ? "animate-pulse" : ""} />
                {connectionStatus === "connected" ? "SESSION ACTIVE" :
                 connectionStatus === "connecting" ? "ESTABLISHING PTY..." : "OFFLINE"}
              </span>
              <span className="text-xs text-gray-400 font-mono hidden sm:inline">
                xterm-256color &bull; TLS WebSocket
              </span>
            </div>

            {/* Terminal Actions */}
            <div className="flex items-center gap-2">
              {/* Font Sizing */}
              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-0.5 text-xs font-mono">
                <button
                  onClick={() => adjustFontSize(-1)}
                  className="px-2 py-1 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  title="Decrease font size"
                >
                  A-
                </button>
                <span className="px-2 text-gray-500">{fontSize}px</span>
                <button
                  onClick={() => adjustFontSize(1)}
                  className="px-2 py-1 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  title="Increase font size"
                >
                  A+
                </button>
              </div>

              {/* Clear Buffer */}
              <button
                onClick={clearTerminal}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-mono flex items-center gap-2 transition-all"
                title="Clear screen buffer"
              >
                <Trash2 size={14} />
                <span className="hidden sm:inline">Clear</span>
              </button>

              {/* Reconnect Button */}
              <button
                onClick={connectTerminal}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-mono flex items-center gap-2 transition-all"
                title="Reconnect terminal session"
              >
                <RefreshCw size={14} className={connectionStatus === "connecting" ? "animate-spin" : ""} />
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

          {/* Terminal Window Viewport */}
          <div className="relative w-full h-[65vh] min-h-[480px] bg-[#07090e] p-4 flex flex-col justify-start overflow-hidden">
            {/* Error Banner */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-4 left-4 right-4 z-20 bg-rose-500/90 text-white p-3 rounded-xl font-mono text-xs shadow-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>{errorMessage}</span>
                  </div>
                  <button
                    onClick={connectTerminal}
                    className="px-3 py-1 bg-black/40 hover:bg-black/60 rounded-lg text-white font-bold"
                  >
                    Retry
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Connecting Overlay */}
            {connectionStatus === "connecting" && (
              <div className="absolute inset-0 bg-[#07090e]/80 backdrop-blur-xs flex items-center justify-center z-10 font-mono text-xs text-cyan-400 gap-3">
                <div className="w-5 h-5 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
                <span>Authenticating & initializing Stratus PTY shell...</span>
              </div>
            )}

            {/* The xterm.js DOM Mount Point */}
            <div 
              ref={terminalContainerRef} 
              className="w-full h-full select-text overflow-hidden" 
            />
          </div>

          {/* Terminal Footer Telemetry Info */}
          <div className="p-6 bg-[#090d16] border-t border-[#141d2c] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="text-gray-500 uppercase text-[10px] tracking-wider mb-1">Compute Host</div>
              <div className="text-gray-200 font-bold flex items-center gap-1.5">
                <Server size={14} className="text-cyan-400" />
                stratus.local
              </div>
              <div className="text-gray-400 text-[11px] mt-0.5">RPi 5 16GB • BCM2712 Quad-Core</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="text-gray-500 uppercase text-[10px] tracking-wider mb-1">Session Target</div>
              <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                <TerminalIcon size={14} />
                mrguntherr@stratus
              </div>
              <div className="text-gray-400 text-[11px] mt-0.5">Interactive /bin/bash Login Shell</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="text-gray-500 uppercase text-[10px] tracking-wider mb-1">Transport Ingress</div>
              <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Cloudflare TLS Tunnel
              </div>
              <div className="text-gray-400 text-[11px] mt-0.5">ssh.sujeethiremath.com:443</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="text-gray-500 uppercase text-[10px] tracking-wider mb-1">Access Gate</div>
              <div className="text-purple-400 font-bold flex items-center gap-1.5">
                <ShieldCheck size={14} />
                Dual-Layer Auth
              </div>
              <div className="text-gray-400 text-[11px] mt-0.5">Firebase Admin Token / Ticket</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
