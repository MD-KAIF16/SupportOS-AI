"use client";

import { useState } from "react";
import { PlusCircle, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { createTicket } from "@/services/ticket.service";
import Input from "../common/Input";
import Button from "../common/Button";

type Props = {
  onTicketCreated: () => void;
};

export default function CreateTicketForm({ onTicketCreated }: Props) {
  const { token } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title.trim() || !description.trim()) {
      setError("Please fill in both title and description.");
      return;
    }

    if (!token) {
      setError("Session expired. Please login again.");
      return;
    }

    try {
      setLoading(true);
      await createTicket(title, description, token);

      setSuccess("Support ticket created successfully.");
      setTitle("");
      setDescription("");
      onTicketCreated();
    } catch (err: any) {
      setError(err.message || "Failed to create ticket.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-8 rounded-2xl glass-panel p-6 sm:p-8 border border-white/10 shadow-2xl">
      <div className="flex items-center gap-2 mb-6">
        <PlusCircle className="h-5 w-5 text-purple-400" />
        <h2 className="text-xl font-bold text-white tracking-tight">Create Support Ticket</h2>
      </div>

      {success && (
        <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-300">
            Ticket Title
          </label>
          <Input
            type="text"
            placeholder="Brief summary of your support request"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-300">
            Issue Description
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide relevant details, steps to reproduce, or error messages..."
            className="w-full rounded-xl glass-input px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 transition duration-200 focus:outline-none"
          />
        </div>

        <div className="flex justify-end">
          <div className="w-full sm:w-48">
            <Button
              type="submit"
              text={loading ? "Creating..." : "Submit Ticket"}
              disabled={loading}
              icon={loading ? <Sparkles className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
            />
          </div>
        </div>
      </form>
    </div>
  );
}