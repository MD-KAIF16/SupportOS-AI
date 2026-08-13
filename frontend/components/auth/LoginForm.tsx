"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

import { login } from "@/services/auth.service";
import { useAuth } from "@/context/AuthContext";

import Logo from "../common/Logo";
import Input from "../common/Input";
import Button from "../common/Button";

export default function LoginForm() {
  const router = useRouter();
  const { login: loginUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await login(email, password);

      loginUser(
        {
          user_id: response.data.user_id || response.data.id,
          email: response.data.email,
          role: response.data.role,
        },
        response.data.access_token
      );

      router.push("/chat");
    } catch (err: any) {
      setError(err.message || "Login Failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden">
      {/* Glow highlight pill behind card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/25 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md rounded-3xl glass-panel p-8 sm:p-10 shadow-2xl relative z-10 border border-white/10">
        {/* Brand Header */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex items-center justify-center">
            <Logo size={52} showText={false} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            SupportOS <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">AI</span>
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-gray-400 max-w-xs leading-relaxed">
            Enterprise Autonomous AI Customer Support Platform
          </p>
        </div>

        {/* Login Form */}
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          {/* Email Input */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-300">
              Email Address
            </label>
            <Input
              type="email"
              name="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="h-4 w-4 text-purple-400" />}
            />
          </div>

          {/* Password Input */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Password
              </label>
              <a
                href="#"
                className="text-xs text-purple-400 hover:text-purple-300 transition hover:underline"
              >
                Forgot Password?
              </a>
            </div>
            <Input
              type="password"
              name="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="h-4 w-4 text-purple-400" />}
            />
          </div>

          {/* Error Banner */}
          {error && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <Button
            text={loading ? "Authenticating..." : "Sign In to SupportOS"}
            type="submit"
            disabled={loading}
            icon={loading ? <Sparkles className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          />

          {/* Quick Info Footer */}
          <div className="pt-4 border-t border-white/[0.06] text-center text-xs text-gray-500">
            Protected by Supabase RBAC & Tenant Isolation Security Policy
          </div>
        </form>
      </div>
    </main>
  );
}