import React from "react";

interface LogoProps {
  providerId: string;
  className?: string;
}

export default function ProviderLogo({ providerId, className = "h-8" }: LogoProps) {
  const normalized = providerId.toLowerCase().trim();

  switch (normalized) {
    case "nio":
    case "vivo":
      return (
        <div className={`flex items-center gap-1.5 ${className}`}>
          {/* NIO INTERNET - Emerald Green & Slate */}
          <div className="w-8 h-8 rounded-lg bg-[#00BE7A] flex items-center justify-center text-white font-extrabold text-base select-none shadow-sm antialiased">
            N
          </div>
          <span className="font-extrabold text-[#1E293B] tracking-tight text-lg font-sans">
            NIO <span className="text-[#00BE7A]">INTERNET</span>
          </span>
        </div>
      );
    case "claro":
      return (
        <div className={`flex items-center gap-1.5 ${className}`}>
          {/* Claro Custom Red Circle logo */}
          <div className="w-8 h-8 rounded-full bg-[#EE1D23] flex items-center justify-center text-white font-black text-sm select-none shadow-sm">
            Claro
          </div>
          <span className="font-bold text-[#EE1D23] tracking-tight text-lg font-roboto">Claro net</span>
        </div>
      );
    case "tim":
      return (
        <div className={`flex items-center gap-1.5 ${className}`}>
          {/* TIM Stylized Blue Columns */}
          <div className="w-8 h-8 rounded-lg bg-[#004A94] flex flex-col justify-between p-1.5 text-white font-bold select-none shadow-sm">
            <div className="flex gap-0.5 grow justify-center items-center text-xs">T</div>
          </div>
          <span className="font-bold text-[#004A94] tracking-tight text-lg font-roboto">TIM Ultrafibra</span>
        </div>
      );
    case "brisanet":
      return (
        <div className={`flex items-center gap-1.5 ${className}`}>
          {/* Brisanet High Contrast Orange Waves */}
          <div className="w-8 h-8 rounded-lg bg-[#FF6600] flex items-center justify-center text-white font-black text-base select-none shadow-sm">
            B
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[#1F2937] tracking-tight leading-none text-base">Brisanet</span>
            <span className="text-[10px] text-slate-400 font-semibold leading-none">100% Nordeste</span>
          </div>
        </div>
      );
    case "desktop":
      return (
        <div className={`flex items-center gap-1.5 ${className}`}>
          {/* Desktop Bright Green/Black theme */}
          <div className="w-8 h-8 rounded-lg bg-[#000000] border border-[#22C55E] flex items-center justify-center text-[#22C55E] font-extrabold text-sm select-none shadow-sm">
            dk
          </div>
          <span className="font-extrabold text-[#111827] tracking-tight text-lg font-roboto">
            desktop<span className="text-[#22C55E]">.</span>
          </span>
        </div>
      );
    default:
      return (
        <div className={`flex items-center gap-1.5 ${className}`}>
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-black select-none shadow-md">
            {providerId.substring(0, 1).toUpperCase()}
          </div>
          <span className="font-bold text-slate-800 tracking-tight text-lg">{providerId}</span>
        </div>
      );
  }
}
