"use client";

import { useRef, useEffect, useState } from "react";
import { Search, X, ChevronDown } from "lucide-react";

export interface FilterOption {
  id: string;
  label: string;
  type: "checkbox" | "select";
  options?: { value: string; label: string }[];
}

export interface SearchBarProps {
  placeholder?: string;
  filters?: FilterOption[];
  onSearch: (query: string, activeFilters: Record<string, any>) => void;
}

export default function SearchBar({
  placeholder = "Rechercher...",
  filters = [],
  onSearch,
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query, activeFilters);
  };

  const handleFilterToggle = (filterId: string, optionValue: string) => {
    const filterType = filters.find((f) => f.id === filterId)?.type;
    let newFilters = { ...activeFilters };

    if (filterType === "checkbox") {
      const current = Array.isArray(newFilters[filterId])
        ? newFilters[filterId]
        : [];
      if (current.includes(optionValue)) {
        newFilters[filterId] = current.filter((v: string) => v !== optionValue);
        if (newFilters[filterId].length === 0) delete newFilters[filterId];
      } else {
        newFilters[filterId] = [...current, optionValue];
      }
    } else {
      if (newFilters[filterId] === optionValue) {
        delete newFilters[filterId];
      } else {
        newFilters[filterId] = optionValue;
      }
    }

    setActiveFilters(newFilters);
    onSearch(searchQuery, newFilters);
  };

  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  // Compter le nombre total de filtres sélectionnés (inclus les arrays)
  const activeFiltersCount = Object.values(activeFilters).reduce(
    (count, value) => {
      if (Array.isArray(value)) return count + value.length;
      return value ? count + 1 : count;
    },
    0,
  );

  // Fermer le menu au clic dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowFilters(false);
      }
    };

    if (showFilters) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showFilters]);

  return (
    <div className="w-full relative flex ">
      {/* Barre de recherche principale */}
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
      <input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[rgb(230,0,126)]/50"
      />
      {searchQuery && (
        <button
          onClick={() => handleSearch("")}
          className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>
      )}

      {/* Bouton filtres */}
      {filters.length > 0 && (
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`ml-2 pl-2 border-l border-gray-300 flex items-center gap-1 text-sm font-medium transition-colors ${
            hasActiveFilters ? "text-blue-600" : "text-gray-600"
          } hover:text-gray-900`}
        >
          Filtres
          {hasActiveFilters && (
            <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {activeFiltersCount}
            </span>
          )}
          <ChevronDown
            size={16}
            className={`transition-transform ${showFilters ? "rotate-180" : ""}`}
          />
        </button>
      )}

      {/* Menu déroulant des filtres */}
      {showFilters && filters.length > 0 && (
        <>
          {/* Backdrop transparent */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setShowFilters(false)}
          />

          {/* Dropdown menu */}
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 mt-2 bg-white rounded-lg border border-gray-300 shadow-xl z-40 p-4 min-w-96 max-w-2xl"
          >
            <div className="space-y-4">
              {filters.map((filter) => (
                <div key={filter.id} className="flex flex-col gap-3">
                  <h3 className="font-semibold text-sm text-gray-800">
                    {filter.label}
                  </h3>

                  {filter.options && (
                    <div className="flex flex-wrap gap-2">
                      {filter.options.map((option) => {
                        const isActive =
                          filter.type === "checkbox"
                            ? Array.isArray(activeFilters[filter.id]) &&
                              activeFilters[filter.id].includes(option.value)
                            : activeFilters[filter.id] === option.value;

                        return (
                          <button
                            key={option.value}
                            onClick={() =>
                              handleFilterToggle(filter.id, option.value)
                            }
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                              isActive
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
