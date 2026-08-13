"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoginForm from "@/components/auth/LoginForm";
import Navigation from "@/components/layout/Navigation";
import { Sparkles, MessageSquare, Ticket, BarChart3, BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const { token, user, loading } = useAuth();

  const isAdmin = user?.role?.toLowerCase() === "admin";

  useEffect(() => {
    if (!loading && token && user) {
      if (isAdmin) {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/customer/dashboard");
      }
    }
  }, [loading, token, user, isAdmin, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050507]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
          <span className="text-xs text-purple-300 font-medium">Initializing SupportOS AI Workspace...</span>
        </div>
      </div>
    );
  }

  if (!token) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col justify-center items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 mb-6">
          <Sparkles className="h-3.5 w-3.5 text-purple-400" />
          <span>{isAdmin ? "Admin Enterprise Workspace" : "Customer Support Workspace"}</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-4 max-w-3xl">
          SupportOS <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">AI SaaS</span>
        </h1>

        <p className="text-gray-400 max-w-xl text-sm sm:text-base mb-10 leading-relaxed">
          {isAdmin
            ? "Manage company Knowledge Base documents, monitor tenant performance analytics, and supervise support workloads."
            : "Get intelligent AI customer support grounded in official company documents and manage your support tickets."}
        </p>

        {/* Quick Action Grid based on Role */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl w-full text-left">
          {isAdmin ? (
            <>
              <Link href="/knowledge-base" className="glass-panel p-6 rounded-2xl glass-panel-hover flex flex-col justify-between group">
                <div>
                  <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-lg text-white mb-1">Knowledge Base</h3>
                  <p className="text-xs text-gray-400">Upload PDF/TXT documents to train AI support RAG.</p>
                </div>
                <div className="mt-6 flex items-center text-xs font-semibold text-purple-400 group-hover:translate-x-1 transition">
                  <span>Manage Knowledge</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </div>
              </Link>

              <Link href="/analytics" className="glass-panel p-6 rounded-2xl glass-panel-hover flex flex-col justify-between group">
                <div>
                  <div className="h-10 w-10 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 mb-4 group-hover:scale-110 transition">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-lg text-white mb-1">Tenant Analytics</h3>
                  <p className="text-xs text-gray-400">Inspect real-time resolution metrics and conversations.</p>
                </div>
                <div className="mt-6 flex items-center text-xs font-semibold text-fuchsia-400 group-hover:translate-x-1 transition">
                  <span>View Overview</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </div>
              </Link>

              <Link href="/tickets" className="glass-panel p-6 rounded-2xl glass-panel-hover flex flex-col justify-between group">
                <div>
                  <div className="h-10 w-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-4 group-hover:scale-110 transition">
                    <Ticket className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-lg text-white mb-1">Support Tickets</h3>
                  <p className="text-xs text-gray-400">Supervise open, pending, and escalated tickets.</p>
                </div>
                <div className="mt-6 flex items-center text-xs font-semibold text-pink-400 group-hover:translate-x-1 transition">
                  <span>View Tickets</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </div>
              </Link>
            </>
          ) : (
            <>
              <Link href="/chat" className="glass-panel p-6 rounded-2xl glass-panel-hover flex flex-col justify-between group sm:col-span-2">
                <div>
                  <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-lg text-white mb-1">AI Customer Support Assistant</h3>
                  <p className="text-xs text-gray-400">Ask questions and get answers grounded in official company documents.</p>
                </div>
                <div className="mt-6 flex items-center text-xs font-semibold text-purple-400 group-hover:translate-x-1 transition">
                  <span>Start Chat Session</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </div>
              </Link>

              <Link href="/tickets" className="glass-panel p-6 rounded-2xl glass-panel-hover flex flex-col justify-between group">
                <div>
                  <div className="h-10 w-10 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 mb-4 group-hover:scale-110 transition">
                    <Ticket className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-lg text-white mb-1">My Support Tickets</h3>
                  <p className="text-xs text-gray-400">Track and create support requests.</p>
                </div>
                <div className="mt-6 flex items-center text-xs font-semibold text-fuchsia-400 group-hover:translate-x-1 transition">
                  <span>View My Tickets</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </div>
              </Link>
            </>
          )}
        </div>
      </main>
    </div>
  );
}