// ======================================================
// Chat Header Component
// ======================================================

import Logo from "../common/Logo";

export default function ChatHeader() {

  return (

    <div className="mb-6 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">

      <div className="flex items-center gap-4">

        {/* =========================================
            Logo
        ========================================== */}

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 shadow-sm">

          <Logo size={52} />

        </div>

        {/* =========================================
            Title
        ========================================== */}

        <div className="flex flex-col">

          <h1 className="text-3xl font-bold tracking-tight text-slate-800">

            SupportOS AI

          </h1>

          <p className="mt-1 text-sm text-slate-500">

            Intelligent Multi-Agent Customer Support Platform

          </p>

        </div>

        {/* =========================================
            Status
        ========================================== */}

        <div className="ml-auto flex items-center gap-2 rounded-full bg-green-50 px-4 py-2">

          <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></span>

          <span className="text-sm font-medium text-green-700">

            Online

          </span>

        </div>

      </div>

    </div>

  );

}