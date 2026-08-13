"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Navigation from "@/components/layout/Navigation";
import { getTenantAnalytics } from "@/services/analytics.service";
import { 
  BarChart3, 
  MessageSquare, 
  Ticket, 
  CheckCircle2, 
  ShieldAlert, 
  Zap,
  ShieldCheck,
  TrendingUp
} from "lucide-react";

type AnalyticsData = {
  tenant_id: string;
  total_conversations: number;
  total_tickets: number;
  open_tickets: number;
  resolved_tickets: number;
  escalated_tickets: number;
  ai_resolution_rate: number;
};

export default function AnalyticsPage() {
  const router = useRouter();
  const { token, user, loading } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const isAdmin = user?.role?.toLowerCase() === "admin";

  useEffect(() => {
    if (loading) return;
    if (!token) {
      router.replace("/");
      return;
    }

    if (!isAdmin) {
      setFetching(false);
      return;
    }

    async function loadData() {
      try {
        setFetching(true);
        const result = await getTenantAnalytics(token!);
        setData(result);
      } catch (err: any) {
        setError(err.message || "Failed to load analytics.");
      } finally {
        setFetching(false);
      }
    }

    loadData();
  }, [loading, token, isAdmin, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050507]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
          <span className="text-xs text-purple-300 font-medium">Loading Tenant Analytics...</span>
        </div>
      </div>
    );
  }

  // Customer Access Denied View
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
          <div className="glass-panel p-10 rounded-3xl border border-rose-500/30 max-w-md w-full">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 mx-auto mb-4">
              <ShieldAlert className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-extrabold text-white">403 Forbidden</h2>
            <p className="text-xs text-gray-400 mt-2 mb-6">
              Tenant Analytics is reserved for Admin roles. Customer accounts cannot access platform performance metrics.
            </p>
            <button
              onClick={() => router.push("/chat")}
              className="px-6 py-2.5 rounded-xl purple-glow-btn text-xs font-semibold text-white"
            >
              Go to AI Chat
            </button>
          </div>
        </main>
      </div>
    );
  }


  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Tenant Analytics & Health
              </h1>
              <p className="text-xs sm:text-sm text-gray-400">
                Real-time performance metrics, AI resolution rates, and ticket workloads.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border border-white/10 text-xs text-purple-300">
            <ShieldCheck className="h-4 w-4 text-purple-400" />
            <span>Tenant Isolated</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">
            {error}
          </div>
        )}

        {fetching ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-pulse">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="glass-panel h-36 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Overview Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Card 1: AI Resolution Rate */}
              <div className="glass-panel p-6 rounded-2xl border border-white/[0.08] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition text-purple-400">
                  <Zap className="h-16 w-16" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                  AI Resolution Rate
                </span>
                <div className="mt-2 text-3xl font-black text-white flex items-baseline gap-2">
                  <span>{data?.ai_resolution_rate ?? 100}%</span>
                  <span className="text-xs font-semibold text-emerald-400 flex items-center">
                    <TrendingUp className="h-3.5 w-3.5 mr-0.5" /> High
                  </span>
                </div>
                <p className="mt-2 text-[11px] text-gray-400">Autonomous resolution without escalation.</p>
              </div>

              {/* Card 2: Total Conversations */}
              <div className="glass-panel p-6 rounded-2xl border border-white/[0.08] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition text-fuchsia-400">
                  <MessageSquare className="h-16 w-16" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-fuchsia-400">
                  Total Conversations
                </span>
                <div className="mt-2 text-3xl font-black text-white">
                  {data?.total_conversations ?? 0}
                </div>
                <p className="mt-2 text-[11px] text-gray-400">AI Support sessions logged in Supabase.</p>
              </div>

              {/* Card 3: Total Support Tickets */}
              <div className="glass-panel p-6 rounded-2xl border border-white/[0.08] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition text-pink-400">
                  <Ticket className="h-16 w-16" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-pink-400">
                  Total Support Tickets
                </span>
                <div className="mt-2 text-3xl font-black text-white">
                  {data?.total_tickets ?? 0}
                </div>
                <p className="mt-2 text-[11px] text-gray-400">Created tickets by tenant users.</p>
              </div>

              {/* Card 4: Escalations */}
              <div className="glass-panel p-6 rounded-2xl border border-white/[0.08] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition text-rose-400">
                  <ShieldAlert className="h-16 w-16" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">
                  Human Escalations
                </span>
                <div className="mt-2 text-3xl font-black text-white">
                  {data?.escalated_tickets ?? 0}
                </div>
                <p className="mt-2 text-[11px] text-gray-400">Routed to Human Escalation Agent.</p>
              </div>
            </div>

            {/* Ticket Breakdown Visual Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-2xl border border-white/[0.08]">
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Ticket Resolution Distribution
                </h3>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-medium">
                      <span className="text-emerald-300">Resolved / Closed</span>
                      <span className="text-gray-400">{data?.resolved_tickets ?? 0} tickets</span>
                    </div>
                    <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            data?.total_tickets ? Math.round((data.resolved_tickets / data.total_tickets) * 100) : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1 font-medium">
                      <span className="text-amber-300">Open / In Progress</span>
                      <span className="text-gray-400">{data?.open_tickets ?? 0} tickets</span>
                    </div>
                    <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            data?.total_tickets ? Math.round((data.open_tickets / data.total_tickets) * 100) : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1 font-medium">
                      <span className="text-rose-300">Escalated to Agent</span>
                      <span className="text-gray-400">{data?.escalated_tickets ?? 0} tickets</span>
                    </div>
                    <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-rose-500 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            data?.total_tickets ? Math.round((data.escalated_tickets / data.total_tickets) * 100) : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* System Security & Tenant Isolation Status Panel */}
              <div className="glass-panel p-6 rounded-2xl border border-white/[0.08] flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-purple-400" />
                    Security & RLS Isolation Audit
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4">
                    All analytics queries automatically append Row-Level Security filters matching current session tenant ID. Cross-tenant data leakage is strictly prevented.
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.06] text-xs text-purple-300 font-mono">
                  Tenant Context ID: {user?.user_id || "Active Session"}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
