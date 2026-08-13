/**
 * Support Ticket System Type Definitions.
 */

export type TicketStatus = "Open" | "Pending" | "Escalated" | "Resolved";
export type TicketPriority = "Low" | "Medium" | "High";

export interface Ticket {
  id: string;
  user_id: string;
  tenant_id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  created_at: string;
  updated_at?: string;
}

export interface CreateTicketPayload {
  title: string;
  description: string;
  priority?: TicketPriority;
}
