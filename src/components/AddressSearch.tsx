import { useState, useEffect, useRef, FormEvent } from "react";
import { Search, MapPin, Loader2, ArrowRight } from "lucide-react";
import { getAddressSuggestions, AutocompleteItem } from "../services/api";

interface AddressSearchProps {
  onSearch: (selected: {
    cep?: string;
    latitude?: number;
    longitude?: number;
    label?: string;
  }) => void;
  isLoading: boolean;
}

export default function AddressSearch({ onSearch, isLoading }: AddressSearchProps) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<AutocompleteItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-masking for CEP if user types numbers only
  const formatAndSetInput = (val: string) => {
    // Check if input looks like it could be a CEP (numbers-only typing)
    const digits = val.replace(/\D/g, "");
    if (digits.length <= 8 && !isNaN(Number(digits)) && digits.length > 2) {
      if (digits.length <= 5) {
        setInputValue(digits);
      } else {
        setInputValue(`${digits.substring(0, 5)}-${digits.substring(5)}`);
      }
    } else {
      setInputValue(val);
    }
  };

  // Debounced autocomplete search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = inputValue.trim();
    if (trimmed.length < 3) {
      setSuggestions([]);
      return;
    }

    // Skip autocomplete fetch for formatted CEP inputs where the user fully entered 9 characters (e.g. "01311-200")
    const cepRegex = /^\d{5}-\d{3}$/;
    if (cepRegex.test(trimmed)) {
      setSuggestions([]);
      return;
    }

    setIsSearchingSuggestions(true);
    debounceRef.current = setTimeout(async () => {
      const items = await getAddressSuggestions(trimmed);
      setSuggestions(items);
      setIsSearchingSuggestions(false);
    }, 450);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputValue]);

  // Click outside listener to hide suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanCep = inputValue.replace(/\D/g, "");
    
    // Evaluate if valid CEP
    if (cleanCep.length === 8) {
      setShowSuggestions(false);
      onSearch({ cep: cleanCep, label: `CEP ${inputValue}` });
    } else if (inputValue.trim().length >= 4) {
      // If suggestions exist, trigger search using first suggestion to map coords
      if (suggestions.length > 0) {
        const first = suggestions[0];
        setInputValue(first.label);
        setShowSuggestions(false);
        onSearch({
          cep: first.cep,
          latitude: first.lat,
          longitude: first.lon,
          label: first.label,
        });
      } else {
        // Fallback search
        onSearch({ label: inputValue });
      }
    }
  };

  const handleSelectSuggestion = (item: AutocompleteItem) => {
    setInputValue(item.label);
    setSuggestions([]);
    setShowSuggestions(false);
    onSearch({
      cep: item.cep,
      latitude: item.lat,
      longitude: item.lon,
      label: item.label,
    });
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("A geolocalização não é suportada pelo seu navegador.");
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onSearch({
          latitude,
          longitude,
          label: `Minha Localização (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
        });
        setGeoLoading(false);
      },
      (error) => {
        console.error("Geocoding service error:", error);
        // Fallback to high-quality coordinates of Avenida Paulista in São Paulo
        onSearch({
          cep: "01311200",
          latitude: -23.5615,
          longitude: -46.6558,
          label: "Avenida Paulista (Localização simulada)",
        });
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto" id="address-search-card" ref={containerRef}>
      <form onSubmit={handleSubmit} className="relative z-30">
        <div className="flex flex-col md:flex-row items-stretch bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-slate-100 p-2 gap-2 transition-all duration-300 hover:border-primary/20">
          
          <div className="relative flex-1 flex items-center min-h-[58px] px-3">
            <MapPin className="text-primary w-6 h-6 mr-3 shrink-0" />
            <input
              type="text"
              id="zipcode-input-field"
              value={inputValue}
              onChange={(e) => {
                formatAndSetInput(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Digite seu CEP ou Endereço (ex: Av. Paulista, 1000)"
              className="w-full text-charcoal placeholder-slate-400 font-medium text-base md:text-lg focus:outline-none"
            />
            {inputValue && (
              <button
                type="button"
                onClick={() => {
                  setInputValue("");
                  setSuggestions([]);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-charcoal text-sm p-1"
                id="btn-clear-search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex flex-stretch gap-2 shrink-0">
            <button
              type="button"
              id="btn-use-mylocation"
              onClick={handleGetCurrentLocation}
              disabled={geoLoading}
              className="flex items-center justify-center p-3 rounded-xl border border-slate-200 text-slate-500 hover:text-primary hover:border-primary/20 hover:bg-slate-50 transition-all duration-200"
              title="Utilizar minha localização atual"
            >
              {geoLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              ) : (
                <MapPin className="w-5 h-5" />
              )}
              <span className="hidden lg:inline ml-2 text-sm font-semibold">Usar minha localização</span>
            </button>

            <button
              type="submit"
              id="btn-trigger-coverage-search"
              disabled={isLoading}
              className="flex-1 md:flex-initial bg-primary hover:bg-primary-dark text-white font-bold px-6 py-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transform active:scale-95 transition-all duration-150 cursor-pointer text-base"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Consultar Cobertura</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

        </div>

        {/* Dynamic Autocomplete Suggestions Dropdown Panel */}
        {showSuggestions && (inputValue.trim().length >= 3 || suggestions.length > 0) && (
          <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden text-left max-h-[320px] overflow-y-auto">
            
            {isSearchingSuggestions && (
              <div className="p-4 flex items-center justify-center text-slate-400 gap-2 font-medium text-sm">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span>Buscando endereços correspondentes...</span>
              </div>
            )}

            {!isSearchingSuggestions && suggestions.length === 0 && (
              <div className="p-4 text-slate-500 text-sm flex flex-col">
                <p className="font-semibold text-charcoal">Nenhuma sugestão encontrada para "{inputValue}"</p>
                <p className="text-xs text-slate-400 mt-1">
                  Pressione <strong className="font-bold text-primary">Consultar Cobertura</strong> para verificar diretamente pelo termo digitado.
                </p>
              </div>
            )}

            {!isSearchingSuggestions && suggestions.length > 0 && (
              <div className="py-1 divide-y divide-slate-50">
                {suggestions.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSuggestion(item)}
                    className="w-full text-left p-3 hover:bg-slate-50 flex items-start gap-3 transition-colors duration-150"
                  >
                    <MapPin className="text-slate-400 w-4 h-4 mt-1 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-charcoal text-sm truncate">{item.label}</p>
                      {item.cep && (
                        <span className="inline-block mt-1 bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[11px] font-mono">
                          CEP: {item.cep}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

          </div>
        )}
      </form>
      <div className="mt-4 flex flex-wrap justify-center gap-3 text-white/90 text-sm">
        <span className="font-medium">Buscas rápidas:</span>
        <button
          type="button"
          onClick={() => {
            setInputValue("01311200");
            onSearch({ cep: "01311200", label: "Avenida Paulista - São Paulo" });
          }}
          className="underline hover:text-white cursor-pointer opacity-90 hover:opacity-100"
        >
          São Paulo (Avenida Paulista)
        </button>
        <span className="text-white/40">•</span>
        <button
          type="button"
          onClick={() => {
            setInputValue("22060002");
            onSearch({ cep: "22060002", label: "Copacabana - Rio de Janeiro" });
          }}
          className="underline hover:text-white cursor-pointer opacity-90 hover:opacity-100"
        >
          Rio de Janeiro (Copacabana)
        </button>
        <span className="text-white/40">•</span>
        <button
          type="button"
          onClick={() => {
            setInputValue("60025130");
            onSearch({ cep: "60025130", label: "Fortaleza - Ceará" });
          }}
          className="underline hover:text-white cursor-pointer opacity-90 hover:opacity-100"
        >
          Nordeste (Ceará - Brisanet)
        </button>
      </div>
    </div>
  );
}
