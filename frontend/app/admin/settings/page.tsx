"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  Settings as SettingsIcon, 
  Building2, 
  ShieldCheck, 
  Bell, 
  Sparkles, 
  CheckCircle2, 
  Save, 
  Clock, 
  Sliders
} from "lucide-react";

/**
 * Admin Workspace & Organization Settings Page.
 *
 * Provides control over AI assistant behavior, support notification preferences, team overview, and organization details.
 */
export default function AdminSettingsPage() {
  const { user } = useAuth();

  const [aiTone, setAiTone] = useState<string>("friendly");
  const [operatingHours, setOperatingHours] = useState<string>("247");
  const [notifyEscalations, setNotifyEscalations] = useState<boolean>(true);
  const [notifyDigest, setNotifyDigest] = useState<boolean>(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <SettingsIcon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Organization Settings
            </h1>
            <p className="text-xs sm:text-sm text-gray-400">
              Configure support workspace preferences, AI response behavior, and notification alerts.
            </p>
          </div>
        </div>
      </div>

      {saved && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>Workspace settings updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Workspace Identity */}
        <div className="glass-panel p-6 rounded-2xl border border-white/[0.08] space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Building2 className="h-4 w-4 text-purple-400" />
            Workspace Profile
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Organization Name</label>
              <input
                type="text"
                value="SupportOS AI Enterprise"
                disabled
                className="w-full rounded-xl bg-white/[0.03] border border-white/10 px-3.5 py-2.5 text-xs text-white opacity-80"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Admin Email</label>
              <input
                type="text"
                value={user?.email || "admin@supportos.ai"}
                disabled
                className="w-full rounded-xl bg-white/[0.03] border border-white/10 px-3.5 py-2.5 text-xs text-white opacity-80"
              />
            </div>
          </div>
        </div>

        {/* AI Behavior Preferences */}
        <div className="glass-panel p-6 rounded-2xl border border-white/[0.08] space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-400" />
            AI Assistant Configuration
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Response Personality & Tone</label>
              <select
                value={aiTone}
                onChange={(e) => setAiTone(e.target.value)}
                className="w-full sm:w-80 rounded-xl bg-white/[0.04] border border-white/10 px-3.5 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="friendly" className="bg-[#050507]">Helpful & Friendly (Recommended)</option>
                <option value="formal" className="bg-[#050507]">Professional & Formal</option>
                <option value="concise" className="bg-[#050507]">Concise & Direct</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">AI Service Operating Model</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className={`p-3.5 rounded-xl border text-xs cursor-pointer transition ${
                  operatingHours === "247"
                    ? "bg-purple-600/10 border-purple-500/30 text-white"
                    : "bg-white/[0.02] border-white/10 text-gray-400 hover:text-white"
                }`}>
                  <input
                    type="radio"
                    name="opHours"
                    value="247"
                    checked={operatingHours === "247"}
                    onChange={() => setOperatingHours("247")}
                    className="hidden"
                  />
                  <div className="font-semibold text-white mb-0.5">24/7 Autonomous AI Resolution</div>
                  <div className="text-[11px] text-gray-400">AI responds continuously and escalates unhandled issues automatically.</div>
                </label>

                <label className={`p-3.5 rounded-xl border text-xs cursor-pointer transition ${
                  operatingHours === "business"
                    ? "bg-purple-600/10 border-purple-500/30 text-white"
                    : "bg-white/[0.02] border-white/10 text-gray-400 hover:text-white"
                }`}>
                  <input
                    type="radio"
                    name="opHours"
                    value="business"
                    checked={operatingHours === "business"}
                    onChange={() => setOperatingHours("business")}
                    className="hidden"
                  />
                  <div className="font-semibold text-white mb-0.5">Business Hours Hybrid Handoff</div>
                  <div className="text-[11px] text-gray-400">AI handles initial inquiries and flags tickets during business hours.</div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-panel p-6 rounded-2xl border border-white/[0.08] space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Bell className="h-4 w-4 text-purple-400" />
            Support Notification Preferences
          </h2>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-white block">Escalation Email Alerts</span>
                <span className="text-[11px] text-gray-400">Receive instant notification when AI escalates a support ticket to human queue.</span>
              </div>
              <input
                type="checkbox"
                checked={notifyEscalations}
                onChange={(e) => setNotifyEscalations(e.target.checked)}
                className="h-4 w-4 rounded accent-purple-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-white block">Daily Performance Digest</span>
                <span className="text-[11px] text-gray-400">Receive daily summary of total support volume and AI resolution rate.</span>
              </div>
              <input
                type="checkbox"
                checked={notifyDigest}
                onChange={(e) => setNotifyDigest(e.target.checked)}
                className="h-4 w-4 rounded accent-purple-500"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-2 transition shadow-lg shadow-purple-500/20"
          >
            <Save className="h-4 w-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
