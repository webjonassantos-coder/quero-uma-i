import { useState, ChangeEvent } from "react";
import { Filter, RotateCcw, Check, Sparkles, ChevronDown } from "lucide-react";
import { FilterState, Provider } from "../types";

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (updater: (prev: FilterState) => FilterState) => void;
  providers: Provider[];
  onReset: () => void;
}

export default function FilterSidebar({ filters, onFilterChange, providers, onReset }: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Set Speed Constraint Range
  const handleSpeedChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    onFilterChange((prev) => ({ ...prev, minVelocidade: val }));
  };

  // Set Max Price range limit
  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    onFilterChange((prev) => ({ ...prev, maxPreco: val }));
  };

  // Toggle checklist booleans
  const toggleBoolean = (key: keyof Pick<FilterState, 'semFidelidade' | 'streamingIncluso' | 'instalacaoGratis' | 'wifiGratis'>) => {
    onFilterChange((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Toggle distinct carrier checks
  const toggleProvider = (providerId: string) => {
    onFilterChange((prev) => {
      const alreadyHave = prev.providerIds.includes(providerId);
      const nextIds = alreadyHave
        ? prev.providerIds.filter((id) => id !== providerId)
        : [...prev.providerIds, providerId];
      return { ...prev, providerIds: nextIds };
    });
  };

  // Set sorting type preference
  const handleSortChange = (sort: FilterState['sortOption']) => {
    onFilterChange((prev) => ({ ...prev, sortOption: sort }));
  };

  return (
    <div className="w-full lg:w-80 shrink-0" id="filter-sidebar-component">
      
      {/* MOBILE TRIGGER FILTER TOGGLE BAR */}
      <div className="lg:hidden mb-4">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between bg-white border border-slate-200 rounded-2xl py-3.5 px-5 font-bold text-slate-700 shadow-sm active:bg-slate-50 transition-colors"
          id="btn-mobile-filter-drawer"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            <span>Filtros e Ordenação Avançada</span>
          </div>
          <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* FILTER BODY WRAPPER (Adapts to Mobile and Desktop natively via hidden-props) */}
      <div
        className={`${
          isOpen ? "block animate-fadeIn" : "hidden"
        } lg:block bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-xl space-y-8 sticky top-24`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            <span className="font-extrabold text-charcoal text-lg">Filtros</span>
          </div>
          
          <button
            type="button"
            onClick={onReset}
            className="text-slate-400 hover:text-primary transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
            title="Restaurar padrões"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpar</span>
          </button>
        </div>

        {/* 1. ORDER SORT OPTIONS SELECTOR */}
        <div className="space-y-3">
          <label className="text-xs font-extrabold text-[#353535] uppercase tracking-wider block">
            Ordenar Por
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                { id: "relevance", label: "Relevância" },
                { id: "cheapest", label: "Menor Preço" },
                { id: "fastest", label: "Mais Rápido" },
                { id: "valueRatio", label: "Melhor Custo" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSortChange(opt.id)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all duration-150 cursor-pointer text-center ${
                  filters.sortOption === opt.id
                    ? "bg-primary text-white border-primary shadow-md shadow-primary/10"
                    : "bg-white text-slate-500 border-slate-150 hover:border-slate-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. PRICE RANGE SLIDER */}
        <div className="space-y-3">
          <div className="flex justify-between items-baseline">
            <label className="text-xs font-extrabold text-[#353535] uppercase tracking-wider">
              Preço Máximo
            </label>
            <span className="text-sm font-extrabold text-primary">
              R$ {filters.maxPreco}/mês
            </span>
          </div>
          <input
            type="range"
            min="60"
            max="300"
            step="10"
            value={filters.maxPreco}
            onChange={handlePriceChange}
            className="w-full accent-primary cursor-pointer h-1.5 bg-slate-100 rounded-lg outline-none"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
            <span>R$ 60</span>
            <span>R$ 300+</span>
          </div>
        </div>

        {/* 3. MIN SPEED VELOCIDADE BANDA LARGA LIMITS */}
        <div className="space-y-3">
          <div className="flex justify-between items-baseline">
            <label className="text-xs font-extrabold text-[#353535] uppercase tracking-wider">
              Velocidade Mínima
            </label>
            <span className="text-sm font-extrabold text-[#00ACA4]">
              {filters.minVelocidade} Mega
            </span>
          </div>
          <input
            type="range"
            min="100"
            max="1000"
            step="100"
            value={filters.minVelocidade}
            onChange={handleSpeedChange}
            className="w-full accent-[#00ACA4] cursor-pointer h-1.5 bg-slate-100 rounded-lg outline-none"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
            <span>100M</span>
            <span>1 Giga</span>
          </div>
        </div>

        {/* 4. PREMIUM SERVICE FEATURE CHECK LIST */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <label className="text-xs font-extrabold text-[#353535] uppercase tracking-wider block">
            Diferenciais e Benefícios
          </label>
          
          <div className="space-y-2.5">
            {[
              { key: "instalacaoGratis", label: "Instalação Grátis" },
              { key: "semFidelidade", label: "Sem Fidelidade de 12 meses" },
              { key: "streamingIncluso", label: "Servicos de Streaming" },
              { key: "wifiGratis", label: "Roteador Wi-Fi Incluso" },
            ].map((benefit) => {
              const checked = filters[benefit.key as keyof FilterState] === true;
              return (
                <button
                  key={benefit.key}
                  type="button"
                  onClick={() => toggleBoolean(benefit.key as any)}
                  className="w-full flex items-center justify-between text-left py-2 px-3 rounded-xl border border-slate-100 hover:border-slate-200 text-xs font-semibold text-slate-700 transition-colors"
                >
                  <span>{benefit.label}</span>
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      checked
                        ? "bg-primary border-primary text-white"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    {checked && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. SPECIFIC MOBILE/FIXED ISP CARRIER SELECTS */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <label className="text-xs font-extrabold text-[#353535] uppercase tracking-wider block">
            Operadoras Disponíveis
          </label>
          <div className="space-y-2">
            {providers.map((prov) => {
              const active = filters.providerIds.includes(prov.id);
              return (
                <button
                  key={prov.id}
                  type="button"
                  onClick={() => toggleProvider(prov.id)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left ${
                    active
                      ? "bg-slate-50 border-primary"
                      : "bg-white border-slate-100 hover:border-slate-200"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center ${
                      active ? "bg-primary border-primary text-white" : "border-slate-300"
                    }`}
                  >
                    {active && <Check className="w-3 h-3 stroke-[3px]" />}
                  </div>
                  <span className="text-xs font-bold text-slate-700">{prov.nome}</span>
                  {prov.regional && (
                    <span className="ml-auto text-[9px] font-bold bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-100">
                      Regional
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
