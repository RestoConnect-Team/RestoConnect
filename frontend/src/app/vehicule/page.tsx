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
import TableActions from "@/components/table/TableActions";
import { renderVehiculeCategory } from "@/utils/vehiculeCategory";
import { renderVehiculeStatus, VehiculeStatus } from "@/utils/vehiculeStatus";
import { getVehiculeCategoryConfig } from "@/utils/vehiculeCategory";
import { useRouter } from "next/navigation";
import { FilterOption } from "@/components/searchbar/SearchbarFilters";
import { Table } from "@/components/table/Table";
import { capitalizeString } from "@/utils/capitalizeString";

const DEFAULT_NUMBER_PER_PAGE = 10;

export default function Vehicule() {
  const router = useRouter();
  const { data, loading, error } =
    useFetchData<VehiculeData>(fetchVehiculeList);
  const vehicules = data?.vehicules_center ?? [];

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
    return Array.from(new Set(vehicules.map((vehicule) => vehicule.category)));
  }, [vehicules]);

  const typesOptions = categories.map((category) => ({
    label: capitalizeString(category),
    value: category,
    icon: getVehiculeCategoryConfig(category).icon,
    style: getVehiculeCategoryConfig(category).style,
  }));

  typesOptions.unshift({
    label: "Tous les types",
    value: "all",
    icon: <Boxes className="h-4 w-4 min-h-4 min-w-4" />,
    style: {
      color: "text-gray-400",
      borderColor: "border-gray-400",
      bg: "gray-400",
    },
  });

  const renderRow = (vehicule: VehiculeItem) => {
    return (
      <>
        <td className="px-4 py-4 font-semibold text-slate-900">
          {vehicule.name}
          <div className="text-xs font-medium text-gray-400">
            {vehicule.center_name}
          </div>
        </td>
        <td className="px-4 py-4 text-slate-600">
          {renderVehiculeCategory(vehicule.category, "py-1 px-2")}
        </td>
        <td className="px-4 py-4 text-slate-600">{vehicule.immatriculation}</td>
        <td className="py-4 px-4">
          {renderVehiculeStatus(vehicule.status, "py-1 px-2")}
        </td>
        <td className="px-4 py-4">
          <TableActions
            actions={[
              {
                icon: (className) => <Eye className={className} />,
                onClick: () => router.push(`/vehicule/${vehicule.id}`),
              },
            ]}
          />
        </td>
      </>
    );
  };

  return (
    <PageLayout title="Véhicules">
      <div className="p-6 h-full flex flex-col gap-4">
        {error && <PageError page_error={error} />}
        {loading && <Loading loading_sentence="Chargement des véhicules..." />}

        {!loading && !error && (
          <>
            <Table
              data={vehicules}
              defaultNumberPerPage={DEFAULT_NUMBER_PER_PAGE}
              labels={labels}
              renderRow={renderRow}
              searchKeys={["name", "immatriculation"]}
              filters={filters}
              setFilters={setFilters}
              options={typesOptions}
            />

            {/* {filteredList.length === 0 && (
              <div className="text-center py-10 text-slate-500 text-sm">
                Aucun véhicule trouvé pour cette recherche.
              </div>
            )} */}
          </>
        )}
      </div>
    </PageLayout>
  );
}
