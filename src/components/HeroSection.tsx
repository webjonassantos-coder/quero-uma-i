import { Zap, HelpCircle, Check, Shield } from "lucide-react";
import AddressSearch from "./AddressSearch";

interface HeroSectionProps {
  onSearch: (selected: {
    cep?: string;
    latitude?: number;
    longitude?: number;
    label?: string;
  }) => void;
  isLoading: boolean;
}

export default function HeroSection({ onSearch, isLoading }: HeroSectionProps) {
  return (
    <div
      className="hero-gradient text-white py-20 px-4 md:py-32 relative overflow-hidden"
      id="hero-section"
    >
      {/* Decorative floating grids / glowing vector fields */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.06),transparent_40%)] pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-48 -right-48 w-[400px] h-[400px] rounded-full bg-teal-300/10 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
        
        {/* Dynamic Spark / Launch Indicator */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide border border-white/10 animate-fadeIn">
          <Zap className="w-4 h-4 text-secondary animate-pulse fill-secondary" />
          <span>Comparação de Internet 100% Gratuita e Atualizada</span>
        </div>

        {/* Core Headings */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none text-white max-w-4xl mx-auto uppercase">
            Compare os Melhores Planos de Internet da Sua Região
          </h1>
          <p className="text-lg md:text-xl text-white/80 font-semibold max-w-2xl mx-auto leading-relaxed">
            Descubra ofertas disponíveis no seu endereço em segundos.
          </p>
        </div>

        {/* Dynamic Address Check Input Field */}
        <div className="pt-4">
          <AddressSearch onSearch={onSearch} isLoading={isLoading} />
        </div>

        {/* Undersearch Features checks */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 pt-6 select-none">
          {[
            "Busca Imediata por CEP",
            "Sinal das Gigantes e Regionais",
            "Sem custos de corretagem",
            "Valores Oficiais das Operadoras",
          ].map((feat, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs md:text-sm font-semibold opacity-90">
              <div className="w-5 h-5 rounded-full bg-[#00ACA4]/15 border border-white/20 flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-secondary" strokeWidth={3} />
              </div>
              <span>{feat}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
