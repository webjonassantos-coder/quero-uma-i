import { SearchResult } from "../types";

export interface AutocompleteItem {
  label: string;
  cep: string;
  cidade: string;
  estado: string;
  bairro?: string;
  rua?: string;
  lat: number;
  lon: number;
}

/**
 * Service handler for backend "Quero uma Internet" APIs
 */
export async function getAddressSuggestions(query: string): Promise<AutocompleteItem[]> {
  if (!query || query.trim().length < 3) return [];
  try {
    const res = await fetch(`/api/autocomplete?q=${encodeURIComponent(query)}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.error("Error fetching address autocomplete recommendations:", error);
  }
  return [];
}

export async function searchBroadbandOffers(params: {
  cep?: string;
  latitude?: number;
  longitude?: number;
}): Promise<SearchResult | null> {
  try {
    const url = new URL("/api/search", window.location.origin);
    if (params.cep) url.searchParams.append("cep", params.cep);
    if (params.latitude) url.searchParams.append("latitude", params.latitude.toString());
    if (params.longitude) url.searchParams.append("longitude", params.longitude.toString());

    const res = await fetch(url.toString());
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.error("Error fetching available broadband offers:", error);
  }
  return null;
}
