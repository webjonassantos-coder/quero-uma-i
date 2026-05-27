import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, Brain, Bot, Send, X, Sparkles, Check, ArrowRight, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AiAssistantChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Olá! Sou o **Guru da Internet**, seu assistente inteligente. 🚀\n\nPosso te ajudar a encontrar os melhores planos de internet de acordo com a sua necessidade (Claro, TIM, NIO Fibra, etc). \n\nQual velocidade ou operadora você gostaria de comparar hoje?"
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const rawText = textToSend || inputMessage;
    const cleanText = rawText.trim();
    if (!cleanText) return;

    if (!textToSend) {
      setInputMessage("");
    }

    const newMessages: Message[] = [...messages, { role: "user", content: cleanText }];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        throw new Error("Erro na comunicação com o assistente.");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.text }]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Oops! Tive um pequeno problema técnico ao processar sua resposta. Mas você pode falar diretamente com o nosso suporte via WhatsApp no número **(21) 98036-9980** clicando no botão verde abaixo! 👇"
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const QuickReplies = [
    "Planos da NIO Fibra",
    "Melhores planos TIM",
    "Novos combos da Claro",
    "Combos com TV Box"
  ];

  return (
    <>
      {/* 1. DUAL FLOATING CORNER BUTTONS DOCK */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col sm:flex-row gap-3 items-end sm:items-center">
        
        {/* Floating AI Bubble Activator */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          id="ai-assistant-bubble-trigger"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold flex items-center gap-2.5 px-4 py-3 rounded-full shadow-[0_8px_30px_rgb(79,70,229,0.3)] transition-all duration-300 hover:scale-[1.03] active:scale-95 group text-sm outline-none cursor-pointer"
        >
          <span className="relative flex h-3 w-3 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-200"></span>
          </span>
          <Brain className="w-5 h-5 text-indigo-100 group-hover:rotate-12 transition-transform" />
          <span>Falar com IA</span>
        </button>

        {/* Official WhatsApp Floating Button */}
        <a
          href="https://wa.me/5521980369980"
          target="_blank"
          rel="noopener noreferrer"
          id="whatsapp-official-floating-trigger"
          className="bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-[0_8px_30px_rgb(37,211,102,0.3)] transition-all duration-300 hover:scale-[1.08] active:scale-95 flex items-center justify-center group relative cursor-pointer"
          title="Fale direto conosco"
        >
          <span className="absolute -inset-0.5 rounded-full bg-[#25D366]/20 animate-pulse pointer-events-none" />
          <MessageCircle className="w-6 h-6 fill-white stroke-[#25D366] stroke-[1px]" />
          
          {/* Pulsing Helper Tooltip on Desktop */}
          <span className="hidden sm:inline-block absolute right-14 bg-[#1e293b] text-white text-[10px] font-bold px-2.5 py-1.5 rounded-xl whitespace-nowrap shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-2 group-hover:translate-x-0">
            Fale conosco no WhatsApp 📲
          </span>
        </a>

      </div>

      {/* 2. CHAT WIDGET POPUP DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 z-50 flex items-end justify-center sm:block p-4 sm:p-0">
            
            {/* Mobile dark backdrop for focus */}
            <div className="sm:hidden absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setIsOpen(false)} />

            {/* Chat Box */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 35, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              id="ai-assistant-modal-panel"
              className="bg-white rounded-3xl shadow-[0_12px_45px_rgba(15,23,42,0.15)] border border-slate-100 w-full max-w-[420px] h-[520px] sm:h-[580px] flex flex-col overflow-hidden relative"
            >
              
              {/* Header */}
              <div className="bg-indigo-900 text-white p-4 flex justify-between items-center relative overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-950 to-indigo-900 pointer-events-none" />
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="relative z-10 flex items-center gap-3">
                  <div className="bg-white/10 p-2 rounded-2xl border border-white/15">
                    <Bot className="w-5 h-5 text-indigo-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold flex items-center gap-1">
                      <span>Guru da Internet</span>
                      <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                    </h3>
                    <p className="text-[10px] text-indigo-200 font-semibold">Tire dúvidas e compare na hora!</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="relative z-10 text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Conversion Alert Banner */}
              <div className="bg-emerald-50 border-b border-emerald-100 px-4 py-2 flex items-center justify-between shrink-0 text-xs">
                <span className="text-emerald-800 font-bold flex items-center gap-1">
                  💡 Feche seu plano direto no WhatsApp
                </span>
                <a
                  href="https://wa.me/5521980369980"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] px-2 py-1 rounded-lg transition-colors flex items-center gap-1"
                >
                  Ir Agora →
                </a>
              </div>

              {/* Messages viewport */}
              <div className="grow overflow-y-auto p-4 space-y-4 bg-slate-50">
                {messages.map((msg, index) => {
                  const isAi = msg.role === "assistant";
                  return (
                    <div
                      key={index}
                      className={`flex gap-2.5 ${isAi ? "justify-start" : "justify-end"}`}
                    >
                      {isAi && (
                        <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center border border-indigo-200 shrink-0 mt-0.5">
                          <Sparkles className="w-4 h-4 text-indigo-600" />
                        </div>
                      )}
                      
                      <div className={`max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed shadow-3sm ${
                        isAi 
                          ? "bg-white text-slate-800 border border-slate-100/70"
                          : "bg-indigo-600 text-white font-medium"
                      }`}>
                        
                        {/* Render simple custom markdown formatting */}
                        <div className="space-y-2 whitespace-pre-wrap">
                          {msg.content.split("\n\n").map((para, pIdx) => {
                            // Check for bold notation
                            const formattedPara = para.split("**").map((text, idx) => {
                              return idx % 2 === 1 ? <strong key={idx} className="font-extrabold text-indigo-900">{text}</strong> : text;
                            });
                            return <p key={pIdx}>{formattedPara}</p>;
                          })}
                        </div>

                      </div>

                      {!isAi && (
                        <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white shrink-0 mt-0.5 text-xs font-bold">
                          <User className="w-4 h-4 text-indigo-200" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Loading state indicator */}
                {isTyping && (
                  <div className="flex gap-2.5 justify-start">
                    <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center border border-indigo-200 shrink-0">
                      <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
                    </div>
                    <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-center">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={chatEndRef} />
              </div>

              {/* Suggestions / Quick Replies */}
              <div className="px-4 py-2 border-t border-slate-100 overflow-x-auto whitespace-nowrap bg-white/95 flex gap-2 shrink-0 scrollbar-none scroll-smooth">
                {QuickReplies.map((reply, rIdx) => (
                  <button
                    key={rIdx}
                    onClick={() => handleSendMessage(reply)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer border border-slate-200/50 flex-none"
                  >
                    {reply}
                  </button>
                ))}
              </div>

              {/* Chat action footer form */}
              <div className="p-4 border-t border-slate-100 bg-white shrink-0">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Digite sua dúvida aqui..."
                    className="grow bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl transition-colors shrink-0 flex items-center justify-center cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Official WhatsApp permanent conversion button */}
                <div className="mt-3">
                  <a
                    href="https://wa.me/5521980369980"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-[11px] py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all text-center"
                  >
                    <MessageCircle className="w-4 h-4 fill-white stroke-[#25D366] stroke-[1px]" />
                    Chamar Fernanda Vendedora no WhatsApp
                  </a>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
