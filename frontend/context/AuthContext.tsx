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

  // ===========================================
  // Restore Session
  // ===========================================

  useEffect(() => {

    const savedUser = localStorage.getItem("user");

    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {

      setUser(JSON.parse(savedUser));

      setToken(savedToken);

    }

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