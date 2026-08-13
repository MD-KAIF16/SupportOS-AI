/**
 * Chat & RAG Pipeline Type Definitions.
 */

export interface RetrievedDocument {
  id?: string;
  title: string;
  content: string;
  score?: number;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  documents?: RetrievedDocument[];
}

export interface ConversationHistoryItem {
  id: string;
  user_id: string;
  tenant_id: string;
  question: string;
  reply: string;
  created_at: string;
}
