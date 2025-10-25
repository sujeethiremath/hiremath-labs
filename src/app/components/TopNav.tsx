"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { getAuth, onAuthStateChanged, User, signOut } from "firebase/auth";
import { app } from "../lib/firebase";
import {
  FaUserCircle,
  FaSignOutAlt,
  FaFeatherAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { RiLoginCircleLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import { trackEvent } from "../utils/analytics";

interface TopNavProps {
  onLoginClick: () => void;
  isAuthorized: boolean;
}

const TopNav: React.FC<TopNavProps> = ({ onLoginClick, isAuthorized }) => {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Function to track login click and pass to prop handler
  const handleLoginAttempt = () => {
    trackEvent("Login Button Clicked", {
      source: isMobileMenuOpen ? "Mobile Nav" : "Desktop Nav",
    });
    onLoginClick();
  };

  const handleLogout = async () => {
    const auth = getAuth(app);
    try {
      await signOut(auth);
      setIsDropdownOpen(false);
      // Admin Action: Track successful sign out
      trackEvent("Admin Signed Out", { source: "Nav Dropdown" });
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleScroll = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -80;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  // Centralized click handler for all navigation links (Desktop and Mobile)
  const handleClick = (
    e: React.MouseEvent,
    link: { name: string; id?: string; path?: string }
  ) => {
    // 1. Log the event before any navigation occurs
    trackEvent("Nav Link Clicked", {
      link_name: link.name,
      target_path: link.path,
      is_scrolling: pathname === "/" && !!link.id, // Is this an anchor link on the homepage?
      source_area: isMobileMenuOpen ? "Mobile Menu" : "Desktop Nav",
    });

    // 2. Handle scrolling for same-page links
    if (pathname === "/" && link.id) {
      e.preventDefault(); // Prevent default link behavior
      handleScroll(link.id);
    }
    // 3. Otherwise, let the Link component handle navigation
  };

  const navLinks = [
    { name: "Summary", id: "summary", path: "/#summary" },
    { name: "Projects", id: "projects", path: "/#projects" },
    { name: "Leetcode Summary", id: "leetcode", path: "/#leetcode" },
    { name: "Contact", id: "contact", path: "/#contact" },
    { name: "Articles", path: "/articles" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/50 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:py-6">
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="flex items-center space-x-2"
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
          <div className="hidden md:flex flex-grow justify-center items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path || "#"}
                onClick={(e) => handleClick(e, link)}
                className={`text-base font-medium transition-colors duration-200 ${
                  pathname === link.path
                    ? "text-blue-400"
                    : "text-gray-400 hover:text-blue-400"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Authentication and Mobile Menu Icon */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              {isAuthorized ? (
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(!isDropdownOpen);
                      // Track dropdown open/close
                      trackEvent("Admin Dropdown Toggled", {
                        new_state: isDropdownOpen ? "Closed" : "Opened",
                      });
                    }}
                    className="flex items-center text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <FaUserCircle className="h-6 w-6" />
                  </button>
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-gray-800 border border-white/10 rounded-md shadow-xl py-1"
                      >
                        <Link
                          href="/articles/write/new"
                          className="flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors"
                          onClick={(e) => {
                            setIsDropdownOpen(false);
                            trackEvent("Admin Action", {
                              action_name: "Navigated to Write Article",
                              source: "Desktop Dropdown",
                            });
                          }}
                        >
                          <FaFeatherAlt className="mr-2" />
                          Write Article
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors"
                        >
                          <FaSignOutAlt className="mr-2" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={handleLoginAttempt}
                  className="flex items-center space-x-2 text-base font-medium text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  <RiLoginCircleLine className="h-5 w-5" />
                  <span>Log In</span>
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                  // Track mobile menu state change
                  trackEvent("Mobile Menu Toggled", {
                    new_state: isMobileMenuOpen ? "Closed" : "Opened",
                  });
                }}
                className="text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none"
              >
                {isMobileMenuOpen ? (
                  <FaTimes className="h-6 w-6" />
                ) : (
                  <FaBars className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-gray-900/80 backdrop-blur-md overflow-hidden"
          >
            <div className="py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path || "#"}
                  className={`block px-5 py-2 text-base font-medium transition-colors duration-200 ${
                    pathname === link.path
                      ? "text-blue-400 bg-gray-800"
                      : "text-gray-400 hover:text-blue-400 hover:bg-gray-800"
                  }`}
                  onClick={(e) => {
                    handleClick(e, link);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-gray-700 my-2" />
              {isAuthorized ? (
                <>
                  <Link
                    href="/articles/write/new"
                    className="block px-5 py-2 text-base font-medium text-gray-400 hover:text-blue-400 hover:bg-gray-800 transition-colors duration-200"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      trackEvent("Admin Action", {
                        action_name: "Navigated to Write Article",
                        source: "Mobile Menu",
                      });
                    }}
                  >
                    <FaFeatherAlt className="inline-block mr-2" />
                    Write Article
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-5 py-2 text-base font-medium text-gray-400 hover:text-blue-400 hover:bg-gray-800 transition-colors duration-200"
                  >
                    <FaSignOutAlt className="inline-block mr-2" />
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    handleLoginAttempt();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-5 py-2 text-base font-medium text-gray-400 hover:text-blue-400 hover:bg-gray-800 transition-colors duration-200"
                >
                  <RiLoginCircleLine className="inline-block mr-2" />
                  Log In
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default TopNav;
