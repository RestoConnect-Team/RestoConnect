"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

import { Select, SelectOption } from "@/components/searchbar/Select";

export interface FilterOption {
  id: string;
  label: string;
  filter: (value: string) => boolean;
  isActive?: boolean;
}

export interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string, activeFilters: Record<string, any>) => void;
  filters?: FilterOption[];
  setFilters?: (filters: FilterOption[]) => void;
  selectValue?: SelectOption;
  setSelectValue?: (v: SelectOption) => void;
  options?: SelectOption[];
}

export default function SearchBar({
  placeholder = "Rechercher...",
  filters = [],
  setFilters,
  onSearch,
  selectValue,
  setSelectValue,
  options = [],
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});

  const [noFilterOption, setNoFilterOption] = useState<FilterOption>({
    id: "0",
    label: "Tous",
    filter: () => {
      return true;
    },
    isActive: true,
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query, activeFilters);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="w-full relative flex">
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
      </div>

      <div className="flex gap-5">
        {options.length > 1 && selectValue && setSelectValue && (
          <Select
            selectValue={selectValue}
            setSelectValue={setSelectValue}
            options={options}
          />
        )}

        {/* Bouton filtres */}
        {filters.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={() => {
                const areFiltersActive = filters.some((f) => f.isActive);
                if (areFiltersActive && setFilters) {
                  setFilters(
                    filters.map((f) => ({
                      ...f,
                      isActive: false,
                    })),
                  );
                }
                setNoFilterOption({
                  ...noFilterOption,
                  isActive: true,
                });
              }}
              className={`cursor-pointer py-2 px-4 border rounded-full w-fit flex items-center gap-1 
            text-sm font-medium transition-colors 
            ${noFilterOption.isActive ? "bg-[#e6007e] text-white hover:bg-[#e6007e]/80" : "bg-white border-slate-200 hover:text-gray-900"}`}
            >
              Tous
            </button>

            {filters.map((filter) => (
              <button
                onClick={() => {
                  const filtersTemp = filters.map((f) => ({
                    ...f,
                    isActive: f.id === filter.id ? !f.isActive : f.isActive,
                  }));
                  const areFiltersActive = filtersTemp.some((f) => f.isActive);
                  setFilters?.(filtersTemp);
                  setNoFilterOption({
                    ...noFilterOption,
                    isActive: !areFiltersActive,
                  });
                }}
                className={`cursor-pointer py-2 px-4 border rounded-full w-fit flex items-center gap-1 
            text-sm font-medium transition-colors 
            ${filter.isActive ? "bg-[#e6007e] text-white hover:bg-[#e6007e]/80" : "bg-white border-slate-200 hover:text-gray-900"}`}
                key={filter.id}
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
