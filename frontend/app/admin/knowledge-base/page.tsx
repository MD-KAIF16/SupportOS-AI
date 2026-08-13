"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  getDocuments, 
  uploadDocumentFile, 
  createDocumentRaw, 
  deleteDocument 
} from "@/services/document.service";
import { 
  BookOpen, 
  Upload, 
  Trash2, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Clock
} from "lucide-react";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { KnowledgeDocument } from "@/types";

/**
 * Admin Knowledge Base Management Page.
 *
 * Allows tenant Administrators to upload PDF/TXT/MD files, submit raw text policies, view indexed documents, and manage vector deletion.
 */
export default function AdminKnowledgeBasePage() {
  const { token } = useAuth();

  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Raw text state
  const [showRawModal, setShowRawModal] = useState(false);
  const [rawTitle, setRawTitle] = useState("");
  const [rawContent, setRawContent] = useState("");

  async function loadDocs() {
    if (!token) return;
    try {
      setFetching(true);
      const res = await getDocuments(token);
      setDocuments(res.documents || []);
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to load Knowledge Base documents.");
    } finally {
      setFetching(false);
    }
  }

  useEffect(() => {
    loadDocs();
  }, [token]);

  // Handle File Upload (.pdf, .txt, .md)
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setError("");
    setSuccess("");
    setUploading(true);

    try {
      await uploadDocumentFile(file, file.name, token);
      setSuccess(`Document "${file.name}" uploaded and indexed in Qdrant successfully.`);
      loadDocs();
    } catch (err: any) {
      setError(err.message || "Failed to upload document file.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  // Handle Raw Text Submit
  async function handleRawSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rawTitle.trim() || !rawContent.trim() || !token) return;

    setError("");
    setSuccess("");
    setUploading(true);

    try {
      await createDocumentRaw(rawTitle, rawContent, token);
      setSuccess(`Document "${rawTitle}" stored and vector-indexed successfully.`);
      setRawTitle("");
      setRawContent("");
      setShowRawModal(false);
      loadDocs();
    } catch (err: any) {
      setError(err.message || "Failed to create document.");
    } finally {
      setUploading(false);
    }
  }

  // Handle Delete Document
  async function handleDelete(docId: string, title: string) {
    if (!token) return;
    if (!confirm(`Are you sure you want to delete "${title}"? This will remove its vector embeddings from Qdrant.`)) return;

    try {
      await deleteDocument(docId, token);
      setSuccess(`Document "${title}" removed from database and Qdrant index.`);
      loadDocs();
    } catch (err: any) {
      setError(err.message || "Failed to delete document.");
    }
  }

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Knowledge Base Management
            </h1>
            <p className="text-xs sm:text-sm text-gray-400">
              Manage company documents for Gemini RAG context & Qdrant vector retrieval.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowRawModal(true)}
            className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-gray-200 border border-white/[0.1] text-xs font-semibold flex items-center gap-2 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Add Raw Knowledge</span>
          </button>

          <label className="px-4 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 border border-purple-500/30 text-xs font-semibold flex items-center gap-2 cursor-pointer transition shadow-lg shadow-purple-500/10">
            <Upload className="h-4 w-4" />
            <span>{uploading ? "Uploading & Indexing..." : "Upload Document File"}</span>
            <input
              type="file"
              accept=".pdf,.txt,.md"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Notifications */}
      {success && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Raw Document Modal */}
      {showRawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 max-w-lg w-full relative space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-400" />
              Add Raw Knowledge Document
            </h3>

            <form onSubmit={handleRawSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Document Title</label>
                <Input
                  type="text"
                  placeholder="e.g. Enterprise SLA Policy"
                  value={rawTitle}
                  onChange={(e) => setRawTitle(e.target.value)}
                  name="title"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Document Content</label>
                <textarea
                  rows={5}
                  placeholder="Paste official company policy or documentation text here..."
                  value={rawContent}
                  onChange={(e) => setRawContent(e.target.value)}
                  className="w-full rounded-xl bg-white/[0.03] border border-white/10 p-3 text-xs text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRawModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <Button
                  text={uploading ? "Indexing..." : "Store & Vector Index"}
                  type="submit"
                  disabled={uploading || !rawTitle.trim() || !rawContent.trim()}
                />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Grid */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
          Indexed Documents ({documents.length})
        </h2>

        {fetching ? (
          <div className="text-center py-12 text-xs text-gray-400">Loading Knowledge Base documents...</div>
        ) : documents.length === 0 ? (
          <div className="glass-panel p-10 text-center rounded-2xl border border-white/[0.08] text-xs text-gray-400">
            No Knowledge Base documents found. Upload a PDF/TXT/MD file to begin RAG grounding.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {documents.map((doc) => (
              <div key={doc.id} className="glass-panel p-5 rounded-2xl border border-white/[0.08] flex flex-col justify-between hover:border-purple-500/30 transition group">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="h-4 w-4 text-purple-400 shrink-0" />
                      <h3 className="text-xs font-bold text-white truncate">{doc.title}</h3>
                    </div>
                    <button
                      onClick={() => handleDelete(doc.id, doc.title)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition opacity-80 group-hover:opacity-100"
                      title="Delete document"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <p className="text-[11px] text-gray-400 line-clamp-4 leading-relaxed mb-4">
                    {doc.content}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : "Indexed"}
                  </span>
                  <span className="text-purple-400 font-medium">Qdrant Indexed</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
