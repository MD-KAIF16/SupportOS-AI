// ======================================================
// SupportOS AI - Login Page
// Day 3 - Next.js + Tailwind CSS
// Author : MD Kaif
// ======================================================

export default function Home() {
  return (
    // ==================================================
    // Main Container
    // - min-h-screen -> Full screen height
    // - flex -> Enable Flexbox
    // - items-center -> Vertical Center
    // - justify-center -> Horizontal Center
    // - bg-gradient -> Premium Background
    // ==================================================
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-blue-100 px-4">

      {/* ==================================================
          Login Card
          ================================================== */}
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl">

        {/* ==================================================
            Logo Section
            ================================================== */}
        <div className="mb-8 flex flex-col items-center">

          {/* Logo */}
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-3xl font-bold text-white shadow-lg">
            S
          </div>

          {/* Application Name */}
          <h1 className="mt-5 text-3xl font-bold text-slate-800">
            SupportOS AI
          </h1>

          {/* Subtitle */}
          <p className="mt-2 text-center text-sm text-slate-500">
            Intelligent Customer Support Platform
          </p>

        </div>

        {/* ==================================================
            Login Form
            ================================================== */}
        <form className="space-y-5">

          {/* ================= Email ================= */}
          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-xl border border-slate-300 bg-white p-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />

          </div>

          {/* ================= Password ================= */}
          <div>

            <div className="mb-2 flex items-center justify-between">

              <label className="text-sm font-medium text-slate-700">
                Password
              </label>

              <a
                href="#"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot Password?
              </a>

            </div>

            <input
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-xl border border-slate-300 bg-white p-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />

          </div>

          {/* ================= Login Button ================= */}
          <button
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition duration-300 hover:bg-blue-700 active:scale-95"
          >
            Login
          </button>

          {/* ================= Register Link ================= */}
          <p className="text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <a
              href="#"
              className="font-medium text-blue-600 hover:underline"
            >
              Sign Up
            </a>
          </p>

        </form>

      </div>

    </main>
  );
}