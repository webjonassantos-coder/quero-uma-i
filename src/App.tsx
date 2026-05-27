import { useState } from "react";
import { searchBroadbandOffers } from "./services/api";
import { SearchResult } from "./types";
import StickyHeader from "./components/StickyHeader";
import HeroSection from "./components/HeroSection";
import SearchResults from "./components/SearchResults";
import LoadingSkeleton from "./components/LoadingSkeleton";
import Footer from "./components/Footer";
import AiAssistantChat from "./components/AiAssistantChat";
import { ShieldCheck, ArrowRight, Check, CheckCircle2, Award, Zap, HeartHandshake } from "lucide-react";

export default function App() {
  const [searchData, setSearchData] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchedLabel, setSearchedLabel] = useState<string>("");

  const handleSearch = async (params: {
    cep?: string;
    latitude?: number;
    longitude?: number;
    label?: string;
  }) => {
    setLoading(true);
    setSearchData(null);
    if (params.label) {
      setSearchedLabel(params.label);
    }

    // Call geocoding database resolver backend endpoint
    const res = await searchBroadbandOffers({
      cep: params.cep,
      latitude: params.latitude,
      longitude: params.longitude,
    });

    if (res) {
      setSearchData(res);
      // Smooth scroll to results viewport
      setTimeout(() => {
        const target = document.getElementById("search-results-viewport") || document.getElementById("plans-grid-viewport");
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    } else {
      alert("Pedimos desculpas, não conseguimos buscar cobertura para o endereço solicitado no momento. Verifique sua conexão ou tente outro CEP.");
    }
    setLoading(false);
  };

  const handleReset = () => {
    setSearchData(null);
    setSearchedLabel("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between" id="applet-main-container">
      
      {/* Dynamic Header */}
      <StickyHeader onReset={handleReset} searchedAddress={searchedLabel || searchData?.cep} />

      {/* CORE ROUTING STAGE */}
      <main className="grow">
        
        {/* LANDING SCREEN BANNER (Always available or switches beautifully based on selection) */}
        {!searchData && !loading ? (
          <div>
            <HeroSection onSearch={handleSearch} isLoading={loading} />

            {/* HIGH-CONVERSION STARTUP EXTRAS SECTORS */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
              
              {/* HOW IT WORKS PROCESS BENTO STRIP */}
              <div className="space-y-12">
                <div className="text-center space-y-3">
                  <span className="bg-[#00ACA4]/10 text-primary-dark font-black tracking-widest text-[11px] uppercase px-3 py-1.5 rounded-full inline-block">
                    Inovação em Parcerias
                  </span>
                  <h2 className="text-3xl md:text-4xl font-black text-charcoal tracking-tight">
                    Como funciona o Quero uma Internet?
                  </h2>
                  <p className="text-sm font-semibold text-slate-500 max-w-xl mx-auto">
                    Consulte grátis a cobertura oficial e as ofertas disponíveis de todas as prestadoras de banda larga no Brasil.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      step: "01",
                      title: "Informe seu Endereço",
                      description: "Insira seu CEP ou logradouro completo. Integrado diretamente ao ViaCEP e geolocalizador para mapear coordenadas da sua rua.",
                    },
                    {
                      step: "02",
                      title: "Fizemos o Escaneamento",
                      description: "Nosso algoritmo cruza na hora as antenas e cabos de fibra ativos em São Paulo, Rio de Janeiro e interior do país.",
                    },
                    {
                      step: "03",
                      title: "Compare e Economize",
                      description: "Selecione e compare até 4 planos simultaneamente e contrate via WhatsApp oficial ou televendas grátis.",
                    },
                  ].map((proc, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-3xl border border-slate-100 p-8 shadow-md relative hover:-translate-y-1 transition-transform duration-300"
                    >
                      <span className="text-4xl font-extrabold text-[#00ACA4]/15 block mb-4">{proc.step}</span>
                      <h3 className="text-lg font-bold text-charcoal mb-2">{proc.title}</h3>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">{proc.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* WHY WE ARE SPECIAL HIGHLIGHT */}
              <div className="bg-slate-900 text-white rounded-[40px] p-8 md:p-16 relative overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(0,172,164,0.15),transparent_40%)] pointer-events-none" />
                
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-1.5 bg-[#00ACA4]/25 px-3 py-1.5 rounded-full text-xs font-bold text-[#3FD3D0]">
                    <Award className="w-4 h-4" />
                    <span>Líder em Avaliações no Brasil</span>
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl font-black tracking-tight leading-tight uppercase">
                    O maior buscador neutro brasileiro de novos planos banda larga
                  </h3>
                  
                  <p className="text-xs md:text-sm text-slate-300 font-medium leading-relaxed">
                    Nenhum provedor de internet nos paga taxas ocultas para aparecer no topo da lista. Nosso algoritmo classifica as ofertas puramente com base no seu custo-benefício real, taxa de download de upload e tempo de resposta de sinal na sua localidade.
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                      <span className="text-2xl font-black text-white block">99.7%</span>
                      <span className="text-xs text-slate-400 font-semibold mt-1 block">CEP geolocalizados</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                      <span className="text-2xl font-black text-white block">+1.2M</span>
                      <span className="text-xs text-slate-400 font-semibold mt-1 block">Buscas mensais</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    "Matching inteligente por geolocalização e proximidade física",
                    "Acesso prioritário a cupons de desconto exclusivos",
                    "Transparência total sobre custos extras e taxa de adesão",
                    "Atendimento premium especializado via WhatsApp",
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#00ACA4] shrink-0 mt-0.5" />
                      <p className="text-xs font-semibold text-slate-200 leading-snug">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* BRAND VALUE ACCORDION FAQ */}
              <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl md:text-3xl font-black text-charcoal tracking-tight">Preguntas Frequentes</h3>
                  <p className="text-xs text-slate-400 font-semibold">Tudo o que você precisa saber sobre a contratação das ofertas da sua região.</p>
                </div>

                <div className="space-y-4 divide-y divide-slate-100">
                  {[
                    {
                      q: "O processo de busca de CEP e comparação tem algum custo adicional?",
                      a: "Não. A nossa tecnologia é 100% gratuita para os usuários finais. Nós atuamos como corretores integrados com as operadoras e recebemos comissão direta das mesmas por cada plano Ativo.",
                    },
                    {
                      q: "Preciso de um CPF limpo para contratar internet fibra óptica?",
                      a: "Sim, a maioria das grandes operadoras brasileiras exige análise cadastral de crédito no momento do fechamento do pedido. Em caso de restrições, provedores regionais ou planos flex costumam ter aprovação facilitada.",
                    },
                    {
                      q: "O que é o período mínimo de fidelidade?",
                      a: "A fidelidade é de 12 meses na maioria dos pacotes de grandes provedores. Isso garante descontos maiores no valor mensal e isenção na instalação inicial. Caso desista antes, a multa pro-rata é aplicada.",
                    },
                  ].map((faq, idx) => (
                    <div key={idx} className="pt-4 first:pt-0">
                      <h4 className="text-sm md:text-base font-bold text-charcoal flex items-center gap-2 mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00ACA4] shrink-0" />
                        {faq.q}
                      </h4>
                      <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed pl-3.5">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>

            </section>
          </div>
        ) : null}

        {/* LOADING SHIMMER STATE SCREEN */}
        {loading && (
          <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <LoadingSkeleton />
          </div>
        )}

        {/* SEARCH RENDERING ENGINE IN ACTION */}
        {searchData && !loading && (
          <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SearchResults data={searchData} isLoading={loading} />
          </div>
        )}

      </main>

      {/* Corporate Footers */}
      <Footer />

      {/* Floating Dual Chat & WhatsApp Assistant Widget */}
      <AiAssistantChat />

    </div>
  );
}
