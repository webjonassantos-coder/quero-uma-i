import express from "express";
import path from "path";
import dns from "dns";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { Provider, Plan, Coverage, SearchResult } from "./src/types.js"; // note: node import styles

// Set DNS order to prefer ipv4 to bypass potential docker connectivity issues
dns.setDefaultResultOrder("ipv4first");

const app = express();
const PORT = 3000;

app.use(express.json());

// IN-MEMORY REDIS-LIKE CACHE ENGINE
interface CacheEntry {
  data: any;
  timestamp: number;
}
const apiCache = new Map<string, CacheEntry>();
const CACHE_TTL = 1000 * 60 * 60; // 1 Hour

function getCached(key: string): any | null {
  const item = apiCache.get(key);
  if (!item) return null;
  if (Date.now() - item.timestamp > CACHE_TTL) {
    apiCache.delete(key);
    return null;
  }
  return item.data;
}

function setCached(key: string, data: any): void {
  apiCache.set(key, { data, timestamp: Date.now() });
}

// MOCK DATABASES & REGIONAL COVERAGE DEFINITIONS
const PROVIDERS: Provider[] = [
  {
    id: "nio",
    nome: "NIO INTERNET",
    logo: "nio",
    slug: "nio",
    site: "https://www.niointernet.com.br",
    telefone: "(21) 98036-9980",
    whatsapp: "5521980369980"
  },
  {
    id: "claro",
    nome: "Claro net",
    logo: "claro",
    slug: "claro",
    site: "https://www.claro.com.br",
    telefone: "(21) 98036-9980",
    whatsapp: "5521980369980"
  },
  {
    id: "tim",
    nome: "TIM UltraFibra",
    logo: "tim",
    slug: "tim",
    site: "https://www.tim.com.br",
    telefone: "(21) 98036-9980",
    whatsapp: "5521980369980"
  },
  {
    id: "brisanet",
    nome: "Brisanet",
    logo: "brisanet",
    slug: "brisanet",
    site: "https://www.brisanet.com.br",
    telefone: "(21) 98036-9980",
    whatsapp: "5521980369980",
    regional: true
  },
  {
    id: "desktop",
    nome: "Desktop IP",
    logo: "desktop",
    slug: "desktop",
    site: "https://www.desktop.com.br",
    telefone: "(21) 98036-9980",
    whatsapp: "5521980369980",
    regional: true
  }
];

const PLANS: Plan[] = [
  // NIO Internet Plans (Parceiro Especial)
  {
    id: "nio-500",
    provider_id: "nio",
    nome: "NIO Fibra 500 Mega Essencial",
    velocidade: 500,
    download: 500,
    upload: 250,
    preco: 100.00,
    instalacao: 0,
    wifi: "Roteador Wi-Fi 5",
    streaming: ["Wi-Fi 5 Incluso"],
    fidelidade: true,
    tecnologia: "Fibra",
    relevancia: 4.8
  },
  {
    id: "nio-700",
    provider_id: "nio",
    nome: "NIO Fibra 700 Mega Super + Globoplay",
    velocidade: 700,
    download: 700,
    upload: 350,
    preco: 130.00,
    instalacao: 0,
    wifi: "Roteador Wi-Fi 6",
    streaming: ["Globoplay"],
    fidelidade: true,
    tecnologia: "Fibra",
    relevancia: 4.9
  },
  {
    id: "nio-1000",
    provider_id: "nio",
    nome: "NIO Fibra 1 Giga Ultra + Globoplay",
    velocidade: 1000,
    download: 1000,
    upload: 500,
    preco: 160.00,
    instalacao: 0,
    wifi: "Mais estabilidade, menos latência",
    streaming: ["Globoplay", "1 Ponto Extra Mesh"],
    fidelidade: true,
    tecnologia: "Fibra",
    relevancia: 5.0
  },

  // Claro Broadband Plans
  {
    id: "claro-350",
    provider_id: "claro",
    nome: "Claro Fibra 350 Mega + Globoplay",
    velocidade: 350,
    download: 350,
    upload: 35,
    preco: 79.90,
    instalacao: 0,
    wifi: "Wi-Fi Dual Band Incluso",
    streaming: ["Globoplay", "Claro tv+", "Claro banca", "McAfee"],
    fidelidade: true,
    tecnologia: "Fibra",
    relevancia: 4.8,
    combo_preco_single: 99.90,
    combo_preco_multi: 79.90,
    tv_box_disponivel: true
  },
  {
    id: "claro-500",
    provider_id: "claro",
    nome: "Claro Fibra 500 Mega + Globoplay",
    velocidade: 500,
    download: 500,
    upload: 50,
    preco: 99.90,
    instalacao: 0,
    wifi: "Wi-Fi Premium Incluso",
    streaming: ["Globoplay", "Claro tv+", "Claro banca", "McAfee", "Ponto Ultra"],
    fidelidade: true,
    tecnologia: "Fibra",
    relevancia: 4.9,
    combo_preco_single: 119.90,
    combo_preco_multi: 99.90,
    tv_box_disponivel: true
  },
  {
    id: "claro-1000",
    provider_id: "claro",
    nome: "Claro Fibra 1 Giga + Globoplay",
    velocidade: 1000,
    download: 1000,
    upload: 100,
    preco: 149.90,
    instalacao: 0,
    wifi: "Ponto Ultra + Wi-Fi 6 Mesh Incluso",
    streaming: ["Globoplay", "Claro tv+", "Claro banca", "McAfee", "Ponto Ultra"],
    fidelidade: true,
    tecnologia: "Fibra",
    relevancia: 5.0,
    combo_preco_single: 199.90,
    combo_preco_multi: 149.90,
    tv_box_disponivel: true
  },

  // TIM UltraFibra Plans
  {
    id: "tim-400",
    provider_id: "tim",
    nome: "TIM UltraFibra 400 Mega",
    velocidade: 400,
    download: 400,
    upload: 200,
    preco: 99.90,
    instalacao: 0,
    wifi: "Roteador Wi-Fi Incluso",
    streaming: ["Serviços digitais inclusos"],
    fidelidade: true,
    tecnologia: "Fibra",
    relevancia: 4.7
  },
  {
    id: "tim-600",
    provider_id: "tim",
    nome: "TIM UltraFibra 600 Mega",
    velocidade: 600,
    download: 600,
    upload: 300,
    preco: 109.90,
    instalacao: 0,
    wifi: "Super Wi-Fi Incluso",
    streaming: ["Serviços digitais inclusos"],
    fidelidade: true,
    tecnologia: "Fibra",
    relevancia: 4.8
  },
  {
    id: "tim-700",
    provider_id: "tim",
    nome: "TIM UltraFibra 700 Mega + Globoplay",
    velocidade: 700,
    download: 700,
    upload: 350,
    preco: 109.99,
    instalacao: 0,
    wifi: "Super Wi-Fi incluso",
    streaming: ["Globoplay", "Serviços digitais inclusos", "600 Mega + 100 Mega de bônus por 12 meses"],
    fidelidade: true,
    tecnologia: "Fibra",
    relevancia: 4.9
  },
  {
    id: "tim-700-paramount",
    provider_id: "tim",
    nome: "TIM UltraFibra 700 Mega + Paramount+",
    velocidade: 700,
    download: 700,
    upload: 350,
    preco: 119.99,
    instalacao: 0,
    wifi: "Super Wi-Fi incluso",
    streaming: ["Paramount+", "Serviços digitais inclusos"],
    fidelidade: true,
    tecnologia: "Fibra",
    relevancia: 4.8
  },
  {
    id: "tim-1000",
    provider_id: "tim",
    nome: "TIM UltraFibra 1 Giga Turbo",
    velocidade: 1000,
    download: 1000,
    upload: 500,
    preco: 129.99,
    instalacao: 0,
    wifi: "Wi-Fi Ultrapotente incluso",
    streaming: ["Serviços digitais classe Giga"],
    fidelidade: true,
    tecnologia: "Fibra",
    relevancia: 5.0
  },
  {
    id: "tim-2000-combo",
    provider_id: "tim",
    nome: "TIM UltraFibra 2 Giga Ultra Combo",
    velocidade: 2000,
    download: 2000,
    upload: 1000,
    preco: 369.99,
    instalacao: 0,
    wifi: "Roteador Wi-Fi 6 de alta performance",
    streaming: ["Max (HBO Max)", "Paramount+", "Deezer Premium", "Serviços digitais do plano"],
    fidelidade: true,
    tecnologia: "Fibra",
    relevancia: 4.7
  },

  // Brisanet Plans (Nordeste)
  {
    id: "brisanet-400",
    provider_id: "brisanet",
    nome: "Brisa Fibra Express 400M",
    velocidade: 400,
    download: 400,
    upload: 200,
    preco: 89.90,
    instalacao: 0,
    wifi: "Roteador Wi-Fi incluso",
    streaming: ["BrisaMusic", "BrisaTv Lite"],
    fidelidade: true,
    tecnologia: "Fibra",
    relevancia: 4.7
  },
  {
    id: "brisanet-600",
    provider_id: "brisanet",
    nome: "Brisa Fibra Super 600M",
    velocidade: 600,
    download: 600,
    upload: 300,
    preco: 109.90,
    instalacao: 0,
    wifi: "Wi-Fi Dual Band de Longo Alcance",
    streaming: ["BrisaMusic Premium", "BrisaTv Família"],
    fidelidade: true,
    tecnologia: "Fibra",
    relevancia: 4.8
  },
  {
    id: "brisanet-1000",
    provider_id: "brisanet",
    nome: "Brisa Giga Max 1000M",
    velocidade: 1000,
    download: 1000,
    upload: 500,
    preco: 179.90,
    instalacao: 0,
    wifi: "Wi-Fi 6 de Última Geração",
    streaming: ["BrisaMusic Premium", "Globoplay"],
    fidelidade: true,
    tecnologia: "Fibra",
    relevancia: 4.9
  },

  // Desktop Plans (Interior de SP)
  {
    id: "desktop-400",
    provider_id: "desktop",
    nome: "Desktop Fibra 400 Mega",
    velocidade: 400,
    download: 400,
    upload: 200,
    preco: 99.90,
    instalacao: 0,
    wifi: "Banda Larga Wi-Fi Incluso",
    streaming: ["Desktop Kids"],
    fidelidade: true,
    tecnologia: "Fibra",
    relevancia: 4.6
  },
  {
    id: "desktop-600",
    provider_id: "desktop",
    nome: "Desktop Fibra 600 Mega + TV",
    velocidade: 600,
    download: 600,
    upload: 300,
    preco: 119.90,
    instalacao: 0,
    wifi: "Wi-Fi Dual Band Super",
    streaming: ["Desktop Lite TV Go", "Skeelo"],
    fidelidade: true,
    tecnologia: "Fibra",
    relevancia: 4.7
  },
  {
    id: "desktop-1000",
    provider_id: "desktop",
    nome: "Desktop Giga 1000 Mega",
    velocidade: 1000,
    download: 1000,
    upload: 500,
    preco: 199.90,
    instalacao: 0,
    wifi: "Equipamento Wi-Fi 6 Turbinado",
    streaming: ["Max (HBO)", "Desktop Lite TV Premium"],
    fidelidade: true,
    tecnologia: "Fibra",
    relevancia: 4.8
  }
];

// Helper to determine available carriers based on state (CEP leading digit)
function getProvidersForCEP(cep: string): string[] {
  const clean = cep.replace(/\D/g, "");
  if (!clean || clean.length < 3) return ["nio", "claro", "tim"];

  const prefixDigit = clean.charAt(0);
  
  // 0 or 1: São Paulo Interior / Capital -> NIO, Claro, TIM, Desktop
  if (prefixDigit === "0" || prefixDigit === "1") {
    return ["nio", "claro", "tim", "desktop"];
  }
  // 2 or 3: RJ, ES, MG -> NIO, Claro, TIM
  if (prefixDigit === "2" || prefixDigit === "3") {
    return ["nio", "claro", "tim"];
  }
  // 4, 5, 6: Northeast region (Ceará, Pernambuco, etc.) -> NIO, Claro, TIM, Brisanet
  if (["4", "5", "6"].includes(prefixDigit)) {
    return ["nio", "claro", "tim", "brisanet"];
  }
  
  // Nationwide coverage giants by default
  return ["nio", "claro", "tim"];
}

// RESTFUL BACKEND ENDPOINTS

// 1. GEOCODING & AUTOCOMPLETE VIA NOMINATIM & FALLBACKS
app.get("/api/autocomplete", async (req, res) => {
  const query = req.query.q as string;
  if (!query || query.trim().length < 3) {
    return res.json([]);
  }

  const cacheKey = `autocomplete:${query.toLowerCase().trim()}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  // Fallback static dataset representation of beautiful Brazilian neighborhoods/cities
  const fallbacks = [
    { label: "Avenida Paulista, Cerqueira César, São Paulo - SP", cep: "01311-200", cidade: "São Paulo", estado: "SP", bairro: "Cerqueira César", rua: "Avenida Paulista", lat: -23.5615, lon: -46.6558 },
    { label: "Rua Copacabana, Copacabana, Rio de Janeiro - RJ", cep: "22060-002", cidade: "Rio de Janeiro", estado: "RJ", bairro: "Copacabana", rua: "Rua Copacabana", lat: -22.9698, lon: -43.1843 },
    { label: "Avenida Getúlio Vargas, Savassi, Belo Horizonte - MG", cep: "30112-021", cidade: "Belo Horizonte", estado: "MG", bairro: "Savassi", rua: "Avenida Getúlio Vargas", lat: -19.9329, lon: -43.9351 },
    { label: "Rua Floriano Peixoto, Centro, Fortaleza - CE", cep: "60025-130", cidade: "Fortaleza", estado: "CE", bairro: "Centro", rua: "Rua Floriano Peixoto", lat: -3.7275, lon: -38.5275 },
    { label: "Rua dos Pinheiros, Pinheiros, São Paulo - SP", cep: "05422-001", cidade: "São Paulo", estado: "SP", bairro: "Pinheiros", rua: "Rua dos Pinheiros", lat: -23.5678, lon: -46.6852 },
    { label: "Avenida Boa Viagem, Boa Viagem, Recife - PE", cep: "51021-000", cidade: "Recife", estado: "PE", bairro: "Boa Viagem", rua: "Avenida Boa Viagem", lat: -8.1189, lon: -34.8943 }
  ];

  try {
    // Attempt Nominatim fetch for absolute real lookup in Brazil
    const cleanQuery = `${query} Brasil`;
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanQuery)}&limit=5&addressdetails=1`,
      {
        headers: { "User-Agent": "QueroUmaInternetCompareBrokerApp/1.0" }
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        const results = data.map((item: any) => {
          const address = item.address || {};
          const city = address.city || address.town || address.municipality || address.village || "";
          const state = address.state_code?.toUpperCase() || address.state || "";
          const postcode = address.postcode || "";
          const neighborhood = address.suburb || address.neighbourhood || address.city_district || "";
          const road = address.road || "";
          
          return {
            label: item.display_name,
            cep: postcode,
            cidade: city,
            estado: state,
            bairro: neighborhood,
            rua: road,
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon)
          };
        });
        
        setCached(cacheKey, results);
        return res.json(results);
      }
    }
  } catch (err) {
    console.error("Nominatim API fail, utilizing smart local fallbacks:", err);
  }

  // If external call fails or yields empty, filter fallbacks based on typed match
  const matchedFallbacks = fallbacks.filter(item =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );
  
  const finalResults = matchedFallbacks.length > 0 ? matchedFallbacks : fallbacks.slice(0, 3);
  setCached(cacheKey, finalResults);
  return res.json(finalResults);
});

// 2. CEP LOOKUP VIA VIACEP OR BRASILAPI AND COVERAGE EVALUATION
app.get("/api/search", async (req, res) => {
  const { cep, latitude, longitude } = req.query;

  let queryCep = (cep as string || "").replace(/\D/g, "");
  let lat = parseFloat(latitude as string || "0");
  let lng = parseFloat(longitude as string || "0");
  
  let detectedCity = "São Paulo";
  let detectedState = "SP";
  let detectedDistrict = "Cerqueira César";
  let detectedStreet = "Avenida Paulista";

  if (queryCep.length === 8) {
    const cacheKey = `cep:${queryCep}`;
    const cachedResult = getCached(cacheKey);
    
    if (cachedResult) {
      return res.json(cachedResult);
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${queryCep}/json/`);
      if (response.ok) {
        const data = await response.json();
        if (!data.erro) {
          detectedCity = data.localidade || detectedCity;
          detectedState = data.uf || detectedState;
          detectedDistrict = data.bairro || detectedDistrict;
          detectedStreet = data.logradouro || detectedStreet;
          
          // Approximate coordinate mapping if lat/lng is 0
          if (lat === 0 || lng === 0) {
            // Give specific coordinates to major state capitals
            if (detectedState === "SP") { lat = -23.5505; lng = -46.6333; }
            else if (detectedState === "RJ") { lat = -22.9068; lng = -43.1729; }
            else if (detectedState === "MG") { lat = -19.9173; lng = -43.9345; }
            else if (detectedState === "CE") { lat = -3.7319; lng = -38.5267; }
            else if (detectedState === "PE") { lat = -8.0578; lng = -34.8778; }
            else {
              lat = -15.7938; lng = -47.8828; // Brasília fallback
            }
            // Add slight randomness so mapping pins generate naturally
            lat += (parseInt(queryCep.substring(5, 8)) - 450) / 10000;
            lng += (parseInt(queryCep.substring(5, 8)) - 450) / 10000;
          }
        }
      }
    } catch (err) {
      console.error("ViaCEP service issue:", err);
    }
  } else if (lat !== 0 && lng !== 0) {
    // Geolocation provided, attempt reverse mapping using Nominatim
    const cacheKey = `geo:${lat}:${lng}`;
    const cachedResult = getCached(cacheKey);
    if (cachedResult) {
      return res.json(cachedResult);
    }

    try {
      const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
        headers: { "User-Agent": "QueroUmaInternetCompareBrokerApp/1.0" }
      });
      if (resp.ok) {
        const data = await resp.json();
        const address = data.address || {};
        detectedCity = address.city || address.town || address.municipality || detectedCity;
        detectedState = address.state_code?.toUpperCase() || address.state || detectedState;
        detectedDistrict = address.suburb || address.neighbourhood || detectedDistrict;
        detectedStreet = address.road || detectedStreet;
        queryCep = (address.postcode || "").replace(/\D/g, "") || "01311200";
      }
    } catch (err) {
      console.error("Reverse geocoding failure:", err);
    }
  } else {
    // Default fallback
    queryCep = "01311200";
    lat = -23.5615;
    lng = -46.6558;
  }

  // Format valid cep for frontend e.g. "01311-200"
  const formattedCep = queryCep.length === 8 
    ? `${queryCep.substring(0, 5)}-${queryCep.substring(5)}`
    : "01311-200";

  // FILTER CARRIERS AND ASSEMBLE MATCH COVERAGE
  const matchedProviderIds = getProvidersForCEP(queryCep);
  const matchedProviders = PROVIDERS.filter(p => matchedProviderIds.includes(p.id));
  const matchedPlans = PLANS.filter(p => matchedProviderIds.includes(p.provider_id));

  // Build Coverage schemas
  const matchedCoverage: Coverage[] = matchedProviders.map((prov, idx) => ({
    id: `cov-${prov.id}-${queryCep}`,
    provider_id: prov.id,
    cidade: detectedCity,
    bairro: detectedDistrict,
    cep_inicial: queryCep,
    cep_final: queryCep,
    latitude: lat + (idx * 0.0014 - 0.002), // offset nodes slightly for multi-marker plotting
    longitude: lng + (idx * -0.0018 + 0.002)
  }));

  const responsePayload: SearchResult = {
    cep: formattedCep,
    cidade: detectedCity,
    estado: detectedState,
    bairro: detectedDistrict,
    rua: detectedStreet,
    latitude: lat,
    longitude: lng,
    providers: matchedProviders,
    plans: matchedPlans,
    coverage: matchedCoverage
  };

  // Cache results
  setCached(`search:${queryCep}`, responsePayload);
  return res.json(responsePayload);
});

// 3. AI ASSISTANT CHAT ROUTE WITH GEMINI
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Mensagens inválidas" });
  }

  try {
    const ai = getGenAI();
    
    // Summary of plans for context integration
    const plansSummary = PLANS.map(plan => {
      const provider = PROVIDERS.find(p => p.id === plan.provider_id)?.nome || plan.provider_id.toUpperCase();
      let details = `- **${provider} ${plan.nome}** (${plan.velocidade} Mega): R$ ${plan.preco.toFixed(2).replace(".", ",")} por mês. Tecnologia: ${plan.tecnologia}. Wi-Fi: ${plan.wifi}.`;
      if (plan.streaming && plan.streaming.length > 0) {
        details += ` Inclusos: ${plan.streaming.join(", ")}.`;
      }
      if (plan.combo_preco_single !== undefined) {
        details += ` Preço Single: R$ ${plan.combo_preco_single.toFixed(2).replace(".", ",")}, no Multi Combo com 5G: R$ ${plan.combo_preco_multi?.toFixed(2).replace(".", ",")}.`;
      }
      if (plan.tv_box_disponivel) {
        details += ` Compatível com Claro tv+ Box / Tv Box.`;
      }
      return details;
    }).join("\n");

    const systemInstruction = `Você é o "Guru da Internet", assistente virtual inteligente e especialista em planos de internet banda larga e fibra óptica para a plataforma "Quero uma Internet".

SELO DE PRIORIDADE MÁXIMA:
Seu objetivo absoluto é ajudar o usuário a encontrar o plano ideal e direcioná-lo para falar com a vendedora autorizada (Fernanda) no WhatsApp oficial da empresa.
- WhatsApp Oficial: (21) 98036-9980
- Link do WhatsApp oficial: https://wa.me/5521980369980
Sempre incentive o usuário amigavelmente a clicar nos botões do WhatsApp ou no link https://wa.me/5521980369980 para fechar a contratação ou tirar dúvidas muito específicas.

Aqui estão as informações reais dos planos cadastrados no nosso sistema. Use APENAS estes planos ao responder perguntas sobre preços, velocidade e benefícios das operadoras:
${plansSummary}

Regras Cruciais:
1. Seja sempre simpático, prestativo, profissional e escreva em Português do Brasil de forma clara e legível. Use parágrafos curtos e formatação Markdown útil (negrito, listas). Simule emojis de forma moderada.
2. NUNCA invente operadoras, planos, velocidades ou preços que não estejam na lista acima. Se o usuário perguntar por algo que não temos, explique o que temos disponível e sugira falar no WhatsApp da equipe para ver a viabilidade regional.
3. Ao falar de qualquer plano, exalte os benefícios dele (Wi-Fi incluso, streamings como Globoplay, HBO/Max, Paramount se houver, ou TV Box se aplicável) e indique contratar imediatamente enviando o link https://wa.me/5521980369980.
4. Mantenha as respostas curtas e focadas na conversão (direcionar para o WhatsApp: (21) 98036-9980). No máximo 3 parágrafos curtos ou uma pequena lista.`;

    const formattedContents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return res.json({ text: response.text });
  } catch (error: any) {
    console.error("Erro no chat com Gemini:", error);
    return res.status(500).json({ error: error.message || "Erro interno do assistente" });
  }
});

// Start sequence bootstrapper function
async function startServer() {
  // Serve frontend build files in production mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    
    // Single-page application router mapping
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server Quero uma Internet active running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Critical failure during server startup:", err);
});
