"use client";

import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkUserSession = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user', {
        method: 'GET',
        credentials: 'include', // This is important for sending cookies
      });
      if (!response.ok) {
        throw new Error('Invalid session');
      }
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Error checking user session:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logoutFunction = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUserSession();
  }, []);

  return (
    <UserContext.Provider value={{ user, checkUserSession, loading, logoutFunction }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};