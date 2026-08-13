"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Navigation from "@/components/layout/Navigation";
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
  Sparkles, 
  Plus, 
  ShieldAlert,
  Clock
} from "lucide-react";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";

type DocItem = {
  id: string;
  tenant_id: string;
  title: string;
  content: string;
  created_at: string;
};

export default function KnowledgeBasePage() {
  const router = useRouter();
  const { token, user, loading } = useAuth();

  const isAdmin = user?.role?.toLowerCase() === "admin";

  const [documents, setDocuments] = useState<DocItem[]>([]);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Raw text state
  const [showRawModal, setShowRawModal] = useState(false);
  const [rawTitle, setRawTitle] = useState("");
  const [rawContent, setRawContent] = useState("");

  async function loadDocs() {
    if (!token || !isAdmin) return;
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
    if (loading) return;
    if (!token) {
      router.replace("/");
      return;
    }
    if (isAdmin) {
      loadDocs();
    }
  }, [loading, token, isAdmin, router]);

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050507]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
          <span className="text-xs text-purple-300 font-medium">Loading Knowledge Base...</span>
        </div>
      </div>
    );
  }

  // Customer Access Denied View
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
          <div className="glass-panel p-10 rounded-3xl border border-rose-500/30 max-w-md w-full">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 mx-auto mb-4">
              <ShieldAlert className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-extrabold text-white">403 Forbidden</h2>
            <p className="text-xs text-gray-400 mt-2 mb-6">
              Knowledge Base management is reserved for Admin roles. Customer accounts cannot manage company support documents.
            </p>
            <Button text="Go to AI Chat" onClick={() => router.push("/chat")} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Company Knowledge Base
              </h1>
              <p className="text-xs sm:text-sm text-gray-400">
                Teach SupportOS AI about your company by uploading official documents.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowRawModal(!showRawModal)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl glass-panel text-xs font-semibold text-purple-300 border border-purple-500/30 hover:bg-purple-500/10 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Add Raw Text</span>
            </button>

            <label className="flex items-center gap-2 px-4 py-2 rounded-xl purple-glow-btn text-xs font-semibold text-white cursor-pointer select-none">
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

        {/* Feedback Banners */}
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

        {/* Add Raw Text Form Modal / Card */}
        {showRawModal && (
          <form onSubmit={handleRawSubmit} className="mb-8 glass-panel p-6 rounded-2xl border border-purple-500/30 space-y-4">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-400" />
              Add Knowledge Document Text
            </h3>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-300">
                Document Title
              </label>
              <Input
                type="text"
                placeholder="e.g. Refund Policy 2026"
                value={rawTitle}
                onChange={(e) => setRawTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-300">
                Document Content
              </label>
              <textarea
                rows={5}
                value={rawContent}
                onChange={(e) => setRawContent(e.target.value)}
                placeholder="Paste company support guidelines, policies, or documentation here..."
                className="w-full rounded-xl glass-input px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 transition duration-200 focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowRawModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <Button type="submit" text={uploading ? "Indexing..." : "Save & Index Vector"} disabled={uploading} />
            </div>
          </form>
        )}

        {/* Document List Table */}
        <div className="glass-panel rounded-2xl border border-white/[0.08] p-6">
          <h2 className="text-lg font-bold text-white tracking-tight mb-4 flex items-center justify-between">
            <span>Indexed Support Documents ({documents.length})</span>
            <span className="text-xs text-purple-300 font-normal">Supported: PDF, TXT, MD</span>
          </h2>

          {fetching ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-16 bg-white/5 rounded-xl" />
              ))}
            </div>
          ) : documents.length === 0 ? (
            <div className="py-12 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 mb-3">
                <FileText className="h-6 w-6" />
              </div>
              <p className="text-base font-semibold text-white">No documents uploaded yet</p>
              <p className="text-xs text-gray-400 mt-1">Upload a PDF/TXT document or paste text to train SupportOS AI RAG.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    <th className="pb-3 px-3">Document Title</th>
                    <th className="pb-3 px-3">Indexed Status</th>
                    <th className="pb-3 px-3">Upload Date</th>
                    <th className="pb-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] text-xs">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-white/[0.02] transition">
                      <td className="py-4 px-3 font-semibold text-white flex items-center gap-2">
                        <FileText className="h-4 w-4 text-purple-400 shrink-0" />
                        <span className="truncate max-w-xs">{doc.title}</span>
                      </td>
                      <td className="py-4 px-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300 border border-emerald-500/20">
                          <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                          Indexed in Qdrant
                        </span>
                      </td>
                      <td className="py-4 px-3 text-gray-400 flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-500" />
                        {new Date(doc.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-3 text-right">
                        <button
                          onClick={() => handleDelete(doc.id, doc.title)}
                          className="p-2 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                          title="Delete document and remove vector points"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
