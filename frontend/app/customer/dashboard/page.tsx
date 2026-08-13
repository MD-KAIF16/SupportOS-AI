"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getTickets } from "@/services/ticket.service";
import { getChatHistory } from "@/services/chat.service";
import { 
  MessageSquare, 
  Ticket as TicketIcon, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  User, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle
} from "lucide-react";

/**
 * Customer Support Portal Dashboard Page.
 *
 * Provides instant access to AI Chat, customer support tickets, and recent support activity.
 */
export default function CustomerDashboardPage() {
  const { user, token } = useAuth();

  const [tickets, setTickets] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    async function loadData() {
      try {
        setLoading(true);

        const [tixRes, histRes] = await Promise.allSettled([
          getTickets(token!),
          getChatHistory(token!),
        ]);

        if (tixRes.status === "fulfilled" && tixRes.value?.tickets) {
          setTickets(tixRes.value.tickets);
        }

        if (histRes.status === "fulfilled" && histRes.value?.history) {
          setHistory(histRes.value.history);
        }
      } catch {
        // Handle gracefully
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [token]);

  const openCount = tickets.filter((t) => (t.status || "").toLowerCase() === "open").length;
  const escalatedCount = tickets.filter((t) => (t.status || "").toLowerCase() === "escalated").length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-purple-500/20 relative overflow-hidden bg-gradient-to-r from-purple-950/30 via-purple-900/10 to-transparent">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300 mb-3">
            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
            <span>SupportOS Autonomous Customer Support</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            Welcome, {user?.email?.split("@")[0] || "Customer"}!
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6">
            Get instant answers grounded in our official company knowledge base or manage your support tickets with our AI assistant.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/customer/chat"
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-2 transition shadow-lg shadow-purple-500/20"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Start AI Support Chat</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/customer/tickets"
              className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-gray-200 border border-white/[0.1] text-xs font-semibold flex items-center gap-2 transition"
            >
              <TicketIcon className="h-4 w-4" />
              <span>View My Tickets</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-panel p-5 rounded-2xl border border-white/[0.08]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Tickets</span>
            <TicketIcon className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{loading ? "..." : tickets.length}</div>
          <p className="text-[11px] text-gray-400 mt-1">Submitted support requests</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/[0.08]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Open Tickets</span>
            <Clock className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-blue-400">{loading ? "..." : openCount}</div>
          <p className="text-[11px] text-gray-400 mt-1">Awaiting resolution</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/[0.08]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Escalated to Human</span>
            <AlertCircle className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-300">{loading ? "..." : escalatedCount}</div>
          <p className="text-[11px] text-gray-400 mt-1">Assigned to support agent</p>
        </div>
      </div>

      {/* Recent Tickets Section */}
      <div className="glass-panel p-6 rounded-2xl border border-white/[0.08]">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <TicketIcon className="h-4 w-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white">Recent Support Tickets</h3>
          </div>
          <Link href="/customer/tickets" className="text-xs text-purple-400 hover:text-purple-300 transition">
            View All Tickets &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-6 text-xs text-gray-400">Loading tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-8 text-xs text-gray-400 flex flex-col items-center gap-2">
            <HelpCircle className="h-8 w-8 text-gray-500" />
            <span>No support tickets created yet.</span>
            <Link href="/customer/tickets" className="text-purple-400 hover:underline mt-1">
              Create a support ticket &rarr;
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.slice(0, 3).map((t) => (
              <div key={t.id} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-white truncate">{t.title || "Support Request"}</h4>
                  <p className="text-[11px] text-gray-400 truncate mt-0.5">{t.description}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold shrink-0 ${
                  (t.status || "").toLowerCase() === "escalated"
                    ? "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                    : "bg-blue-500/10 text-blue-300 border border-blue-500/30"
                }`}>
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
