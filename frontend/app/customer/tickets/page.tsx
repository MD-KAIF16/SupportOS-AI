"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getTickets } from "@/services/ticket.service";
import TicketCard from "@/components/tickets/TicketCard";
import CreateTicketForm from "@/components/tickets/CreateTicketForm";
import { Ticket as TicketIcon, AlertCircle } from "lucide-react";
import { Ticket } from "@/types";

/**
 * Customer My Tickets Page.
 */
export default function CustomerTicketsPage() {
  const { token } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(true);

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

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <TicketIcon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              My Support Tickets
            </h1>
            <p className="text-xs sm:text-sm text-gray-400">
              Submit issues, view ticket status, and track human agent resolutions.
            </p>
          </div>
        </div>
      </div>

      {/* Create Ticket Form Component */}
      <CreateTicketForm onTicketCreated={loadTickets} />

      {/* Error Banner */}
      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Ticket List */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
          Ticket History ({tickets.length})
        </h2>

        {fetching ? (
          <div className="text-center py-10 text-xs text-gray-400">Loading tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="glass-panel p-8 text-center rounded-2xl border border-white/[0.08] text-xs text-gray-400">
            No support tickets submitted yet. Use the form above to submit a new ticket.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tickets.map((t) => (
              <TicketCard key={t.id} ticket={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
