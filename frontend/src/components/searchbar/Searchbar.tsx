"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

import { Select, SelectOption } from "@/components/searchbar/Select";
import { FilterOption, SearchbarFilters } from "./SearchbarFilters";

export interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
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

      {((options.length > 1 && selectValue && setSelectValue) ||
        filters.length > 0) && (
        <div className="flex gap-3">
          {options.length > 1 && selectValue && setSelectValue && (
            <Select
              selectValue={selectValue}
              setSelectValue={setSelectValue}
              options={options}
            />
          )}

          {/* Bouton filtres */}
          {filters.length > 0 && setFilters && (
            <SearchbarFilters filters={filters} setFilters={setFilters} />
          )}
        </div>
      )}
    </div>
  );
}
