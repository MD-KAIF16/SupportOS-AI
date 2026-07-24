"use client";

// ======================================================
// Login Form Component
// ======================================================

import { useState } from "react";
import { useRouter } from "next/navigation";

import { login } from "@/services/auth.service";
import { useAuth } from "@/context/AuthContext";

import Logo from "../common/Logo";
import Input from "../common/Input";
import Button from "../common/Button";

export default function LoginForm() {

  // =====================================================
  // React Router
  // =====================================================

  const router = useRouter();

  // =====================================================
  // Auth Context
  // =====================================================

  const { login: loginUser } = useAuth();

  // =====================================================
  // React State
  // =====================================================

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // =====================================================
  // Login Button Click
  // =====================================================

  const handleLogin = async () => {

    try {

      setLoading(true);

      setError("");

      // =============================================
      // Call Login API
      // =============================================

      const response = await login(
        email,
        password
      );

      // =============================================
      // Save User + JWT in Auth Context
      // =============================================

      loginUser(
        {
          user_id: response.data.user_id,
          email: response.data.email,
          role: response.data.role,
        },
        response.data.access_token
      );

      // =============================================
      // Navigate to Chat Page
      // =============================================

      router.push("/chat");

    } catch (err: any) {

      setError(
        err.message || "Login Failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-blue-100 px-4">

      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl">

        {/* ================= Logo ================= */}

        <div className="mb-8 flex flex-col items-center">

          <Logo size={80} />

          <h1 className="mt-5 text-3xl font-bold text-slate-800">
            SupportOS AI
          </h1>

          <p className="mt-2 text-center text-sm text-slate-500">
            Intelligent Customer Support Platform
          </p>

        </div>

        {/* ================= Login Form ================= */}

        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >

          {/* ================= Email ================= */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </label>

            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

          </div>

          {/* ================= Password ================= */}

          <div>

            <div className="mb-2 flex items-center justify-between">

              <label className="text-sm font-medium text-slate-700">
                Password
              </label>

              <a
                href="#"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot Password?
              </a>

            </div>

            <Input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

          </div>

          {/* ================= Error ================= */}

          {
            error && (

              <div className="rounded-lg bg-red-100 p-3 text-sm text-red-600">

                {error}

              </div>

            )
          }

          {/* ================= Login Button ================= */}

          <Button
            text={
              loading
                ? "Logging in..."
                : "Login"
            }
            onClick={handleLogin}
          />

          {/* ================= Register ================= */}

          <p className="text-center text-sm text-slate-500">

            Don&apos;t have an account?{" "}

            <a
              href="#"
              className="font-medium text-blue-600 hover:underline"
            >
              Sign Up
            </a>

          </p>

        </form>

      </div>

    </main>

  );

}