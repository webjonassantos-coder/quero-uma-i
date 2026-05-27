import { Map, MapPin, Radio, Compass, ShieldCheck } from "lucide-react";
import { Coverage, Provider } from "../types";

interface CoverageMapProps {
  coverage: Coverage[];
  providers: Provider[];
  addressInfo: {
    cep: string;
    cidade: string;
    estado: string;
    bairro?: string;
    rua?: string;
  };
}

export default function CoverageMap({ coverage, providers, addressInfo }: CoverageMapProps) {
  const getProvider = (providerId: string) => {
    return providers.find((p) => p.id === providerId);
  };

  return (
    <div
      className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden mt-12 grid grid-cols-1 lg:grid-cols-3 animate-fadeIn"
      id="coverage-map-section"
    >
      {/* MAP CONTROLLERS BAR / SIDEBAR */}
      <div className="p-6 md:p-8 bg-slate-50 border-r border-slate-100 flex flex-col justify-between">
        <div>
          <span className="bg-[#00ACA4]/10 text-primary-dark font-black tracking-widest text-[10px] uppercase px-3 py-1 rounded-full inline-block">
            Satélite Radar Live
          </span>
          <h2 className="text-xl md:text-2xl font-black text-charcoal tracking-tight mt-3">
            Mapa de Cobertura Estimada
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
            Consórcio de antenas, cabeamentos de fibra óptica e roteadores de proximidade ativos próximos de você.
          </p>

          {/* SENSOR INDICATORS */}
          <div className="space-y-4 mt-6">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Endereço Geocodificado</span>
              <p className="text-sm font-semibold text-[#353535] mt-1 leading-snug">
                {addressInfo.rua ? `${addressInfo.rua}, ` : ""}
                {addressInfo.bairro ? `${addressInfo.bairro} - ` : ""}
                {addressInfo.cidade} / {addressInfo.estado}
              </p>
              <span className="inline-block mt-2 font-mono text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
                CEP {addressInfo.cep}
              </span>
            </div>

            <div className="space-y-2.5">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Operadoras Ativas em Cobertura</span>
              {coverage.map((cov) => {
                const prov = getProvider(cov.provider_id);
                if (!prov) return null;
                return (
                  <div key={cov.id} className="flex items-center justify-between text-xs bg-white py-2.5 px-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#00ACA4] animate-pulse" />
                      <span className="font-semibold text-slate-700">{prov.nome}</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      Fibra Disponível
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 mt-6 md:mt-0 flex gap-3 text-xs text-[#565656]">
          <ShieldCheck className="w-5 h-5 text-[#00ACA4] shrink-0" />
          <p className="font-medium leading-relaxed">
            A infraestrutura é simulada com base em antenas reais. A viabilidade final de porta técnica deve ser confirmada.
          </p>
        </div>
      </div>

      {/* RENDER MAP INTERACTIVE CANVAS */}
      <div className="lg:col-span-2 relative min-h-[400px] bg-slate-150 overflow-hidden flex items-center justify-center">
        {/* Dynamic Abstract Map Grid BG */}
        <div className="absolute inset-0 opacity-25 pointer-events-none bg-[radial-gradient(#94a3b8_1.5px,transparent_1.5px)] [background-size:16px_16px]" />
        
        {/* Abstract Blue Radar Rings */}
        <div className="absolute w-[300px] h-[300px] border-2 border-[#00ACA4]/20 rounded-full animate-ping pointer-events-none duration-[4s]" />
        <div className="absolute w-[180px] h-[180px] border border-[#00ACA4]/30 rounded-full animate-pulse-slow pointer-events-none" />
        <div className="absolute w-[80px] h-[80px] border border-[#00ACA4]/40 rounded-full pointer-events-none" />

        {/* Dynamic Nodes / Markers */}
        {coverage.map((cov, idx) => {
          const prov = getProvider(cov.provider_id);
          if (!prov) return null;
          
          // Layout positions dynamically using static indexing offsets
          const leftOffset = 25 + (idx * 16) % 55;
          const topOffset = 20 + (idx * 21) % 60;

          return (
            <div
              key={cov.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-fadeIn cursor-pointer group"
              style={{ left: `${leftOffset}%`, top: `${topOffset}%` }}
              title={`Antena de Sinal - ${prov.nome}`}
            >
              <div className="relative">
                {/* Active range signal glow */}
                <div className="absolute -inset-4 bg-[#0ACA9E]/10 rounded-full animate-ping duration-[3.5s] pointer-events-none" />
                <div className="relative flex items-center justify-center bg-white p-2 rounded-xl border border-slate-200 shadow-md transition-all duration-200 hover:scale-110 hover:border-[#00ACA4] hover:shadow-lg">
                  <span className="text-[10px] font-extrabold text-[#353535]">{prov.nome.split(" ")[0]}</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 ml-1.5" />
                </div>
                {/* Pointer Stem */}
                <div className="mx-auto w-0.5 h-3 bg-slate-300" />
              </div>
            </div>
          );
        })}

        {/* Central Core User pin */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-center">
          <div className="relative inline-block">
            <div className="absolute -inset-6 bg-[#00ACA4]/15 rounded-full animate-pulse" />
            <div className="absolute -inset-10 bg-[#00ACA4]/5 rounded-full animate-ping duration-[2.5s]" />
            <div className="w-12 h-12 rounded-full bg-[#00ACA4] text-white flex items-center justify-center border-4 border-white shadow-xl">
              <MapPin className="w-6 h-6 animate-bounce" />
            </div>
          </div>
          <p className="bg-charcoal text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg mt-2 tracking-wide uppercase">
            Seu CEP
          </p>
        </div>

        {/* Direction Indicator */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-2.5 rounded-xl border border-slate-200/80 shadow-md text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-[#00ACA4] animate-spin-slow" />
          <span>Sinal Ultra-estável</span>
        </div>
      </div>
    </div>
  );
}
