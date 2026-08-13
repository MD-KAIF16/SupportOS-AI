/**
 * Tenant Analytics Summary Type Definitions.
 */

export interface TenantAnalytics {
  tenant_id: string;
  total_conversations: number;
  total_tickets: number;
  open_tickets: number;
  resolved_tickets: number;
  escalated_tickets: number;
  ai_resolution_rate: number;
  total_documents?: number;
}
