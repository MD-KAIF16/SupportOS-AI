"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getTickets } from "@/services/ticket.service";
import TicketCard from "@/components/tickets/TicketCard";
import { Ticket as TicketIcon, AlertCircle, Filter } from "lucide-react";
import { Ticket } from "@/types";

/**
 * Admin Ticket Oversight Page.
 *
 * Provides tenant-wide support ticket monitoring, filter controls (Open, Escalated, Pending, Resolved), and agent workload management.
 */
export default function AdminTicketsPage() {
  const { token } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  async function loadTickets() {
    if (!token) return;
    try {
      setFetching(true);
      const result = await getTickets(token);
      setTickets(result.tickets || []);
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to load support tickets.");
    } finally {
      setFetching(false);
    }
  }

  useEffect(() => {
    loadTickets();
  }, [token]);

  const filteredTickets = tickets.filter((t) => {
    if (filter === "all") return true;
    return (t.status || "").toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <TicketIcon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Support Ticket Oversight
            </h1>
            <p className="text-xs sm:text-sm text-gray-400">
              Tenant-wide ticket monitoring, human escalation queue, and resolution tracking.
            </p>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-white/[0.04] rounded-xl border border-white/[0.06]">
          {["all", "open", "escalated", "pending", "resolved"].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                filter === st
                  ? "bg-purple-600/30 text-purple-300 border border-purple-500/30 shadow"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Ticket List */}
      <div>
        {fetching ? (
          <div className="text-center py-12 text-xs text-gray-400">Loading support tickets...</div>
        ) : filteredTickets.length === 0 ? (
          <div className="glass-panel p-10 text-center rounded-2xl border border-white/[0.08] text-xs text-gray-400">
            No support tickets match the selected filter status.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredTickets.map((t) => (
              <TicketCard key={t.id} ticket={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
