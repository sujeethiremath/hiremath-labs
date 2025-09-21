"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { getAuth, onAuthStateChanged, User, signOut } from "firebase/auth";
import { app } from "../lib/firebase";
import LoginModal from "./LoginModal";
import {
  FaUserCircle,
  FaSignOutAlt,
  FaCog,
  FaFeatherAlt,
} from "react-icons/fa";
import { RiLoginCircleLine } from "react-icons/ri";

const TopNav = () => {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    const auth = getAuth(app);
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleScroll = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -80; // height of navbar
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const menuItems = [{ name: "Articles", path: "/articles" }];

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/logo.svg" alt="Logo" width={40} height={40} />
              <span className="text-xl font-bold text-gray-900">
                Hiremath Labs
              </span>
            </Link>
          </div>
          <div className="flex-1 flex justify-end items-center space-x-4 md:space-x-6">
            <button
              onClick={() => handleScroll("summary")}
              className="text-base font-medium transition-colors duration-200 text-gray-500 hover:text-blue-600"
            >
              Summary
            </button>
            <button
              onClick={() => handleScroll("projects")}
              className="text-base font-medium transition-colors duration-200 text-gray-500 hover:text-blue-600"
            >
              Projects
            </button>
            <Link
              href="/articles"
              className={`text-base font-medium transition-colors duration-200 ${
                pathname === "/articles"
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-blue-600"
              }`}
            >
              Articles
            </Link>
            <button
              onClick={() => handleScroll("contact")}
              className="text-base font-medium transition-colors duration-200 text-gray-500 hover:text-blue-600"
            >
              Contact
            </button>
            {user ? (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                >
                  <FaUserCircle className="h-6 w-6" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1">
                    <Link
                      href="/articles/write/new"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FaFeatherAlt className="mr-2" />
                      Write Article
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FaSignOutAlt className="mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center space-x-2 text-base font-medium text-gray-500 hover:text-blue-600 transition-colors duration-200"
              >
                <RiLoginCircleLine className="h-5 w-5" />
                <span>Log In</span>
              </button>
            )}
          </div>
        </div>
      </div>
      {isLoginModalOpen && (
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        />
      )}
    </nav>
  );
};

export default TopNav;
