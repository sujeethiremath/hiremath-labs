"use client";

import { useState, useEffect } from "react";
import TopNav from "./TopNav"; // Assuming TopNav is in the same components directory
import LoginModal from "./LoginModal"; // Assuming LoginModal is in the same components directory
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase"; // Assuming correct path to firebase auth

interface ClientWrapperProps {
  children: React.ReactNode;
}

/**
 * ClientWrapper handles all global client-side state, including authentication,
 * modal management, and rendering the fixed navigation bar.
 * This ensures the root layout.tsx remains a Server Component for better SEO.
 */
const ClientWrapper: React.FC<ClientWrapperProps> = ({ children }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  // Optional: You may want to store the current user object here if needed elsewhere
  // const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Set up the Firebase Auth State Listener once on the client side
  // This hook ensures the isAuthorized state is correct across the application
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthorized(true);
        // setCurrentUser(user);
      } else {
        setIsAuthorized(false);
        // setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <>
      <TopNav onLoginClick={handleLoginClick} isAuthorized={isAuthorized} />
      {children}
      <LoginModal isOpen={isLoginModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default ClientWrapper;
