"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getTenantAnalytics } from "@/services/analytics.service";
import { 
  BarChart3, 
  MessageSquare, 
  Ticket, 
  CheckCircle2, 
  ShieldAlert, 
  Zap,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { TenantAnalytics } from "@/types";

/**
 * Admin Analytics Page.
 *
 * Displays tenant-scoped platform metric cards, resolution rates, ticket breakdowns, and conversation stats.
 */
export default function AdminAnalyticsPage() {
  const { token } = useAuth();
  const [data, setData] = useState<TenantAnalytics | null>(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    async function loadData() {
      try {
        setFetching(true);
        const result = await getTenantAnalytics(token!);
        setData(result);
        setError("");
      } catch (err: any) {
        setError(err.message || "Failed to load analytics data.");
      } finally {
        setFetching(false);
      }
    }

    loadData();
  }, [token]);

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Tenant Analytics & Performance
            </h1>
            <p className="text-xs sm:text-sm text-gray-400">
              Real-time platform metrics, AI resolution efficiency, and support volume analytics.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {fetching ? (
        <div className="text-center py-16 text-xs text-gray-400">Loading analytics metrics...</div>
      ) : !data ? (
        <div className="glass-panel p-10 text-center rounded-2xl border border-white/[0.08] text-xs text-gray-400">
          No analytics data available for this tenant workspace.
        </div>
      ) : (
        <div className="space-y-8">
          {/* Performance Overview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Conversations */}
            <div className="glass-panel p-5 rounded-2xl border border-white/[0.08]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Conversations</span>
                <div className="h-9 w-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <MessageSquare className="h-4 w-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-white mb-1">
                {data.total_conversations}
              </div>
              <p className="text-[11px] text-gray-400">AI chat sessions conducted</p>
            </div>

            {/* Total Tickets */}
            <div className="glass-panel p-5 rounded-2xl border border-white/[0.08]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Tickets</span>
                <div className="h-9 w-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Ticket className="h-4 w-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-white mb-1">
                {data.total_tickets}
              </div>
              <p className="text-[11px] text-gray-400">Support tickets submitted</p>
            </div>

            {/* AI Resolution Rate */}
            <div className="glass-panel p-5 rounded-2xl border border-white/[0.08]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">AI Resolution Rate</span>
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Zap className="h-4 w-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-emerald-400 mb-1">
                {data.ai_resolution_rate}%
              </div>
              <p className="text-[11px] text-gray-400">Resolved without human handoff</p>
            </div>

            {/* Escalations */}
            <div className="glass-panel p-5 rounded-2xl border border-white/[0.08]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Human Escalations</span>
                <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-amber-300 mb-1">
                {data.escalated_tickets}
              </div>
              <p className="text-[11px] text-gray-400">Escalated to human support</p>
            </div>
          </div>

          {/* Ticket Breakdown Card */}
          <div className="glass-panel p-6 rounded-2xl border border-white/[0.08] space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Ticket className="h-4 w-4 text-purple-400" />
              Ticket Status Breakdown
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <span className="text-xs text-gray-400 font-medium">Open Tickets</span>
                <div className="text-2xl font-bold text-blue-400 mt-1">{data.open_tickets}</div>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <span className="text-xs text-gray-400 font-medium">Resolved Tickets</span>
                <div className="text-2xl font-bold text-emerald-400 mt-1">{data.resolved_tickets}</div>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <span className="text-xs text-gray-400 font-medium">Escalated Tickets</span>
                <div className="text-2xl font-bold text-amber-400 mt-1">{data.escalated_tickets}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
