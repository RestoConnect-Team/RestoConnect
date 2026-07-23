"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CheckCircle2, CircleAlert, Eye } from "lucide-react";

import { useFetchData } from "@/hooks/useFetchData";
import {
  fetchVehiculeList,
  VehiculeData,
  VehiculeItem,
} from "@/lib/api/vehicules_list_info";

import PageError from "@/components/page_error/page_error";
import Loading from "@/components/loading/loading";
import { PageLayout } from "@/components/layout/PageLayout";
import SearchBar from "@/components/searchbar/Searchbar";
import { FooterTable } from "@/components/table/FooterTable";

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

function getStatusBadge(status: string | null) {
  if (status === "en service") {
    return {
      className:
        "inline-flex items-center gap-1.5 rounded-md border border-green-200 bg-green-50 px-3 py-1 text-green-700 font-medium",
      Icon: CheckCircle2,
    };
  }

  return {
    className:
      "inline-flex items-center gap-1.5 rounded-md border border-amber-300 bg-amber-50 px-3 py-1 text-amber-800 font-medium",
    Icon: CircleAlert,
  };
}

export default function Vehicule() {
  const { data, loading, error } =
    useFetchData<VehiculeData>(fetchVehiculeList);
  const vehiculesData = data ?? { vehicules_center: [], vehicules_other: [] };

  const [searchQuery, setSearchQuery] = useState<string>("");

  const [numberPerPage, setNumberPerPage] = useState<number>(
    DEFAULT_NUMBER_PER_PAGE,
  );
  const [pageIndex, setPageIndex] = useState<number>(0);

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
      <div className="p-6 flex flex-col gap-4">
        {error && <PageError page_error={error} />}
        {loading && <Loading loading_sentence="Chargement des véhicules..." />}

        {!loading && !error && (
          <>
            <SearchBar
              onSearch={(e) => setSearchQuery(e)}
              placeholder="Rechercher par nom, immatriculation..."
            />

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wide text-xs">
                      <th className="text-left px-4 py-3 font-semibold">
                        Véhicule
                      </th>
                      <th className="text-left px-4 py-3 font-semibold">
                        Immatriculation
                      </th>
                      <th className="text-left px-4 py-3 font-semibold">
                        Type
                      </th>
                      <th className="text-left px-4 py-3 font-semibold">
                        Centre
                      </th>
                      <th className="text-left px-4 py-3 font-semibold">
                        Statut
                      </th>
                      <th className="text-left px-4 py-3 font-semibold">
                        Actions
                      </th>
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
                        </td>
                        <td className="px-4 py-4 text-slate-600">
                          {vehicule.immatriculationLabel}
                        </td>
                        <td className="px-4 py-4 text-slate-600">
                          {vehicule.category || "Non défini"}
                        </td>
                        <td
                          className="px-4 py-4 text-slate-600 max-w-[180px] truncate"
                          title={vehicule.center_name || "Non assigné"}
                        >
                          {vehicule.center_name || "Non assigné"}
                        </td>
                        <td className="px-4 py-4">
                          {(() => {
                            const badge = getStatusBadge(vehicule.status);
                            const Icon = badge.Icon;
                            return (
                              <span className={badge.className}>
                                <Icon size={14} />
                                {vehicule.statusLabel}
                              </span>
                            );
                          })()}
                        </td>
                        <td className="px-4 py-4">
                          <Link
                            href={`/vehicule/${vehicule.id}`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                            aria-label={`Voir ${vehicule.name}`}
                          >
                            <Eye size={16} />
                          </Link>
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
