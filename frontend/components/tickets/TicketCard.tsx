// ======================================================
// Ticket Card
//
// Purpose:
// Displays a single support ticket.
// ======================================================

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

export default function TicketCard({
  ticket,
}: TicketCardProps) {

  return (

    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg">

      {/* ==========================================
          Ticket Title
      ========================================== */}

      <h2 className="text-2xl font-bold text-gray-900">

        {ticket.title}

      </h2>

      {/* ==========================================
          Description
      ========================================== */}

      <p className="mt-3 text-gray-700">

        {ticket.description}

      </p>

      {/* ==========================================
          Status & Priority
      ========================================== */}

      <div className="mt-5 flex flex-wrap gap-4">

        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">

          Status: {ticket.status}

        </span>

        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${
            ticket.priority === "High"
              ? "bg-red-100 text-red-700"
              : ticket.priority === "Medium"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >

          Priority: {ticket.priority}

        </span>

      </div>

      {/* ==========================================
          Created Date
      ========================================== */}

      <p className="mt-5 text-sm text-gray-500">

        Created on{" "}
        {new Date(ticket.created_at).toLocaleDateString()}

      </p>

    </div>

  );

}