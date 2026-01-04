"use client";

import React, { useState, useEffect, useRef } from "react";
// Next.js Components
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

// Auth and Styling
import { 
  getAuth, 
  signOut, 
  onAuthStateChanged,
  User 
} from "firebase/auth";
import { 
  UserCircle, 
  LogOut, 
  Feather, 
  Menu, 
  X, 
  LogIn, 
  Target 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- INTEGRATED PROJECT UTILITIES (Inlined for compatibility) ---
import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

const trackEvent = async (eventName: string, details: Record<string, any> = {}) => {
  try {
    await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventName, details }),
    });
  } catch (error) {
    console.error("Analytics error:", error);
  }
};

interface TopNavProps {
  onLoginClick: () => void;
  isAuthorized: boolean;
}

const TopNav: React.FC<TopNavProps> = ({ onLoginClick, isAuthorized }) => {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Create a reference for the dropdown container
  const dropdownRef = useRef<HTMLDivElement>(null);

  // --- Click Outside Handler ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLoginAttempt = () => {
    trackEvent("Login Button Clicked", {
      source: isMobileMenuOpen ? "Mobile Nav" : "Desktop Nav",
    });
    onLoginClick();
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsDropdownOpen(false);
      trackEvent("Admin Signed Out", { source: "Nav Dropdown" });
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleScroll = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  const handleClick = (
    e: React.MouseEvent,
    link: { name: string; id?: string; path?: string }
  ) => {
    trackEvent("Nav Link Clicked", {
      link_name: link.name,
      target_path: link.path,
      is_scrolling: pathname === "/" && !!link.id,
      source_area: isMobileMenuOpen ? "Mobile Menu" : "Desktop Nav",
    });

    if (pathname === "/" && link.id) {
      e.preventDefault();
      handleScroll(link.id);
    }
  };

  const navLinks = [
    { name: "Summary", id: "summary", path: "/#summary" },
    { name: "Projects", id: "projects", path: "/#projects" },
    { name: "Leetcode", id: "leetcode", path: "/#leetcode" },
    { name: "Habits", path: "/habit-tracker" }, 
    { name: "Articles", path: "/articles" },
    { name: "Contact", id: "contact", path: "/#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/60 backdrop-blur-xl border-b border-white/10 shadow-2xl font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:py-5">
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="flex items-center space-x-3 group"
              onClick={() =>
                trackEvent("Nav Link Clicked", {
                  link_name: "Logo/Home",
                  target_path: "/",
                  source_area: "Logo",
                })
              }
            >
              <Image src="/imagewin.png" alt="Logo" width={40} height={40} />
              <span className="text-xl font-bold text-white tracking-wide">
                Hiremath Labs
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-grow justify-center items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path || "#"}
                onClick={(e) => handleClick(e, link)}
                className={`px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${
                  pathname === link.path
                    ? "text-blue-400 bg-blue-500/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:block">
              {isAuthorized ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(!isDropdownOpen);
                      trackEvent("Admin Dropdown Toggled", {
                        new_state: !isDropdownOpen ? "Opened" : "Closed",
                      });
                    }}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all hover:bg-white/10"
                  >
                    <UserCircle size={24} />
                  </button>
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-52 bg-gray-900 border border-white/10 rounded-2xl shadow-2xl py-2 overflow-hidden"
                      >
                        <div className="h-px bg-white/5 mx-2 my-1" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-3 text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors uppercase tracking-widest"
                        >
                          <LogOut size={16} className="mr-3" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={handleLoginAttempt}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-blue-600 text-[11px] font-black text-white hover:bg-blue-500 transition-all uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20"
                >
                  <LogIn size={14} />
                  <span>Log In</span>
                </button>
              )}
            </div>

            {/* Mobile Toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-gray-400 hover:text-white transition-all"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-900 border-t border-white/5 overflow-hidden shadow-2xl"
          >
            <div className="p-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path || "#"}
                  className={`flex items-center px-5 py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
                    pathname === link.path
                      ? "text-blue-400 bg-blue-500/10"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                  onClick={(e) => {
                    handleClick(e, link);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default TopNav;