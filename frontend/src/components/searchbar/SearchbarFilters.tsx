import { capitalizeString } from "@/utils/capitalizeString";
import { useState } from "react";

export interface FilterOption {
  id: string;
  label: string;
  filter: (value: string) => boolean;
  isActive?: boolean;
}

interface SearchbarFiltersProps {
  filters: FilterOption[];
  setFilters: (filters: FilterOption[]) => void;
}

export function SearchbarFilters({
  filters,
  setFilters,
}: SearchbarFiltersProps) {
  const [noFilterOption, setNoFilterOption] = useState<FilterOption>({
    id: "0",
    label: "Tous",
    filter: () => {
      return true;
    },
    isActive: true,
  });

  return (
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
          ${noFilterOption.isActive ? "bg-[#e6007e] text-white hover:bg-[#e6007e]/80" : "bg-white border-slate-200 hover:text-gray-900"}
        `}
      >
        {noFilterOption.label}
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
            ${filter.isActive ? "bg-[#e6007e] text-white hover:bg-[#e6007e]/80" : "bg-white border-slate-200 hover:text-gray-900"}
          `}
          key={filter.id}
        >
          {capitalizeString(filter.label)}
        </button>
      ))}
    </div>
  );
}
