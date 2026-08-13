/**
 * Knowledge Base Document Type Definitions.
 */

export interface KnowledgeDocument {
  id: string;
  tenant_id: string;
  title: string;
  content: string;
  created_at: string;
  file_type?: string;
  chunk_count?: number;
}

export interface DocumentListResponse {
  success: boolean;
  documents: KnowledgeDocument[];
}
