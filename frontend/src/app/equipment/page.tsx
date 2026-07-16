"use client";

import { useFetchData } from "@/hooks/useFetchData";
import {
  fetchEquipementList,
  EquipmentItem,
} from "@/lib/api/equipements_list_info";

import SearchBar from "@/components/searchbar/Searchbar";
import PageError from "@/components/page_error/page_error";
import Loading from "@/components/loading/loading";
import { PageLayout } from "@/components/layout/PageLayout";
import { Eye, PenBox, QrCode, Trash2 } from "lucide-react";
import { ReactNode } from "react";
import { getCategoryConfig } from "@/utils/getCategoryConfig";
import { getStatusConfig } from "@/utils/getStatusConfig";

export default function Equipement() {
  const { data, loading, error } =
    useFetchData<EquipmentItem[]>(fetchEquipementList);

  // const equipementList = data ?? [];
  //! REMOVE
  const equipmentList = [
    {
      category: "Informatique",
      id: 1,
      name: "Pc",
      qr_code: "qr_code",
      reference: "REF001_c1",
      status: "Perdu",
    },
    {
      category: "Réfrigéré",
      id: 2,
      name: "Frigo test test test test test test test test test test test",
      qr_code: "",
      reference: "REF002_c1",
      status: "Disponible",
    },
    {
      category: "Bureau",
      id: 3,
      name: "Chaise",
      qr_code: "",
      reference: "REF003_c1",
      status: "En transit",
    },
    {
      category: "Restauration",
      id: 4,
      name: "Table",
      qr_code: "",
      reference: "REF004_c1",
      status: "Maintenance",
    },
    {
      category: "null",
      id: 5,
      name: "Test",
      qr_code: "",
      reference: "REF005_c1",
      status: "En panne",
    },
  ];

  const labels = [
    "Nom",
    "Catégorie",
    "Référence",
    "Étiquette",
    "Statut",
    "Actions",
  ];

  const renderStatus = (status: string): ReactNode => {
    let statusConfig = getStatusConfig(status);
    return (
      <td className="py-2 px-3 max-w-[175px] w-50">
        <span
          className={`py-1 px-2 flex items-center text-sm flex gap-2 border-2 rounded-lg ${statusConfig.style} font-semibold`}
        >
          {statusConfig.icon}
          {status}
        </span>
      </td>
    );
  };

  const renderLabel = (label: string, status: string): ReactNode => {
    return (
      <td className="relative max-w-[200px]">
        <div
          className={`w-[5px] h-16 ${getStatusConfig(status).rowStyle.bgColor} absolute top-0`}
        ></div>
        <div className="px-5">
          <div className="font-semibold truncate">{label}</div>
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

  return (
    <PageLayout title="Matériels" onClick={() => {}} buttonLabel="Ajouter">
      <div className="p-6">
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

        <SearchBar
          onSearch={() => {}}
          filters={[{ id: "all", label: "Tous" }]}
        />

        {!loading && equipmentList.length > 0 && !error && (
          <div className="flex flex-col overflow-x-auto">
            <table className="flex-1 border border-slate-200 rounded-xl bg-white overflow-hidden">
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
                {equipmentList.map((equipment) => (
                  <tr
                    className={`border-t-1 ${getStatusConfig(equipment.status).rowStyle.borderColor}`}
                    key={equipment.reference}
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
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2 ">
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
        )}
      </div>
    </PageLayout>
  );
}
