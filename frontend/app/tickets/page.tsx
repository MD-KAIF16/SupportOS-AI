"use client";

// ======================================================
// Tickets Page
//
// Purpose:
// Protected page to display and create support tickets.
// ======================================================

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

import {
  getTickets,
} from "@/services/ticket.service";

import TicketCard from "@/components/tickets/TicketCard";
import CreateTicketForm from "@/components/tickets/CreateTicketForm";

// ======================================================
// Ticket Type
// ======================================================

type Ticket = {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
};

// ======================================================
// Tickets Page
// ======================================================

export default function TicketsPage() {

  const router = useRouter();

  const { token, loading } = useAuth();

  const [tickets, setTickets] = useState<Ticket[]>([]);

  const [error, setError] = useState("");

  // ======================================================
  // Load Tickets
  // ======================================================

  async function loadTickets() {

    if (!token) return;

    try {

      const result = await getTickets(token);

      setTickets(result.tickets);

      setError("");

    } catch (err: any) {

      console.error(err);

      setError(
        err.message || "Failed to load tickets."
      );

    }

  }

  // ======================================================
  // Initial Load
  // ======================================================

  useEffect(() => {

    if (loading) return;

    if (!token) {

      router.replace("/");

      return;

    }

    loadTickets();

  }, [loading, token, router]);

  // ======================================================
  // Loading
  // ======================================================

  if (loading) {

    return (

      <div className="flex min-h-screen items-center justify-center text-xl font-semibold">

        Loading...

      </div>

    );

  }

  // ======================================================
  // Not Logged In
  // ======================================================

  if (!token) {

    return null;

  }

  // ======================================================
  // UI
  // ======================================================

  return (

    <main className="min-h-screen bg-gray-100 py-10">

      <div className="mx-auto max-w-5xl px-6">

        {/* ==========================================
            Heading
        ========================================== */}

        <h1 className="mb-8 text-4xl font-bold text-gray-900">

          My Support Tickets

        </h1>

        {/* ==========================================
            Create Ticket Form
        ========================================== */}

        <CreateTicketForm
          onTicketCreated={loadTickets}
        />

        {/* ==========================================
            Error
        ========================================== */}

        {

          error && (

            <div className="mb-6 rounded-lg border border-red-300 bg-red-100 p-4 text-red-700">

              {error}

            </div>

          )

        }

        {/* ==========================================
            Ticket List
        ========================================== */}

        {

          tickets.length === 0 ? (

            <div className="rounded-xl bg-white p-10 text-center shadow">

              <p className="text-lg text-gray-500">

                No support tickets found.

              </p>

            </div>

          ) : (

            <div className="space-y-6">

              {

                tickets.map((ticket) => (

                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                  />

                ))

              }

            </div>

          )

        }

      </div>

    </main>

  );

}