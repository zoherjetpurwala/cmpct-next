"use client";
import { createContext, useContext, useState, useEffect } from "react";
import jwt from "jsonwebtoken";
import jsCookie from "js-cookie"; // Using js-cookie for easy cookie management

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  const fetchUser = async (userId) => {
    try {
      const response = await fetch(`/api/user?userId=${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user info");
      }
      const userData = await response.json();
      setUser(userData); // Set user data from the API
    } catch (error) {
      console.error("Error fetching user info:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const setUserWithToken = (token) => {
    if (token) {
      try {
        const decoded = jwt.decode(token);
        setUser(null); // Clear current user data to avoid stale data
        fetchUser(decoded.id); // Fetch user info from the API
      } catch (error) {
        console.error("Invalid token:", error);
      }
    } else {
      setUser(null); // Clear user state if token is not present
    }
  };

  const logoutFunction = () => {
    console.log("Logging out..."); // Log the logout process

    jsCookie.remove("jwt"); // Remove JWT cookie
    setUser(null); // Clear user state
    setLoading(false); // Ensure loading state is set to false
    console.log(user);
    
  };


  // Function to load JWT token from cookie on page load
  const loadUserFromCookie = () => {
    const token = jsCookie.get("jwt"); // Retrieve the token from cookie
    if (token) {
      setUserWithToken(token); // If token exists, set user with it
    } else {
      setLoading(false); // No token found, stop loading
    }
  };

  useEffect(() => {
    loadUserFromCookie(); // Load user from cookie when the app initializes
  }, []);


  return (
    <UserContext.Provider value={{ user, setUserWithToken, loading, logoutFunction  }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  return useContext(UserContext);
};
