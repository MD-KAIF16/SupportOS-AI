"use client";

// ======================================================
// Auth Context
//
// Purpose:
// Stores authentication state across the application.
// ======================================================

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { getCurrentUser } from "@/services/auth.service";

// ======================================================
// User Type
// ======================================================

type User = {
  user_id: string;
  email: string;
  role: string;
};

// ======================================================
// Context Type
// ======================================================

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;

  login: (
    user: User,
    token: string
  ) => void;

  logout: () => void;
};

// ======================================================
// Create Context
// ======================================================

const AuthContext = createContext<
  AuthContextType | undefined
>(undefined);

// ======================================================
// Auth Provider
// ======================================================

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {

  // ===========================================
  // React State
  // ===========================================

  const [user, setUser] = useState<User | null>(null);

  const [token, setToken] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  // ===========================================
  // Restore Session
  // ===========================================

  useEffect(() => {

    const restoreSession = async () => {

      const savedToken = localStorage.getItem("token");

      if (!savedToken) {

        setLoading(false);

        return;

      }

      try {

        // Verify Token with Backend

        const currentUser = await getCurrentUser(savedToken);

        setUser({
          user_id: currentUser.user_id,
          email: currentUser.email,
          role: currentUser.role,
        });

        setToken(savedToken);

        localStorage.setItem(
          "user",
          JSON.stringify(currentUser)
        );

      } catch {

        // Invalid / Expired Token

        setUser(null);

        setToken(null);

        localStorage.removeItem("user");

        localStorage.removeItem("token");

      } finally {

        setLoading(false);

      }

    };

    restoreSession();

  }, []);

  // ===========================================
  // Login
  // ===========================================

  const login = (
    user: User,
    token: string
  ) => {

    setUser(user);

    setToken(token);

    setLoading(false);

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    localStorage.setItem(
      "token",
      token
    );

  };

  // ===========================================
  // Logout
  // ===========================================

  const logout = () => {

    setUser(null);

    setToken(null);

    setLoading(false);

    localStorage.removeItem("user");

    localStorage.removeItem("token");

  };

  // ===========================================
  // Provider
  // ===========================================

  return (

    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
      }}
    >

      {children}

    </AuthContext.Provider>

  );

}

// ======================================================
// Custom Hook
// ======================================================

export function useAuth() {

  const context = useContext(AuthContext);

  if (!context) {

    throw new Error(
      "useAuth must be used inside AuthProvider."
    );

  }

  return context;

}