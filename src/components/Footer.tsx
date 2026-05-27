import { Phone, Shield, Clipboard, ShieldCheck, Mail, HelpCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 text-slate-500 py-16 mt-24" id="main-application-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* UPPER GRID ROW */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-slate-150">
          
          {/* Brand block Column */}
          <div className="col-span-1 md:col-span-1 space-y-4">
            <span className="font-extrabold text-charcoal text-xl tracking-tight leading-none block">
              Quero uma<span className="text-[#00ACA4]"> Internet</span>
            </span>
            <p className="text-xs font-semibold leading-relaxed text-slate-400">
              A melhor e mais veloz ferramenta de comparação de planos de internet banda larga e fibra óptica do Brasil.
            </p>
            <div className="flex gap-3 pt-2">
              <span className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-primary transition-colors cursor-pointer text-sm font-bold">f</span>
              <span className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-primary transition-colors cursor-pointer text-sm font-bold">t</span>
              <span className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-primary transition-colors cursor-pointer text-sm font-bold">i</span>
            </div>
          </div>

          {/* Links 1 */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold text-[#353535] uppercase tracking-wider">Planos e Operadoras</h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><a href="#" className="hover:text-primary transition-colors">Planos NIO Internet</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Planos Claro Residencial</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Planos TIM UltraFibra</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Provedores Regionais</a></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold text-[#353535] uppercase tracking-wider">Suporte e Dúvidas</h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><a href="#" className="hover:text-primary transition-colors">Como funciona a comparação</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Teste de Velocidade de Internet</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Artigos de Ajuda e Tutoriais</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Perguntas Frequentes (FAQ)</a></li>
            </ul>
          </div>

          {/* Compliance Card Widget */}
          <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-150/60">
            <div className="flex gap-2 text-[#353535] font-black tracking-widest text-[10px] uppercase items-center">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Garantias e LGPD</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
              Trabalhamos em conformidade absoluta com a Lei Geral de Proteção de Dados Comerciais. Nós não coletamos nem vendemos as informações dos seus formulários.
            </p>
          </div>

        </div>

        {/* COMPLIANCE DECK ROW */}
        <div className="pt-12 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex flex-col text-center sm:text-left gap-1">
            <span className="text-xs text-slate-400 font-bold">
              © 2026 Quero uma Internet Compare Broker. Todos os direitos reservados.
            </span>
            <span className="text-[10px] text-slate-300 font-medium leading-relaxed">
              Quero uma Internet Ltda. CNPJ: 45.192.481/0001-90. Valores e velocidades exibidos podem sofrer reajustes conforme viabilidade operacional das operadoras parceiras.
            </span>
          </div>

          <div className="flex gap-4 text-xs font-semibold text-slate-400">
            <a href="#" className="hover:underline">Políticas de Privacidade</a>
            <span>•</span>
            <a href="#" className="hover:underline">Termos de Uso</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
