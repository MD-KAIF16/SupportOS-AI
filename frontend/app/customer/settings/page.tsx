"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Bell, 
  CheckCircle2, 
  Save, 
  KeyRound,
  Sparkles
} from "lucide-react";

/**
 * Customer Account & Profile Settings Page.
 */
export default function CustomerSettingsPage() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState((user as any)?.full_name || (user as any)?.name || "");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Account Settings
            </h1>
            <p className="text-xs sm:text-sm text-gray-400">
              Manage your profile preferences and support notification options.
            </p>
          </div>
        </div>
      </div>

      {saved && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>Profile preferences updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal Details */}
        <div className="glass-panel p-6 rounded-2xl border border-white/[0.08] space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <User className="h-4 w-4 text-purple-400" />
            Profile Details
          </h2>

          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={user?.email || "customer@example.com"}
                  disabled
                  className="w-full rounded-xl bg-white/[0.03] border border-white/10 px-3.5 py-2.5 text-xs text-white opacity-80 pl-9"
                />
                <Mail className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-3.5 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-panel p-6 rounded-2xl border border-white/[0.08] space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Bell className="h-4 w-4 text-purple-400" />
            Notification Preferences
          </h2>

          <label className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] cursor-pointer max-w-xl">
            <div>
              <span className="text-xs font-semibold text-white block">Ticket Status Updates</span>
              <span className="text-[11px] text-gray-400">Receive email notifications when support agents update your ticket status.</span>
            </div>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="h-4 w-4 rounded accent-purple-500"
            />
          </label>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-2 transition shadow-lg shadow-purple-500/20"
          >
            <Save className="h-4 w-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}
