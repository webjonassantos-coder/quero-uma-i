export interface Provider {
  id: string;
  nome: string;
  logo: string;
  slug: string;
  site: string;
  telefone: string;
  whatsapp: string;
  regional?: boolean;
}

export interface Plan {
  id: string;
  provider_id: string;
  nome: string;
  velocidade: number; // in Mbps
  download: number; // in Mbps
  upload: number; // in Mbps
  preco: number; // monthly cost
  instalacao: number; // installation fee
  wifi: string; // WiFi details
  streaming: string[]; // bundled streamings/services
  fidelidade: boolean;
  tecnologia: 'Fibra' | 'Cabo COAX' | 'Satélite' | '4G/5G';
  relevancia: number; // custom calculated score (value-for-money, speed, rating)
  combo_preco_single?: number;
  combo_preco_multi?: number;
  tv_box_disponivel?: boolean;
}

export interface Coverage {
  id: string;
  provider_id: string;
  cidade: string;
  bairro: string;
  cep_inicial?: string;
  cep_final?: string;
  latitude?: number;
  longitude?: number;
}

export interface SearchResult {
  cep: string;
  cidade: string;
  estado: string;
  bairro?: string;
  rua?: string;
  latitude: number;
  longitude: number;
  providers: Provider[];
  plans: Plan[];
  coverage: Coverage[];
}

export interface FilterState {
  sortOption: 'relevance' | 'cheapest' | 'fastest' | 'valueRatio';
  tecnologia: ('Fibra' | 'Cabo COAX' | 'Satélite' | '4G/5G')[];
  maxPreco: number;
  minVelocidade: number;
  semFidelidade: boolean;
  streamingIncluso: boolean;
  instalacaoGratis: boolean;
  wifiGratis: boolean;
  providerIds: string[];
}
