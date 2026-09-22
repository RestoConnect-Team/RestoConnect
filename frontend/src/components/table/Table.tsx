import { ReactNode, useEffect, useMemo, useState } from "react";
import { FooterTable } from "./FooterTable";
import SearchBar from "../searchbar/Searchbar";
import { FilterOption } from "../searchbar/SearchbarFilters";
import { SelectOption } from "../searchbar/Select";

interface TableProps {
  data: any[];
  defaultNumberPerPage: number;
  labels: string[];
  renderRow: (element: any) => ReactNode;
  searchKeys: string[];
  filters?: FilterOption[];
  setFilters?: (filters: FilterOption[]) => void;
  options?: SelectOption[];
}

export function Table({
  data,
  defaultNumberPerPage,
  labels,
  renderRow,
  searchKeys,
  filters = [],
  setFilters,
  options = [],
}: TableProps) {
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [numberPerPage, setNumberPerPage] =
    useState<number>(defaultNumberPerPage);

  const [searchQuery, setSearchQuery] = useState<string>("");

  const [selectValue, setSelectValue] = useState<SelectOption>(options[0]);

  const filteredList = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    // Search
    let result = data;

    if (query) {
      result = result.filter((element) =>
        searchKeys.some((key) => element[key].toLowerCase().includes(query)),
      );
    }

    // Category filter
    if (selectValue && selectValue.value !== "all") {
      result = result.filter(
        (element) => element.category === selectValue.value,
      );
    }

    // Status filters
    const activeFilters = filters.filter((filter) => filter.isActive);

    if (activeFilters.length > 0) {
      result = result.filter((element) =>
        activeFilters.some((filter) => filter.filter(element.status)),
      );
    }

    return result;
  }, [data, searchQuery, selectValue, filters]);

  const numberOfPages = useMemo(() => {
    return Math.ceil(data.length / numberPerPage);
  }, [data.length, numberPerPage]);

  useEffect(() => {
    setPageIndex(0);
  }, [searchQuery, selectValue?.value, filters, numberPerPage]);

  return (
    <>
      <SearchBar
        onSearch={(e) => setSearchQuery(e)}
        filters={filters}
        setFilters={setFilters}
        placeholder="Rechercher par nom, référence..."
        selectValue={selectValue}
        setSelectValue={setSelectValue}
        options={options}
      />
      <div className="flex flex-col flex-1 overflow-y-auto">
        <div className="flex-1 border border-b-0 border-slate-200 rounded-t-xl bg-white overflow-x-auto relative">
          <table className="w-full overflow-hidden border-b border-slate-200">
            <thead className="uppercase border-b-1 border-slate-200 text-slate-400 bg-[#F9FAFB]">
              <tr>
                {labels.map((label) => (
                  <th
                    className="py-2 px-3 text-[12px] text-left font-semibold"
                    key={label}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredList.map((element) => (
                <tr
                  className={`border-t-1`}
                  key={element.id || element.reference}
                >
                  {renderRow(element)}
                </tr>
              ))}
            </tbody>
          </table>
          {filteredList.length === 0 && (
            <div className="text-center text-slate-500 text-sm absolute top-[50%] left-[50%] z-99 -translate-[50%]">
              Aucun élément trouvé pour cette recherche.
            </div>
          )}
        </div>
        <FooterTable
          numberOfPages={numberOfPages}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          listLength={filteredList.length}
          numberPerPage={numberPerPage}
          setNumberPerPage={setNumberPerPage}
        />
      </div>
    </>
  );
}
