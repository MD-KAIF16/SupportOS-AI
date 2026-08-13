import Image from "next/image";

type LogoProps = {
  size?: number;
  showText?: boolean;
};

export default function Logo({
  size = 44,
  showText = false,
}: LogoProps) {
  return (
    <div className="flex items-center gap-4 select-none font-sans">
      {/* Emblem Icon Container with Soft Glow */}
      <div className="relative group shrink-0 flex items-center justify-center">
        {/* Soft background purple glow halo */}
        <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-purple-600/70 via-fuchsia-600/70 to-pink-600/70 opacity-60 blur-md group-hover:opacity-100 transition duration-300" />
        
        {/* Sleek rounded dark glass panel */}
        <div className="relative flex items-center justify-center rounded-xl bg-[#09090e] border border-white/20 p-1 overflow-hidden shadow-lg shadow-purple-950/40">
          <Image
            src="/supportos-brand-emblem-tight.png"
            alt="SupportOS AI Logo"
            width={size}
            height={Math.round(size * 364 / 313)}
            className="object-contain drop-shadow-[0_0_8px_rgba(168,85,247,0.6)] transition duration-200 group-hover:scale-105"
            priority
            unoptimized
          />
        </div>
      </div>

      {/* Typography Unit (Aligned with Emblem) */}
      {showText && (
        <div className="flex flex-col justify-center text-left">
          <span className="font-extrabold text-lg sm:text-xl leading-none tracking-tight text-white flex items-center">
            SupportOS <span className="text-purple-400 font-extrabold ml-1.5">AI</span>
          </span>
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.22em] text-purple-300/80 leading-none mt-1">
            ENTERPRISE SUPPORT
          </span>
        </div>
      )}
    </div>
  );
}