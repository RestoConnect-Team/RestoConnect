"use client";

import { useFetchData } from "@/hooks/useFetchData";
import {
  EquipmentItem,
  fetchEquipmentList,
} from "@/lib/api/equipements_list_info";
import SearchBar, { FilterOption } from "@/components/searchbar/Searchbar";
import PageError from "@/components/page_error/page_error";
import Loading from "@/components/loading/loading";
import { PageLayout } from "@/components/layout/PageLayout";
import { Eye, PenBox, Plus, QrCode, Trash2 } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { getCategoryConfig } from "@/app/equipment/utils/getCategoryConfig";
import { getStatusConfig } from "@/app/equipment/utils/getStatusConfig";
import { FooterTable } from "@/components/table/FooterTable";
import { StockStatus } from "@/app/scan/stock_status_enum";

const DEFAULT_NUMBER_PER_PAGE = 10;

export default function Equipement() {
  const { data, loading, error } =
    useFetchData<EquipmentItem[]>(fetchEquipmentList);

  const equipmentList = data ?? [];

  const [numberPerPage, setNumberPerPage] = useState<number>(
    DEFAULT_NUMBER_PER_PAGE,
  );
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [numberOfPages, setNumberOfPages] = useState<number>(
    Math.ceil(equipmentList.length / numberPerPage),
  );

  const [searchedList, setSearchedList] =
    useState<EquipmentItem[]>(equipmentList);
  const [filteredList, setFilteredList] =
    useState<EquipmentItem[]>(searchedList);
  const [slicedList, setSlicedList] = useState<EquipmentItem[]>(
    filteredList.slice(0, numberPerPage),
  );

  const [searchQuery, setSearchQuery] = useState<string>("");

  const labels = [
    "Nom",
    "Catégorie",
    "Référence",
    "Étiquette",
    "Statut",
    "Actions",
  ];

  const [filters, setFilters] = useState<FilterOption[]>([
    {
      id: "available",
      label: StockStatus.DISPONIBLE,
      isActive: false,
      filter: (value: string) => {
        return value === StockStatus.DISPONIBLE;
      },
    },
    {
      id: "lost",
      label: StockStatus.LOST,
      isActive: false,
      filter: (value: string) => {
        return value === StockStatus.LOST;
      },
    },
  ]);

  // Apply search
  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();

    if (query.length > 0) {
      // TODO add center name
      const searched = equipmentList.filter((element) => {
        return (
          element.name.toLowerCase().includes(query) ||
          element.reference.toLowerCase().includes(query) ||
          element.category.toLowerCase().includes(query)
        );
      });

      setSearchedList(searched);
    } else {
      setSearchedList(equipmentList);
    }
  }, [searchQuery, equipmentList]);

  // Apply filters
  useEffect(() => {
    let filteredElements: EquipmentItem[] = [];
    filters.map((filter) => {
      if (filter.isActive) {
        filteredElements = filteredElements.concat(
          searchedList.filter((element) => filter.filter(element.status)),
        );
      }
    });

    if (filteredElements.length > 0) {
      setFilteredList(filteredElements);
    } else if (filters.some((f) => f.isActive)) {
      setFilteredList([]);
    } else {
      setFilteredList(searchedList);
    }
  }, [filters, searchedList]);

  // Slice list into pages
  useEffect(() => {
    const newSlicedList = filteredList.slice(
      pageIndex * numberPerPage,
      pageIndex * numberPerPage + numberPerPage,
    );
    setSlicedList(newSlicedList);
  }, [pageIndex, filteredList, numberPerPage]);

  // Reset page index to 0 when changes are made
  useEffect(() => {
    setPageIndex(0);
    setNumberOfPages(Math.ceil(filteredList.length / numberPerPage));
  }, [filteredList, numberPerPage]);

  const renderLabel = (label: string, status: string): ReactNode => {
    return (
      <td className="relative max-w-[200px]">
        <div
          className={`w-[5px] h-16 ${getStatusConfig(status).rowStyle.bgColor} absolute top-0`}
        ></div>
        <div className="px-5">
          <div className="font-semibold truncate">{label}</div>
          {/* // TODO add center name */}
          <div className="text-[13px] text-slate-400 truncate">
            Centre hardcodé
          </div>
        </div>
      </td>
    );
  };

  const renderCategory = (category: string): ReactNode => {
    let categoryConfig = getCategoryConfig(category);

    return (
      <td className="py-2 px-3 text-sm max-w-[175px] w-50">
        <span
          className={`py-1 px-2 flex items-center gap-2 border-2 rounded-lg ${categoryConfig.style} font-semibold`}
        >
          {categoryConfig.icon}
          {category}
        </span>
      </td>
    );
  };

  const renderStatus = (status: string): ReactNode => {
    let statusConfig = getStatusConfig(status);
    return (
      <td className="py-2 px-3 w-50">
        <span
          className={`py-1 px-2 flex items-center text-sm flex gap-2 border-2 rounded-lg ${statusConfig.style} font-semibold`}
        >
          {statusConfig.icon}
          {status}
        </span>
      </td>
    );
  };

  return (
    <PageLayout
      title="Matériels"
      onClick={() => {}}
      buttonLabel={
        <>
          <Plus />
          Ajouter
        </>
      }
    >
      <div className="p-6 pt-3 flex flex-col gap-3 h-full">
        {/* Error State */}
        {error && <PageError page_error={error} />}

        {/* Loading State */}
        {loading && (
          <Loading loading_sentence="Chargement des équipements..." />
        )}

        {/* Empty State */}
        {!loading && equipmentList.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <span className="text-3xl">📦</span>
            </div>
            <p className="text-gray-600 text-lg">Aucun équipement trouvé</p>
            <p className="text-gray-500 text-sm mt-2">
              Commencez par ajouter des équipements à l'inventaire
            </p>
          </div>
        )}

        {!loading && equipmentList.length > 0 && !error && (
          <>
            <SearchBar
              onSearch={(e) => setSearchQuery(e)}
              filters={filters}
              setFilters={setFilters}
              placeholder="Rechercher par nom, référence..."
            />
            <div className="flex flex-col flex-1 overflow-y-auto">
              <div className="flex-1 border border-b-0 border-slate-200 rounded-t-xl bg-white overflow-x-auto">
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
                    {slicedList.map((equipment) => (
                      <tr
                        className={`border-t-1 ${getStatusConfig(equipment.status).rowStyle.borderColor}`}
                        key={equipment.id}
                      >
                        {renderLabel(equipment.name, equipment.status)}
                        {renderCategory(equipment.category)}
                        <td className="py-5 px-3 text-slate-500 font-mono">
                          {equipment.reference}
                        </td>
                        <td className="py-2 px-3">
                          {equipment.qr_code.length > 0 ? (
                            <QrCode className="text-slate-400" />
                          ) : (
                            <span className="py-1 px-2 text-[#FF6900] bg-[#FFF7ED] border-1 border-[#FFD6A8] text-sm rounded-md">
                              Manquante
                            </span>
                          )}
                        </td>
                        {renderStatus(equipment.status)}
                        {/* //TODO add actions */}
                        <td className="py-2 pl-3 pr-5">
                          <div className="flex items-center justify-between gap-3">
                            <button className="cursor-pointer hover:text-slate-500 text-slate-400 transition-colors">
                              <Eye className="h-5 w-5 min-h-5 min-w-5" />
                            </button>
                            <button className="cursor-pointer hover:text-slate-500 text-slate-400 transition-colors">
                              <PenBox className="h-5 w-5 min-h-5 min-w-5" />
                            </button>
                            <button className="cursor-pointer hover:text-slate-500 text-slate-400 transition-colors">
                              <Trash2 className="h-5 w-5 min-h-5 min-w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
        )}
      </div>
    </PageLayout>
  );
}
