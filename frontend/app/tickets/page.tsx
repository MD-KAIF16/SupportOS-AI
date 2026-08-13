"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { getTickets } from "@/services/ticket.service";
import Navigation from "@/components/layout/Navigation";
import TicketCard from "@/components/tickets/TicketCard";
import CreateTicketForm from "@/components/tickets/CreateTicketForm";
import { Ticket as TicketIcon, AlertCircle } from "lucide-react";

type Ticket = {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
};

export default function TicketsPage() {
  const router = useRouter();
  const { token, loading } = useAuth();

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
      console.error(err);
      setError(err.message || "Failed to load support tickets.");
    } finally {
      setFetching(false);
    }
  }

  useEffect(() => {
    if (loading) return;
    if (!token) {
      router.replace("/");
      return;
    }
    loadTickets();
  }, [loading, token, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050507]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
          <span className="text-xs text-purple-300 font-medium">Loading Support Tickets...</span>
        </div>
      </div>
    );
  }

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <TicketIcon className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Support Tickets
              </h1>
              <p className="text-xs sm:text-sm text-gray-400">
                View open requests, submit issues, and track agent resolutions.
              </p>
            </div>
          </div>
        </div>

        {/* Create Ticket Form Component */}
        <CreateTicketForm onTicketCreated={loadTickets} />

        {/* Error Callout */}
        {error && (
          <div className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Ticket Grid List */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            Your Active Tickets ({tickets.length})
          </h2>

          {fetching ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2].map((n) => (
                <div key={n} className="glass-panel p-6 rounded-2xl animate-pulse h-40" />
              ))}
            </div>
          ) : tickets.length === 0 ? (
            <div className="glass-panel p-10 rounded-2xl text-center border border-white/10">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 mb-3">
                <TicketIcon className="h-6 w-6" />
              </div>
              <p className="text-base font-semibold text-white">No support tickets found</p>
              <p className="text-xs text-gray-400 mt-1">Submit your first ticket using the form above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}