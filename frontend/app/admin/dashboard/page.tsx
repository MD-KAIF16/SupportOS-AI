"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getTenantAnalytics } from "@/services/analytics.service";
import { getDocuments } from "@/services/document.service";
import { getTickets } from "@/services/ticket.service";
import { 
  BookOpen, 
  BarChart3, 
  Ticket, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Sparkles
} from "lucide-react";

/**
 * Admin Operational Dashboard Page.
 *
 * Displays live tenant support metrics, knowledge base status, support volume, and quick action shortcuts.
 */
export default function AdminDashboardPage() {
  const { token } = useAuth();

  const [docCount, setDocCount] = useState<number>(0);
  const [ticketCount, setTicketCount] = useState<number>(0);
  const [openTickets, setOpenTickets] = useState<number>(0);
  const [escalatedTickets, setEscalatedTickets] = useState<number>(0);
  const [aiRate, setAiRate] = useState<number>(100);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    async function loadDashboard() {
      try {
        setLoading(true);

        const [analyticsRes, docsRes, tixRes] = await Promise.allSettled([
          getTenantAnalytics(token!),
          getDocuments(token!),
          getTickets(token!),
        ]);

        if (analyticsRes.status === "fulfilled" && analyticsRes.value) {
          setAiRate(analyticsRes.value.ai_resolution_rate ?? 100);
          setEscalatedTickets(analyticsRes.value.escalated_tickets ?? 0);
          setOpenTickets(analyticsRes.value.open_tickets ?? 0);
        }

        if (docsRes.status === "fulfilled" && docsRes.value?.documents) {
          setDocCount(docsRes.value.documents.length);
        }

        if (tixRes.status === "fulfilled" && tixRes.value?.tickets) {
          setTicketCount(tixRes.value.tickets.length);
        }
      } catch {
        // Handle gracefully
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [token]);

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300 mb-3">
            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
            <span>SupportOS AI Enterprise Workspace</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin Console Overview</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Real-time multi-tenant support metrics, knowledge base status, and ticket oversight.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/knowledge-base"
            className="px-4 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 border border-purple-500/30 text-xs font-semibold flex items-center gap-2 transition shadow-lg shadow-purple-500/10"
          >
            <BookOpen className="h-4 w-4" />
            <span>Manage Knowledge Base</span>
          </Link>
        </div>
      </div>

      {/* Operational Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <div className="glass-panel p-5 rounded-2xl border border-white/[0.08] relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Indexed Knowledge</span>
            <div className="h-9 w-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <BookOpen className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white mb-1">
            {loading ? "..." : docCount}
          </div>
          <p className="text-[11px] text-gray-400">
            Active RAG documents ground AI responses
          </p>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel p-5 rounded-2xl border border-white/[0.08] relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Support Tickets</span>
            <div className="h-9 w-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Ticket className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white mb-1">
            {loading ? "..." : ticketCount}
          </div>
          <p className="text-[11px] text-gray-400">
            {openTickets} open / {escalatedTickets} escalated
          </p>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel p-5 rounded-2xl border border-white/[0.08] relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">AI Autonomous Resolution</span>
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 mb-1">
            {loading ? "..." : `${aiRate}%`}
          </div>
          <p className="text-[11px] text-gray-400">
            Resolved without human agent escalation
          </p>
        </div>

        {/* Metric 4 */}
        <div className="glass-panel p-5 rounded-2xl border border-white/[0.08] relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Escalated Tickets</span>
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-300 mb-1">
            {loading ? "..." : escalatedTickets}
          </div>
          <p className="text-[11px] text-gray-400">
            High priority human handoff queue
          </p>
        </div>
      </div>

      {/* Quick Launch & Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Knowledge Base Control */}
        <div className="glass-panel p-6 rounded-2xl border border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Company Knowledge Base</h3>
                <p className="text-xs text-gray-400">Upload PDF, TXT, MD, or raw text policies</p>
              </div>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed mb-6">
              Documents are automatically chunked, embedded via Gemini, and indexed into vector search for instant customer AI retrieval.
            </p>
          </div>
          <Link
            href="/admin/knowledge-base"
            className="w-full py-2.5 px-4 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 border border-purple-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <span>Open Knowledge Manager</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Analytics Control */}
        <div className="glass-panel p-6 rounded-2xl border border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Platform Performance Analytics</h3>
                <p className="text-xs text-gray-400">Tenant-level metrics and AI performance</p>
              </div>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed mb-6">
              Monitor conversation volumes, ticket resolution breakdown, escalation rates, and AI efficiency across tenant partitions.
            </p>
          </div>
          <Link
            href="/admin/analytics"
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600/30 hover:bg-blue-600/40 text-blue-200 border border-blue-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <span>View Performance Analytics</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
