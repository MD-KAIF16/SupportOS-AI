import { Clock, AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react";

type Ticket = {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
};

type TicketCardProps = {
  ticket: Ticket;
};

export default function TicketCard({ ticket }: TicketCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "resolved":
      case "closed":
        return {
          bg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300",
          icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />,
        };
      case "escalated":
        return {
          bg: "bg-rose-500/10 border-rose-500/20 text-rose-300",
          icon: <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />,
        };
      case "pending":
      case "in progress":
        return {
          bg: "bg-amber-500/10 border-amber-500/20 text-amber-300",
          icon: <Clock className="h-3.5 w-3.5 text-amber-400" />,
        };
      default:
        return {
          bg: "bg-purple-500/10 border-purple-500/20 text-purple-300",
          icon: <AlertCircle className="h-3.5 w-3.5 text-purple-400" />,
        };
    }
  };

  const statusInfo = getStatusBadge(ticket.status);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/[0.08] glass-panel-hover flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
            {ticket.title}
          </h3>
          <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${statusInfo.bg}`}>
            {statusInfo.icon}
            <span className="capitalize">{ticket.status}</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed line-clamp-3">
          {ticket.description}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-wider text-gray-500">Priority:</span>
          <span className={`font-semibold ${
            ticket.priority?.toLowerCase() === "high"
              ? "text-rose-400"
              : ticket.priority?.toLowerCase() === "medium"
              ? "text-amber-400"
              : "text-purple-400"
          }`}>
            {ticket.priority || "Medium"}
          </span>
        </div>

        <span className="text-[11px] text-gray-500">
          Created {new Date(ticket.created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}