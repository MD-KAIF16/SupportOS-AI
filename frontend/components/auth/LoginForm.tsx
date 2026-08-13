"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Lock, 
  Mail, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  User, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  KeyRound,
  ArrowLeft
} from "lucide-react";

import { login, register, forgotPassword } from "@/services/auth.service";
import { useAuth } from "@/context/AuthContext";

import Logo from "../common/Logo";
import Input from "../common/Input";
import Button from "../common/Button";

type AuthMode = "login" | "signup" | "forgot";

export default function LoginForm() {
  const router = useRouter();
  const { login: loginUser } = useAuth();

  const [mode, setMode] = useState<AuthMode>("login");

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");

  // UI Controls
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resetFormState = () => {
    setError("");
    setSuccess("");
    setLoading(false);
  };

  const switchMode = (newMode: AuthMode) => {
    resetFormState();
    setMode(newMode);
  };

  // ------------------------------------------------------
  // Handle Login
  // ------------------------------------------------------
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await login(email.trim(), password);

      const userData = {
        user_id: response.data.user_id || response.data.id,
        email: response.data.email,
        role: response.data.role,
      };

      loginUser(userData, response.data.access_token);

      // Role-based Redirect
      const userRole = (response.data.role || "").toLowerCase();
      if (userRole === "admin") {
        router.push("/knowledge-base");
      } else {
        router.push("/chat");
      }
    } catch (err: any) {
      setError(err.message || "Login Failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------------
  // Handle Customer Signup
  // ------------------------------------------------------
  const handleSignup = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await register(email.trim(), password, fullName.trim());

      const userData = {
        user_id: response.data.user_id || response.data.id,
        email: response.data.email,
        role: response.data.role || "end_user",
      };

      loginUser(userData, response.data.access_token);
      router.push("/chat");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------------
  // Handle Forgot Password
  // ------------------------------------------------------
  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await forgotPassword(email.trim());
      setSuccess(res.message || "If an account exists, a password reset email has been sent.");
    } catch (err: any) {
      setError(err.message || "Failed to process password reset request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden bg-[#050507]">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md rounded-3xl glass-panel p-8 sm:p-10 shadow-2xl relative z-10 border border-white/10">
        
        {/* Brand Header */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex items-center justify-center">
            <Logo size={48} showText={false} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            SupportOS <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">AI</span>
          </h1>

          <p className="mt-1.5 text-xs text-gray-400 max-w-xs leading-relaxed">
            Enterprise Autonomous AI Support Platform
          </p>
        </div>

        {/* Mode Selector Tabs (Login vs Signup) */}
        {mode !== "forgot" && (
          <div className="mb-6 grid grid-cols-2 p-1 bg-white/[0.04] rounded-xl border border-white/[0.06]">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`py-2 text-xs font-semibold rounded-lg transition ${
                mode === "login"
                  ? "bg-purple-600/30 text-purple-300 border border-purple-500/30 shadow"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className={`py-2 text-xs font-semibold rounded-lg transition ${
                mode === "signup"
                  ? "bg-purple-600/30 text-purple-300 border border-purple-500/30 shadow"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* ==================================================== */}
        {/* 1. SIGN IN FORM */}
        {/* ==================================================== */}
        {mode === "login" && (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-300">
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

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => switchMode("forgot")}
                  className="text-xs text-purple-400 hover:text-purple-300 transition hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock className="h-4 w-4 text-purple-400" />}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <Button
              text={loading ? "Authenticating..." : "Sign In to SupportOS"}
              type="submit"
              disabled={loading}
              icon={loading ? <Sparkles className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            />
          </form>
        )}

        {/* ==================================================== */}
        {/* 2. CUSTOMER SIGNUP FORM */}
        {/* ==================================================== */}
        {mode === "signup" && (
          <form
            className="space-y-3.5"
            onSubmit={(e) => {
              e.preventDefault();
              handleSignup();
            }}
          >
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-300">
                Full Name (Optional)
              </label>
              <Input
                type="text"
                name="fullName"
                placeholder="Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                icon={<User className="h-4 w-4 text-purple-400" />}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-300">
                Email Address
              </label>
              <Input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="h-4 w-4 text-purple-400" />}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-300">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock className="h-4 w-4 text-purple-400" />}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-300">
                Confirm Password
              </label>
              <Input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={<Lock className="h-4 w-4 text-purple-400" />}
              />
            </div>

            {error && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <Button
              text={loading ? "Creating Account..." : "Create Customer Account"}
              type="submit"
              disabled={loading}
              icon={loading ? <Sparkles className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            />

            <p className="text-[11px] text-gray-500 text-center mt-2">
              Customer accounts get instant AI Support Chat & Support Ticket access.
            </p>
          </form>
        )}

        {/* ==================================================== */}
        {/* 3. FORGOT PASSWORD VIEW */}
        {/* ==================================================== */}
        {mode === "forgot" && (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleForgotPassword();
            }}
          >
            <div className="text-center mb-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 mx-auto mb-2 border border-purple-500/20">
                <KeyRound className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-bold text-white">Reset Password</h2>
              <p className="text-xs text-gray-400 mt-1">
                Enter your email address and we'll send you a password recovery link.
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-300">
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

            {error && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>{success}</span>
              </div>
            )}

            <Button
              text={loading ? "Sending Request..." : "Send Reset Instructions"}
              type="submit"
              disabled={loading}
              icon={loading ? <Sparkles className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            />

            <button
              type="button"
              onClick={() => switchMode("login")}
              className="w-full flex items-center justify-center gap-2 pt-2 text-xs text-gray-400 hover:text-white transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Sign In
            </button>
          </form>
        )}

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-white/[0.06] text-center text-[11px] text-gray-500">
          Protected by Supabase RBAC & Multi-Tenant Isolation Security
        </div>

      </div>
    </main>
  );
}