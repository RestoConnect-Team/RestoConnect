"use client";

import { Boxes, Eye } from "lucide-react";
import { useMemo, useState } from "react";

import { useFetchData } from "@/hooks/useFetchData";
import {
  fetchVehiculeList,
  VehiculeData,
  VehiculeItem,
} from "@/lib/api/vehicules_list_info";

import { PageLayout } from "@/components/layout/PageLayout";
import Loading from "@/components/loading/loading";
import PageError from "@/components/page_error/page_error";
import SearchBar, { FilterOption } from "@/components/searchbar/Searchbar";
import { FooterTable } from "@/components/table/FooterTable";
import TableActions from "@/components/table/TableActions";
import { renderVehiculeCategory } from "@/utils/vehiculeCategory";
import {
  getVehiculeStatusConfig,
  renderVehiculeStatus,
  VehiculeStatus,
} from "@/utils/vehiculeStatus";
import { useRouter } from "next/navigation";

const DEFAULT_NUMBER_PER_PAGE = 10;

type VehiculeRow = VehiculeItem & {
  source: "center" | "other";
  immatriculationLabel: string;
  statusLabel: string;
};

function getStatusLabel(status: string | null): VehiculeRow["statusLabel"] {
  if (!status) return "Non défini";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function Vehicule() {
  const router = useRouter();
  const { data, loading, error } =
    useFetchData<VehiculeData>(fetchVehiculeList);
  const vehiculesData = data ?? { vehicules_center: [], vehicules_other: [] };

  const [searchQuery, setSearchQuery] = useState<string>("");

  const [numberPerPage, setNumberPerPage] = useState<number>(
    DEFAULT_NUMBER_PER_PAGE,
  );
  const [pageIndex, setPageIndex] = useState<number>(0);

  const labels = ["Véhicule", "Immatriculation", "Type", "Statut", "Actions"];

  const [filters, setFilters] = useState<FilterOption[]>([
    {
      id: "working",
      label: VehiculeStatus.WORKING,
      isActive: false,
      filter: (value: string) => {
        return value === VehiculeStatus.WORKING;
      },
    },
    {
      id: "in maintenance",
      label: VehiculeStatus.IN_MAINTENANCE,
      isActive: false,
      filter: (value: string) => {
        return value === VehiculeStatus.IN_MAINTENANCE;
      },
    },
    {
      id: "out of order",
      label: VehiculeStatus.OUT_OF_ORDER,
      isActive: false,
      filter: (value: string) => {
        return value === VehiculeStatus.OUT_OF_ORDER;
      },
    },
  ]);

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        vehiculesData.vehicules_center.map((vehicule) => vehicule.category),
      ),
    );
  }, [vehiculesData.vehicules_center]);

  const categoriesOptions = categories.map((category) => ({
    label: category,
    value: category,
    icon: getVehiculeStatusConfig(category).icon,
    style: getVehiculeStatusConfig(category).style,
  }));

  categoriesOptions.unshift({
    label: "Toutes les catégories",
    value: "all",
    icon: <Boxes className="h-4 w-4 min-h-4 min-w-4" />,
    style: {
      color: "text-gray-400",
      borderColor: "border-gray-400",
      bg: "gray-400",
    },
  });

  const rows = useMemo<VehiculeRow[]>(() => {
    const centerRows = vehiculesData.vehicules_center.map((vehicule) => ({
      ...vehicule,
      source: "center" as const,
      immatriculationLabel: vehicule.immatriculation || "Non renseignée",
      statusLabel: getStatusLabel(vehicule.status),
    }));

    const otherRows = vehiculesData.vehicules_other.map((vehicule) => ({
      ...vehicule,
      source: "other" as const,
      immatriculationLabel: vehicule.immatriculation || "Non renseignée",
      statusLabel: getStatusLabel(vehicule.status),
    }));

    return [...centerRows, ...otherRows];
  }, [vehiculesData]);

  const filteredList = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return rows;

    return rows.filter((vehicule) => {
      return (
        vehicule.name.toLowerCase().includes(q) ||
        vehicule.immatriculationLabel.toLowerCase().includes(q) ||
        (vehicule.center_name || "").toLowerCase().includes(q) ||
        (vehicule.category || "").toLowerCase().includes(q)
      );
    });
  }, [rows, searchQuery]);

  const numberOfPages = useMemo(() => {
    return Math.ceil(filteredList.length / numberPerPage);
  }, [filteredList.length, numberPerPage]);

  const slicedList = useMemo(() => {
    const start = pageIndex * numberPerPage;

    return filteredList.slice(start, start + numberPerPage);
  }, [filteredList, pageIndex, numberPerPage]);

  return (
    <PageLayout title="Véhicules">
      <div className="p-6 h-full flex flex-col gap-4">
        {error && <PageError page_error={error} />}
        {loading && <Loading loading_sentence="Chargement des véhicules..." />}

        {!loading && !error && (
          <>
            <SearchBar
              onSearch={(e) => setSearchQuery(e)}
              placeholder="Rechercher par nom, immatriculation..."
              filters={filters}
              setFilters={setFilters}
              options={categoriesOptions}
            />

            <div className="flex flex-col overflow-hidden h-full rounded-2xl border border-slate-200 bg-white">
              <div className="overflow-x-auto h-full">
                <table className="w-full min-w-[860px] text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wide text-xs">
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
                    {slicedList.map((vehicule) => (
                      <tr
                        key={`${vehicule.source}-${vehicule.id}`}
                        className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70"
                      >
                        <td className="px-4 py-4 font-semibold text-slate-900">
                          {vehicule.name}
                          <div className="text-xs font-medium text-gray-400">
                            {vehicule.center_name}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-slate-600">
                          {renderVehiculeCategory(
                            vehicule.category,
                            "py-1 px-2",
                          )}
                        </td>
                        <td className="px-4 py-4 text-slate-600">
                          {vehicule.immatriculationLabel}
                        </td>
                        <td className="py-4 px-4">
                          {renderVehiculeStatus(vehicule.status, "py-1 px-2")}
                        </td>
                        <td className="px-4 py-4">
                          <TableActions
                            actions={[
                              {
                                icon: (className) => (
                                  <Eye className={className} />
                                ),
                                onClick: () =>
                                  router.push(`/vehicule/${vehicule.id}`),
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
                listLength={filteredList.length}
                numberPerPage={numberPerPage}
                setNumberPerPage={setNumberPerPage}
              />
            </div>

            {filteredList.length === 0 && (
              <div className="text-center py-10 text-slate-500 text-sm">
                Aucun véhicule trouvé pour cette recherche.
              </div>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
}
