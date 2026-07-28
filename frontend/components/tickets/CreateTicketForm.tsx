"use client";

// ======================================================
// Create Ticket Form
//
// Purpose:
// Allows authenticated users to create a new support ticket.
// ======================================================

import { useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { createTicket } from "@/services/ticket.service";

// ======================================================
// Props
// ======================================================

type Props = {
  onTicketCreated: () => void;
};

// ======================================================
// Component
// ======================================================

export default function CreateTicketForm({
  onTicketCreated,
}: Props) {

  const { token } = useAuth();

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  // ======================================================
  // Submit Form
  // ======================================================

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {

    e.preventDefault();

    setError("");
    setSuccess("");

    if (!title.trim() || !description.trim()) {

      setError("Please fill all fields.");

      return;

    }

    if (!token) {

      setError("Session expired. Please login again.");

      return;

    }

    try {

      setLoading(true);

      await createTicket(
        title,
        description,
        token
      );

      setSuccess("Ticket created successfully.");

      setTitle("");

      setDescription("");

      onTicketCreated();

    } catch (err: any) {

      setError(
        err.message || "Failed to create ticket."
      );

    } finally {

      setLoading(false);

    }

  }

  // ======================================================
  // UI
  // ======================================================

  return (

    <div className="mb-8 rounded-xl bg-white p-8 shadow-md">

      <h2 className="mb-6 text-3xl font-bold text-gray-900">

        Create New Ticket

      </h2>

      {

        success && (

          <div className="mb-6 rounded-lg border border-green-300 bg-green-100 px-4 py-3 text-green-700">

            {success}

          </div>

        )

      }

      {

        error && (

          <div className="mb-6 rounded-lg border border-red-300 bg-red-100 px-4 py-3 text-red-700">

            {error}

          </div>

        )

      }

      <form onSubmit={handleSubmit}>

        {/* ================================
            Title
        ================================= */}

        <div className="mb-5">

          <label className="mb-2 block text-lg font-medium text-gray-800">

            Title

          </label>

          <input
            type="text"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="Enter ticket title"
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
          />

        </div>

        {/* ================================
            Description
        ================================= */}

        <div className="mb-6">

          <label className="mb-2 block text-lg font-medium text-gray-800">

            Description

          </label>

          <textarea
            rows={6}
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            placeholder="Describe your issue..."
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
          />

        </div>

        {/* ================================
            Button
        ================================= */}

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >

          {

            loading

              ? "Creating..."

              : "Create Ticket"

          }

        </button>

      </form>

    </div>

  );

}