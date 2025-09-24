"use client";

import { GeistSans, GeistMono } from "geist/font";
import "./globals.css";
import { useState } from "react";
import TopNav from "./components/TopNav";
import LoginModal from "./components/LoginModal";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";

const geistSans = GeistSans;
const geistMono = GeistMono;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
  });

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <html lang="en">
      <body
        // The background color for the entire website is set here
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white`}
      >
        <TopNav onLoginClick={handleLoginClick} isAuthorized={isAuthorized} />
        {children}
        <LoginModal isOpen={isLoginModalOpen} onClose={handleCloseModal} />
      </body>
    </html>
  );
}
