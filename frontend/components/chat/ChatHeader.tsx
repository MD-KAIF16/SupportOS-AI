// ======================================================
// Chat Header Component
// ======================================================

import Logo from "../common/Logo";

export default function ChatHeader() {
  return (

    <div className="mb-6 flex flex-col items-center border-b border-slate-200 pb-6">

      {/* Logo */}

      <div className="rounded-full bg-blue-50 p-3 shadow-sm">
        <Logo size={60} />
      </div>

      {/* Heading */}

      <h1 className="mt-5 text-4xl font-bold text-slate-800">
        SupportOS AI
      </h1>

      {/* Subtitle */}

      <p className="mt-2 text-center text-slate-500">
        Intelligent Customer Support Platform
      </p>

    </div>

  );

}