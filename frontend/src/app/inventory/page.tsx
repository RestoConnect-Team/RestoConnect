"use client";

import { PageLayout } from "@/components/layout/PageLayout";
import Loading from "@/components/loading/loading";
import PageError from "@/components/page_error/page_error";
import SearchBar, { FilterOption } from "@/components/searchbar/Searchbar";
import { FooterTable } from "@/components/table/FooterTable";
import TableActions from "@/components/table/TableActions";
import { InventoryService } from "@/services/inventory.service";
import { Inventory, InventoryStatus } from "@/types/inventoryStatus";
import { renderInventoryStatus } from "@/utils/inventoryStatus";
import { Eye, PenBox, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const DEFAULT_NUMBER_PER_PAGE = 10;

export default function InventoryPage() {
  const router = useRouter();
  const [inventories, setInventories] = useState<Inventory[]>([
    {
      reference: "INV-2026-042",
      start_date: "06/02/2026",
      end_date: "2026-06-15",
      status: InventoryStatus.FINISHED,
      center: "Centre Lyon Part-Dieu",
      anomalies: 0,
      comments: 0,
    },
    {
      reference: "INV-2026-043",
      start_date: "08/09/2026",
      end_date: "2026-06-15",
      status: InventoryStatus.ONGOING,
      center: "Centre Lyon Croix-Rousse",
      anomalies: 0,
      comments: 0,
    },
  ]);
  const [loading, setLoading] = useState<boolean>(false); // TODO : change to true
  const [error, setError] = useState<Error | null>(null);
  const [mustReload, setMustReload] = useState<boolean>(true);
  const inventoryService = new InventoryService();

  const [searchQuery, setSearchQuery] = useState<string>("");

  const [numberPerPage, setNumberPerPage] = useState<number>(
    DEFAULT_NUMBER_PER_PAGE,
  );
  const [pageIndex, setPageIndex] = useState<number>(0);

  const labels = [
    "Référence",
    "Date",
    "Anomalies",
    "Commentaires",
    "Statut",
    "Actions",
  ];

  // useEffect(() => {
  //   const fetchEquipment = async () => {
  //     try {
  //       setLoading(true);

  //       const data = await inventoryService.getInventoriesList();
  //       setInventories(data);
  //     } catch (e: any) {
  //       setError(e);
  //     } finally {
  //       setLoading(false);
  //       setMustReload(false);
  //     }
  //   };

  //   if (mustReload) {
  //     fetchEquipment();
  //   }
  // }, [mustReload]);
  const [filters, setFilters] = useState<FilterOption[]>([
    {
      id: "finished",
      label: InventoryStatus.FINISHED,
      isActive: false,
      filter: (value: string) => {
        return value === InventoryStatus.FINISHED;
      },
    },
    {
      id: "on going",
      label: InventoryStatus.ONGOING,
      isActive: false,
      filter: (value: string) => {
        return value === InventoryStatus.ONGOING;
      },
    },
  ]);

  const filteredList = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    // Search
    let result = inventories;

    if (query) {
      result = result.filter((element) =>
        element.reference.toLowerCase().includes(query),
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
  }, [inventories, searchQuery, filters]);

  const numberOfPages = useMemo(() => {
    return Math.ceil(inventories.length / numberPerPage);
  }, [inventories.length, numberPerPage]);

  const slicedList = useMemo(() => {
    const start = pageIndex * numberPerPage;

    return filteredList.slice(start, start + numberPerPage);
  }, [filteredList, pageIndex, numberPerPage]);

  useEffect(() => {
    setPageIndex(0);
  }, [numberPerPage]);

  return (
    <PageLayout
      title="Inventaires"
      onClick={() => {}}
      buttonLabel={
        <>
          <Plus className="w-4 h-4" />
          Réaliser un inventaire
        </>
      }
    >
      <div className="p-6 pt-3 flex flex-col gap-3 h-full">
        {/* Error State */}
        {error && <PageError page_error={error.message} />}

        {/* Loading State */}
        {loading && (
          <Loading loading_sentence="Chargement des inventaires..." />
        )}

        {/* Empty State */}
        {!loading && inventories.length === 0 && !error && (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">Aucun inventaire trouvé</p>
            <p className="text-gray-500 text-sm mt-2">
              Appuyer sur le bouton pour démarrer un inventaire
            </p>
          </div>
        )}

        {!loading && inventories.length > 0 && !error && (
          <>
            <SearchBar
              onSearch={(e) => setSearchQuery(e)}
              filters={filters}
              setFilters={setFilters}
              placeholder="Rechercher par nom, référence..."
            />
            <div className="flex flex-col flex-1 overflow-y-auto">
              <div className="flex-1 border border-b-0 border-slate-200 rounded-t-xl bg-white overflow-x-auto">
                <table className="w-full overflow-hidden border-b border-slate-200 text-sm">
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
                    {slicedList.map((inventory: Inventory) => (
                      <tr className={`border-t-1`} key={inventory.reference}>
                        <td className="py-3 px-3 font-semibold">
                          {inventory.reference}
                          <div className="text-xs font-medium text-gray-400">
                            {inventory.center}
                          </div>
                        </td>
                        <td className="py-2 px-3">{inventory.start_date}</td>
                        <td className="py-2 px-3">{inventory.anomalies}</td>
                        <td className="py-2 px-3 w-50">{inventory.comments}</td>
                        {renderInventoryStatus(inventory.status)}
                        <td className="py-2 pl-3 pr-5">
                          <TableActions
                            actions={[
                              {
                                icon: (className) => (
                                  <Eye className={className} />
                                ),
                                onClick: () =>
                                  router.push(
                                    "/inventory/" + inventory.reference,
                                  ),
                              },
                              {
                                icon: (className) => (
                                  <PenBox className={className} />
                                ),
                                onClick: () => {},
                              },
                              {
                                icon: (className) => (
                                  <Trash2 className={className} />
                                ),
                                onClick: () => {},
                              },
                            ]}
                          />
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
                listLength={inventories.length}
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
