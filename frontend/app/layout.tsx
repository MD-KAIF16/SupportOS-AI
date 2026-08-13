import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SupportOS AI — Intelligent Customer Support SaaS",
  description: "Next-Gen AI Customer Support Platform with RAG, Multi-Tenancy & Agentic Workflows",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jakarta.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#050507] text-gray-100 relative selection:bg-purple-500/30 selection:text-purple-200">
        {/* Ambient Atmospheric Background Blobs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {/* Violet Top-Right Blob */}
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-violet-600/20 via-purple-600/15 to-transparent blur-[120px] animate-blob-1" />
          {/* Magenta Bottom-Left Blob */}
          <div className="absolute top-1/3 -left-40 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-fuchsia-600/20 via-pink-600/10 to-transparent blur-[120px] animate-blob-2" />
          {/* Purple Center-Bottom Blob */}
          <div className="absolute -bottom-40 right-1/4 w-[650px] h-[650px] rounded-full bg-gradient-to-t from-purple-800/15 via-violet-900/10 to-transparent blur-[140px] animate-blob-3" />
          {/* Overlay Grid Pattern for subtle texture */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
        </div>

        {/* Application Content */}
        <AuthProvider>
          <div className="relative z-10 flex flex-col min-h-screen">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}