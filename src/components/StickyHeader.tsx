import { Activity, Radio, PhoneCall } from "lucide-react";

interface StickyHeaderProps {
  onReset: () => void;
  searchedAddress?: string;
}

export default function StickyHeader({ onReset, searchedAddress }: StickyHeaderProps) {
  return (
    <header
      id="main-navigation-header"
      className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* LOGO BRAND */}
        <button
          onClick={onReset}
          id="btn-logo-home"
          className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center shadow-md shadow-primary/10 group-hover:scale-105 transition-transform duration-200">
            <img
              src="https://i.postimg.cc/j22Rdgnj/27-de-mai-de-2026-13-02-47.png"
              alt="Logo Quero uma Internet"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-charcoal tracking-tight text-xl leading-none">
              Quero uma<span className="text-[#00ACA4]"> Internet</span>
            </span>
            <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase mt-0.5">
              Comparador Premium Banda Larga
            </span>
          </div>
        </button>

        {/* SEARCHED PIN BADGE */}
        {searchedAddress && (
          <div
            id="header-address-pill"
            className="hidden md:flex items-center gap-2 bg-slate-100 border border-slate-250 py-1.5 px-3.5 rounded-full text-xs font-semibold animate-fadeIn max-w-sm"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 absolute shrink-0" />
            <span className="text-slate-500 font-medium ml-1">Buscando em:</span>
            <span className="text-slate-800 text-xs truncate max-w-[150px] lg:max-w-[200px]" title={searchedAddress}>
              {searchedAddress}
            </span>
            <button
              onClick={onReset}
              className="text-slate-400 hover:text-red-500 font-bold text-xs ml-1 pl-1 bg-slate-200/50 hover:bg-slate-200 rounded-full w-4 h-4 flex items-center justify-center transition-colors"
              title="Nova busca por CEP"
            >
              ✕
            </button>
          </div>
        )}

        {/* TELEPHONE DIRECT LINK */}
        <div className="flex items-center gap-3">
          <a
            href="https://wa.me/5521980369980?text=Ol%C3%A1!%20Gostaria%20de%20consultar%20planos%20de%20internet%20banda%2520larga."
            target="_blank"
            rel="noopener noreferrer"
            id="header-btn-call"
            className="flex items-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/20 text-emerald-700 font-extrabold px-4 py-2 rounded-xl text-xs md:text-sm tracking-tight transition-all duration-200"
          >
            <PhoneCall className="w-4 h-4 text-[#25D366]" />
            <span className="hidden sm:inline">WhatsApp Televendas:</span>
            <span>(21) 98036-9980</span>
          </a>
        </div>

      </div>
    </header>
  );
}
