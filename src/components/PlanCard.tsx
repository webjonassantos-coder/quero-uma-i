import { useState } from "react";
import { Phone, Wifi, ShieldCheck, Tag, HelpCircle, Flame, Plus, Check } from "lucide-react";
import { Plan, Provider } from "../types";
import ProviderLogo from "./ProviderLogo";

interface PlanCardProps {
  key?: string | number;
  plan: Plan;
  provider: Provider;
  searchedCep: string;
  onCompareToggle: (planId: string) => void;
  isComparing: boolean;
  onSelectAction: (plan: Plan, provider: Provider) => void;
}

export default function PlanCard({
  plan,
  provider,
  searchedCep,
  onCompareToggle,
  isComparing,
  onSelectAction,
}: PlanCardProps) {
  // Auto calculate cost-benefit stars/score
  const scoreStars = Number(plan.relevancia).toFixed(1);

  // Generate WhatsApp message content for high conversion mapping
  const waText = encodeURIComponent(
    `Olá! Estava navegando no "Quero uma Internet" e gostei muito do plano ${plan.nome} (${plan.velocidade} Mega por R$ ${plan.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/mês). Gostaria de consultar a cobertura final para o meu CEP: ${searchedCep}.`
  );
  const waUrl = `https://wa.me/${provider.whatsapp}?text=${waText}`;

  return (
    <div
      className={`relative bg-white rounded-3xl border transition-all duration-300 flex flex-col overflow-hidden ${
        plan.relevancia >= 4.8
          ? "border-[#00ACA4] ring-2 ring-[#00ACA4]/10 shadow-[0_12px_30px_rgba(0,172,164,0.12)]"
          : "border-slate-100 shadow-[0_8px_16px_rgba(15,23,42,0.03)] hover:shadow-[0_12px_24px_rgba(15,23,42,0.06)] hover:border-slate-200"
      }`}
      id={`plan-card-${plan.id}`}
    >
      {/* Prime Highlight Tag for high value-for-money plans */}
      {plan.relevancia >= 4.8 && (
        <div className="absolute top-0 right-6 bg-[#00ACA4] text-white text-xs font-bold px-3 py-1.5 rounded-b-xl flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 fill-white" />
          <span>MELHOR OPÇÃO</span>
        </div>
      )}

      {/* Primary Card Top Block */}
      <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
        <div>
          {/* Operator and Technology Badge */}
          <div className="flex justify-between items-center mb-6">
            <ProviderLogo providerId={provider.id} />
            <span className="text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
              {plan.tecnologia}
            </span>
          </div>

          {/* Speed & Basic Info */}
          <div className="mb-4">
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl md:text-5xl font-extrabold text-[#353535] tracking-tight">
                {plan.velocidade}
              </span>
              <span className="text-xl font-bold text-[#00ACA4]">Mega</span>
            </div>
            <p className="text-xs text-[#565656] font-medium mt-1">
              Download de {plan.download} Mega • Upload de {plan.upload} Mega
            </p>
          </div>

          {/* Core Feature Checks */}
          <div className="space-y-2.5 my-5 border-t border-slate-50 pt-5">
            <div className="flex items-center text-xs text-slate-700 font-medium gap-2">
              <Wifi className="w-4 h-4 text-[#00ACA4] shrink-0" />
              <span>{plan.wifi}</span>
            </div>
            <div className="flex items-center text-xs text-slate-700 font-medium gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00ACA4] shrink-0" />
              <span>
                {plan.instalacao === 0 ? "Instalação 100% Grátis" : `Instalação de R$ ${plan.instalacao.toFixed(2)}`}
              </span>
            </div>
            <div className="flex items-center text-xs text-slate-700 font-medium gap-2">
              <Tag className="w-4 h-4 text-[#00ACA4] shrink-0" />
              <span>{plan.fidelidade ? "Fidelidade de 12 meses" : "Sem fidelidade contratual"}</span>
            </div>
          </div>

          {/* Bundled Strems & Extras */}
          {plan.streaming && plan.streaming.length > 0 && (
            <div className="mb-6 bg-slate-50/75 rounded-2xl p-3 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block mb-2 uppercase tracking-wide">
                Serviços de Stream inclusos:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {plan.streaming.map((stream, idx) => (
                  <span
                    key={idx}
                    className="bg-white border border-slate-150 rounded-lg px-2 py-1 text-[11px] text-[#353535] font-semibold shadow-2sm"
                  >
                    {stream}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Claro Combos & TV Box Display */}
          {plan.combo_preco_single !== undefined && (
            <div className="mb-6 bg-sky-50/40 border border-sky-100 rounded-2xl p-4">
              <span className="text-[10px] font-bold text-sky-700 block mb-2.5 uppercase tracking-wide">
                Combos & Opções (Claro com Celular):
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center text-[#353535] py-0.5 border-b border-sky-100/30">
                  <span className="font-semibold text-slate-600 flex items-center gap-1">
                    👤 Planos de Internet Single
                  </span>
                  <span className="font-extrabold text-slate-800">
                    R$ {plan.combo_preco_single.toFixed(2).replace(".", ",")}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-emerald-50 text-emerald-800 p-2 rounded-xl border border-emerald-150 shadow-2sm">
                  <span className="font-bold flex items-center gap-1.5 text-[11px]">
                    <span className="flex h-2 w-2 relative shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    No Multi Combo com 5G
                  </span>
                  <span className="font-extrabold text-[#15803d]">
                    R$ {plan.combo_preco_multi?.toFixed(2).replace(".", ",")}
                  </span>
                </div>
                {plan.tv_box_disponivel && (
                  <div className="text-[10px] text-sky-700/95 font-semibold mt-1 bg-white/75 rounded-xl p-2 border border-sky-100/55 flex flex-col gap-1">
                    <span className="flex items-center gap-1 text-slate-700">📺 Compatível com Claro tv+ Box / Combo Completo</span>
                    <span className="flex items-center gap-1 text-slate-700">📱 Portabilidade Sim chip habilitado com 5G</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Pricing Layout */}
        <div className="mt-auto pt-6 border-t border-slate-100 flex justify-between items-end">
          <div>
            <span className="text-xs text-[#565656] font-semibold block">
              {plan.combo_preco_single !== undefined ? "A partir de" : "Valor mensal"}
            </span>
            <div className="flex items-baseline">
              <span className="text-sm font-bold text-[#353535] mr-0.5">R$</span>
              <span className="text-3xl font-extrabold text-[#353535] tracking-tight">
                {Math.floor(plan.preco)}
              </span>
              <span className="text-sm font-extrabold text-[#353535]">
                ,{(plan.preco % 1).toFixed(2).substring(2)}
              </span>
              <span className="text-xs text-slate-500 font-medium ml-1">/mês*</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">
              {plan.combo_preco_single !== undefined 
                ? "*Valor especial no combo Multi com 5G."
                : "*Desconto no débito automático incluso."}
            </span>
          </div>

          <div className="flex flex-col items-end gap-1.5" id="score-block">
            <div className="flex items-center gap-1 bg-yellow-50 text-amber-600 px-2 py-0.5 rounded-lg border border-amber-100 text-xs font-bold">
              ★ {scoreStars}
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Relevância Geral</span>
          </div>
        </div>
      </div>

      {/* Buttons and Actions footer bar */}
      <div className="bg-slate-50/80 border-t border-slate-100 p-5 flex flex-col gap-2.5">
        <a
          href={waUrl}
          target="_blank"
          referrerPolicy="no-referrer"
          id={`btn-wa-contract-${plan.id}`}
          className="w-full bg-[#25D366] hover:bg-[#20BA56] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-[0.98] transition-all duration-150 cursor-pointer"
        >
          <svg className="w-5 h-5 fill-white shrink-0" viewBox="0 0 24 24">
            <path d="M12.003 2.001c-5.52 0-9.99 4.47-9.99 9.99 0 2.006.589 3.877 1.6 5.454l-1.61 5.867 6.01-1.577c1.517.824 3.245 1.29 5.08 1.29 5.51 0 9.99-4.48 9.99-10s-4.48-10-9.99-10zm5.93 14.16c-.24.68-1.23 1.25-1.91 1.33-.58.07-1.3.1-3.84-.95-3.24-1.34-5.28-4.63-5.44-4.85-.16-.22-1.28-1.72-1.28-3.28 0-1.56.8-2.33 1.09-2.63.24-.25.64-.38.99-.38.12 0 .23 0 .33.01.29.01.44.02.63.48.24.58.82 2.02.89 2.16.07.14.12.31.02.5-.1.19-.24.41-.36.56-.12.14-.24.3-.1.54.14.24.62 1.03 1.33 1.66.91.81 1.68 1.06 1.92 1.18.24.12.38.1.52-.06.14-.16.63-.73.79-.99.16-.26.33-.22.56-.14.24.08 1.51.71 1.77.84.26.13.43.19.49.3.07.12.07.69-.17 1.37z" />
          </svg>
          <span className="text-sm">Contratar via WhatsApp</span>
        </a>

        <div className="flex gap-2.5">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            id={`btn-call-${plan.id}`}
            className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-all duration-150 cursor-pointer text-[11px] sm:text-xs"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-500" />
            <span>WhatsApp: {provider.telefone}</span>
          </a>

          <button
            type="button"
            id={`btn-toggle-compare-${plan.id}`}
            onClick={() => onCompareToggle(plan.id)}
            className={`px-3 py-2.5 rounded-xl border font-semibold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all duration-150 cursor-pointer text-xs ${
              isComparing
                ? "bg-[#00ACA4]/10 border-[#00ACA4] text-[#00ACA4]"
                : "bg-white border-slate-200 text-slate-500 hover:text-charcoal hover:bg-slate-50"
            }`}
          >
            {isComparing ? (
              <>
                <Check className="w-3.5 h-3.5 text-primary" strokeWidth={3} />
                <span className="hidden sm:inline">Comparando</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Comparar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
