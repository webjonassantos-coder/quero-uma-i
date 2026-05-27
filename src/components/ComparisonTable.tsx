import { X, Check, HelpCircle, AlertCircle, ShoppingCart } from "lucide-react";
import { Plan, Provider } from "../types";
import ProviderLogo from "./ProviderLogo";

interface ComparisonTableProps {
  plans: Plan[];
  providers: Provider[];
  onRemove: (planId: string) => void;
  searchedCep: string;
}

export default function ComparisonTable({ plans, providers, onRemove, searchedCep }: ComparisonTableProps) {
  if (plans.length === 0) return null;

  const findProvider = (providerId: string) => {
    return providers.find((p) => p.id === providerId);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden mt-12 animate-fadeIn" id="compare-section">
      <div className="p-6 md:p-8 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-charcoal tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-6 bg-primary rounded-full inline-block" />
            Comparador de Planos Lado a Lado
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Compare os detalhes técnicos das melhores ofertas disponíveis para o CEP {searchedCep}.
          </p>
        </div>
        
        <span className="inline-block bg-primary/10 text-primary-dark font-extrabold text-xs px-3.5 py-1.5 rounded-full">
          {plans.length} {plans.length === 1 ? 'plano selecionado' : 'planos selecionados'}
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="p-6 w-1/5 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Especificações
                </th>
                {plans.map((plan) => {
                  const provider = findProvider(plan.provider_id);
                  return (
                    <th
                      key={plan.id}
                      className="p-6 w-1/4 border-b border-slate-100 relative align-top"
                    >
                      <button
                        type="button"
                        onClick={() => onRemove(plan.id)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-red-500 bg-slate-100 hover:bg-slate-200 rounded-full p-1.5 transition-colors"
                        title="Remover comparação"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      {provider && (
                        <div className="mb-4">
                          <ProviderLogo providerId={provider.id} />
                        </div>
                      )}
                      
                      <p className="font-extrabold text-charcoal text-base leading-tight mb-1">{plan.nome}</p>
                      <span className="text-[10px] bg-slate-100 text-[#565656] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                        {plan.tecnologia}
                      </span>

                      <div className="mt-4">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Valor Mensal</span>
                        <div className="flex items-baseline mt-1">
                          <span className="text-sm font-bold text-charcoal mr-0.5">R$</span>
                          <span className="text-3xl font-extrabold text-charcoal tracking-tight">
                            {Math.floor(plan.preco)}
                          </span>
                          <span className="text-sm font-extrabold text-charcoal">
                            ,{(plan.preco % 1).toFixed(2).substring(2)}
                          </span>
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-6 font-bold text-slate-700 text-sm">Velocidade Contratada</td>
                {plans.map((plan) => (
                  <td key={plan.id} className="p-6">
                    <span className="text-xl font-extrabold text-[#00ACA4]">{plan.velocidade} Mega</span>
                    <span className="text-xs text-[#565656] block mt-0.5">Franquia de dados ilimitada</span>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-6 font-bold text-slate-700 text-sm">Velocidade de Download</td>
                {plans.map((plan) => (
                  <td key={plan.id} className="p-6 text-sm text-slate-800 font-semibold">
                    {plan.download} Mbps
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-6 font-bold text-slate-700 text-sm">Velocidade de Upload</td>
                {plans.map((plan) => (
                  <td key={plan.id} className="p-6 text-sm text-slate-800 font-semibold">
                    {plan.upload} Mbps
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-6 font-bold text-slate-700 text-sm">Tecnologia de Transmissão</td>
                {plans.map((plan) => (
                  <td key={plan.id} className="p-6">
                    <span className="inline-block bg-teal-50 text-primary-dark font-extrabold text-xs px-2.5 py-1 rounded-full border border-teal-100">
                      {plan.tecnologia}
                    </span>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-6 font-bold text-slate-700 text-sm">Contrato de Fidelidade</td>
                {plans.map((plan) => (
                  <td key={plan.id} className="p-6 text-sm font-medium text-slate-700">
                    {plan.fidelidade ? (
                      <span className="text-amber-600 font-semibold">Sim (12 meses)</span>
                    ) : (
                      <span className="text-emerald-600 font-semibold">Sem fidelidade</span>
                    )}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-6 font-bold text-slate-700 text-sm">Taxa de Instalação</td>
                {plans.map((plan) => (
                  <td key={plan.id} className="p-6 text-sm font-bold">
                    {plan.instalacao === 0 ? (
                      <span className="text-emerald-600">Grátis</span>
                    ) : (
                      <span className="text-slate-800">R$ {plan.instalacao.toFixed(2)}</span>
                    )}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-6 font-bold text-slate-700 text-sm">Model/Router Wi-Fi</td>
                {plans.map((plan) => (
                  <td key={plan.id} className="p-6 text-xs font-semibold text-slate-600">
                    {plan.wifi}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-6 font-bold text-slate-700 text-sm">Serviços Inclusos</td>
                {plans.map((plan) => (
                  <td key={plan.id} className="p-6">
                    {plan.streaming && plan.streaming.length > 0 ? (
                      <div className="flex flex-col gap-1.5">
                        {plan.streaming.map((stream, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span>{stream}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">-</span>
                    )}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-6 font-bold text-slate-700 text-sm border-b-0">Relevância / Custo-benefício</td>
                {plans.map((plan) => (
                  <td key={plan.id} className="p-6 border-b-0">
                    <div className="flex items-center gap-1.5 bg-yellow-50 border border-yellow-100 text-amber-700 font-extrabold px-3 py-1 rounded-xl w-fit text-sm">
                      ★ {plan.relevancia}
                    </div>
                  </td>
                ))}
              </tr>

              <tr className="bg-slate-50/40">
                <td className="p-6 border-b-0" />
                {plans.map((plan) => {
                  const provider = findProvider(plan.provider_id);
                  const waText = encodeURIComponent(
                    `Olá! Gostaria de prosseguir com a contratação do plano ${plan.nome} de ${plan.velocidade} Mbps após comparar no "Quero uma Internet"! Meu CEP é ${searchedCep}.`
                  );
                  const waUrl = provider ? `https://wa.me/${provider.whatsapp}?text=${waText}` : "#";

                  return (
                    <td key={plan.id} className="p-6 border-b-0">
                      <a
                        href={waUrl}
                        target="_blank"
                        referrerPolicy="no-referrer"
                        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Contratar Plano</span>
                      </a>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
