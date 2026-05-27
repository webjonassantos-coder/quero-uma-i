import { useState, useMemo } from "react";
import { FilterState, Plan, Provider, SearchResult } from "../types";
import PlanCard from "./PlanCard";
import FilterSidebar from "./FilterSidebar";
import ComparisonTable from "./ComparisonTable";
import CoverageMap from "./CoverageMap";
import { Sparkles, SlidersHorizontal, Map, Layers, Info, CheckCircle, ArrowRight } from "lucide-react";

interface SearchResultsProps {
  data: SearchResult;
  isLoading: boolean;
}

export default function SearchResults({ data, isLoading }: SearchResultsProps) {
  const [filters, setFilters] = useState<FilterState>({
    sortOption: "relevance",
    tecnologia: ["Fibra", "Cabo COAX", "Satélite", "4G/5G"],
    maxPreco: 300,
    minVelocidade: 100,
    semFidelidade: false,
    streamingIncluso: false,
    instalacaoGratis: false,
    wifiGratis: false,
    providerIds: [],
  });

  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showMap, setShowMap] = useState(false);

  // Compute total available operators near user
  const availableCarriers = data.providers;

  const handleCompareToggle = (planId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(planId)) {
        return prev.filter((id) => id !== planId);
      }
      if (prev.length >= 4) {
        alert("Você pode comparar no máximo 4 planos simultaneamente.");
        return prev;
      }
      return [...prev, planId];
    });
  };

  const handleResetFilters = () => {
    setFilters({
      sortOption: "relevance",
      tecnologia: ["Fibra", "Cabo COAX", "Satélite", "4G/5G"],
      maxPreco: 300,
      minVelocidade: 100,
      semFidelidade: false,
      streamingIncluso: false,
      instalacaoGratis: false,
      wifiGratis: false,
      providerIds: [],
    });
  };

  // 1. FILTER PLANS ACCORDING TO USER CONFIG
  const filteredPlans = useMemo(() => {
    let result = [...data.plans];

    // Filter by maximum monthly cost limit
    result = result.filter((p) => p.preco <= filters.maxPreco);

    // Filter by minimum download speed limit
    result = result.filter((p) => p.velocidade >= filters.minVelocidade);

    // Filter by specific providers list
    if (filters.providerIds.length > 0) {
      result = result.filter((p) => filters.providerIds.includes(p.provider_id));
    }

    // Filter by contract obligation
    if (filters.semFidelidade) {
      result = result.filter((p) => !p.fidelidade);
    }

    // Filter by bundle benefits
    if (filters.instalacaoGratis) {
      result = result.filter((p) => p.instalacao === 0);
    }

    if (filters.wifiGratis) {
      result = result.filter((p) => p.wifi.toLowerCase().includes("incluso") || p.wifi.toLowerCase().includes("grátis"));
    }

    if (filters.streamingIncluso) {
      result = result.filter((p) => p.streaming && p.streaming.length > 0);
    }

    // 2. APPLY CHOSEN ORDER SORT ALGORITHM
    if (filters.sortOption === "cheapest") {
      result.sort((a, b) => a.preco - b.preco);
    } else if (filters.sortOption === "fastest") {
      result.sort((a, b) => b.velocidade - a.velocidade);
    } else if (filters.sortOption === "valueRatio") {
      // ratio: relevance / price (higher value-for-money score wins)
      result.sort((a, b) => (b.relevancia / b.preco) - (a.relevancia / a.preco));
    } else {
      // relevance score order mapping
      result.sort((a, b) => b.relevancia - a.relevancia);
    }

    return result;
  }, [data.plans, filters]);

  // Compute comparative nodes
  const comparedPlansList = useMemo(() => {
    return data.plans.filter((p) => compareIds.includes(p.id));
  }, [data.plans, compareIds]);

  const findProvider = (providerId: string) => {
    return data.providers.find((p) => p.id === providerId);
  };

  return (
    <div className="w-full" id="search-results-viewport">
      
      {/* 1. SECTOR METADATA HEADLINE BANNER */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-xl mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-fadeIn">
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-black tracking-widest text-[11px] uppercase">
            <CheckCircle className="w-4 h-4 text-primary" strokeWidth={3} />
            <span>RESULTADOS DE COBERTURA ATIVOS</span>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-extrabold text-charcoal tracking-tight leading-tight">
            Consultando em <span className="text-primary">{data.bairro || "Sua região"}</span>
          </h1>
          
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            {data.rua ? `${data.rua}, ` : ""} CEP {data.cep} • {data.cidade} - {data.estado}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <button
            type="button"
            id="btn-toggle-coverage-map"
            onClick={() => setShowMap(!showMap)}
            className={`px-5 py-3 rounded-xl border font-bold text-sm flex items-center gap-2 cursor-pointer transition-all duration-200 ${
              showMap
                ? "bg-[#00ACA4]/10 border-[#00ACA4] text-[#00ACA4]"
                : "bg-[#00ACA4] hover:bg-primary-dark text-white border-primary shadow-lg shadow-[#00ACA4]/20"
            }`}
          >
            <Map className="w-4 h-4" />
            <span>{showMap ? "Ocultar Radar de Sinal" : "Ver Radar de Sinal"}</span>
          </button>
        </div>

      </div>

      {/* 2. COVERAGE RADAR MAP INTEGRATED EXPANSION */}
      {showMap && (
        <div className="mb-12">
          <CoverageMap
            coverage={data.coverage}
            providers={data.providers}
            addressInfo={{
              cep: data.cep,
              cidade: data.cidade,
              estado: data.estado,
              bairro: data.bairro,
              rua: data.rua,
            }}
          />
        </div>
      )}

      {/* 3. CORE MULTI-SCREEN WRAPPER FOR FILTERS / COMPARISONS */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* FILTERS CONTAINER */}
        <FilterSidebar
          filters={filters}
          onFilterChange={setFilters}
          providers={data.providers}
          onReset={handleResetFilters}
        />

        {/* RESULTS CARDS CONTAINER */}
        <div className="flex-1 w-full space-y-8" id="plans-grid-viewport">
          
          <div className="flex justify-between items-center pb-4 border-b border-rose-100/10">
            <span className="text-sm font-bold text-slate-500">
              {filteredPlans.length} {filteredPlans.length === 1 ? "plano disponível" : "planos disponíveis"}
            </span>

            {/* Smart info badge */}
            <div className="flex items-center gap-1 bg-teal-50 text-teal-700 px-3 py-1.5 rounded-full border border-teal-100 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 fill-teal-600" />
              <span>Matching Inteligente Ativo</span>
            </div>
          </div>

          {filteredPlans.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center text-slate-500 space-y-4 max-w-xl mx-auto shadow-md">
              <Info className="w-10 h-10 text-primary mx-auto" />
              <p className="font-bold text-charcoal text-lg">Sem correspondências com os filtros aplicados</p>
              <p className="text-sm">
                Experimente aumentar o preço máximo ou diminuir a velocidade mínima para encontrar ofertas na região de <strong>{data.cidade}</strong>.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="bg-primary hover:bg-primary-dark text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-all shadow-md shadow-primary/10 cursor-pointer"
              >
                Limpar Todos os Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {filteredPlans.map((plan) => {
                const prov = findProvider(plan.provider_id);
                if (!prov) return null;
                return (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    provider={prov}
                    searchedCep={data.cep}
                    onCompareToggle={handleCompareToggle}
                    isComparing={compareIds.includes(plan.id)}
                    onSelectAction={(selectedPlan, selectedProv) => {
                      const waText = encodeURIComponent(
                        `Olá! Gostaria de consultar cobertura de internet para o CEP ${data.cep} para o plano ${selectedPlan.nome}.`
                      );
                      window.open(`https://wa.me/${selectedProv.whatsapp}?text=${waText}`, "_blank");
                    }}
                  />
                );
              })}
            </div>
          )}

        </div>

      </div>

      {/* 4. COMPARISON DRAWER SIDE-BY-SIDE MATRIX */}
      {compareIds.length > 0 && (
        <ComparisonTable
          plans={comparedPlansList}
          providers={data.providers}
          onRemove={handleCompareToggle}
          searchedCep={data.cep}
        />
      )}

      {/* 5. STICKY QUICK CONTROLS COMPARISON BOTTOM FLOATING BAR */}
      {compareIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-charcoal/95 backdrop-blur-md text-white rounded-2xl shadow-2xl py-3.5 px-6 flex items-center gap-6 border border-white/10 animate-slideUp">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
            <span className="text-xs font-bold whitespace-nowrap">
              {compareIds.length} {compareIds.length === 1 ? "Plano Selecionado" : "Planos Selecionados"}
            </span>
          </div>
          
          <a
            href="#compare-section"
            className="flex items-center gap-1.5 text-xs font-black text-primary hover:text-primary-light transition-colors whitespace-nowrap"
          >
            <span>Ver Comparação</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
          
          <button
            type="button"
            onClick={() => setCompareIds([])}
            className="text-white/60 hover:text-white font-extrabold text-[10px] uppercase border border-white/10 hover:border-white/20 py-1 px-2.5 rounded transition-all"
          >
            Limpar
          </button>
        </div>
      )}

    </div>
  );
}
