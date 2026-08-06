"use client";

import { getCategoryConfig } from "@/app/equipment/utils/getCategoryConfig";
import { getStatusConfig } from "@/app/equipment/utils/getStatusConfig";
import { StockStatus } from "@/app/scan/stock_status_enum";
import QrCodeModal from "@/components/equipment_detail/QrCodeModal";
import { PageLayout } from "@/components/layout/PageLayout";
import Loading from "@/components/loading/loading";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import PageError from "@/components/page_error/page_error";
import SearchBar, { FilterOption } from "@/components/searchbar/Searchbar";
import { SelectOption } from "@/components/searchbar/Select";
import { FooterTable } from "@/components/table/FooterTable";
import TableActions from "@/components/table/TableActions";
import { EquipmentService } from "@/services/equipment.service";
import { EquipmentItem } from "@/types/equipment";
import { downloadQrCode } from "@/utils/downloadQrCode";
import { getQrCodeUrl } from "@/utils/getQrCodeUrl";
import { Boxes, Eye, PenBox, Plus, QrCode, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_NUMBER_PER_PAGE = 10;

export default function Equipement() {
  const router = useRouter();
  const equipmentService = new EquipmentService();
  const [equipments, setEquipements] = useState<EquipmentItem[]>([]);
  const [selectedEquipment, setSelectedEquipment] =
    useState<EquipmentItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [mustReload, setMustReload] = useState<boolean>(true);

  const [numberPerPage, setNumberPerPage] = useState<number>(
    DEFAULT_NUMBER_PER_PAGE,
  );
  const [pageIndex, setPageIndex] = useState<number>(0);

  const [searchQuery, setSearchQuery] = useState<string>("");

  const qrCodeRef = useRef<HTMLDivElement>(null);

  const labels = [
    "Nom",
    "Catégorie",
    "Référence",
    "Étiquette",
    "Statut",
    "Actions",
  ];

  const [equipmentToDelete, setEquipmentToDelete] =
    useState<EquipmentItem | null>(null);

  const [filters, setFilters] = useState<FilterOption[]>([
    {
      id: "available",
      label: StockStatus.AVAILABLE,
      isActive: false,
      filter: (value: string) => {
        return value === StockStatus.AVAILABLE;
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

  useEffect(() => {
    const loadEquipment = async () => {
      try {
        setLoading(true);

        const data = await equipmentService.fetchEquipmentList();
        setEquipements(data);
      } catch (e: any) {
        setError(e);
      } finally {
        setLoading(false);
        setMustReload(false);
      }
    };

    if (mustReload) {
      loadEquipment();
    }
  }, [mustReload]);

  const categories = useMemo(() => {
    return Array.from(
      new Set(equipments.map((equipment) => equipment.category)),
    );
  }, [equipments]);

  const categoriesOptions = categories.map((category) => ({
    label: category,
    value: category,
    icon: getCategoryConfig(category).icon,
    style: getCategoryConfig(category).style,
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

  const [selectValue, setSelectValue] = useState<SelectOption>(
    categoriesOptions[0],
  );

  const filteredList = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    // Search
    let result = equipments;

    if (query) {
      result = result.filter(
        (element) =>
          element.name.toLowerCase().includes(query) ||
          element.reference.toLowerCase().includes(query),
      );
    }

    // Category filter
    if (selectValue.value !== "all") {
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
  }, [equipments, searchQuery, selectValue.value, filters]);

  const numberOfPages = useMemo(() => {
    return Math.ceil(filteredList.length / numberPerPage);
  }, [filteredList.length, numberPerPage]);

  const slicedList = useMemo(() => {
    const start = pageIndex * numberPerPage;

    return filteredList.slice(start, start + numberPerPage);
  }, [filteredList, pageIndex, numberPerPage]);

  useEffect(() => {
    setPageIndex(0);
  }, [searchQuery, selectValue.value, filters, numberPerPage]);

  function handleDelete(equipment: EquipmentItem) {
    equipmentService.deleteEquipment(equipment.id);
    setEquipmentToDelete(null);
    setMustReload(true);
  }

  const renderLabel = (label: string, status: string): ReactNode => {
    return (
      <td className="relative max-w-[200px]">
        <div
          className={`w-[5px] h-16 ${getStatusConfig(status).rowStyle.bgColor} absolute top-0`}
        ></div>
        <div className="px-5">
          <div className="font-semibold truncate">{label}</div>
        </div>
      </td>
    );
  };

  const renderCategory = (category: string): ReactNode => {
    const categoryConfig = getCategoryConfig(category);
    const style = Object.values(categoryConfig.style).join(" ");

    return (
      <td className="py-2 px-3 text-sm max-w-[175px] w-50">
        <span
          className={`py-1 px-2 flex items-center gap-2 border-2 rounded-lg ${style} font-semibold`}
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
        {error && <PageError page_error={error.message} />}

        {/* Loading State */}
        {loading && (
          <Loading loading_sentence="Chargement des équipements..." />
        )}

        {/* Empty State */}
        {!loading && equipments.length === 0 && !error && (
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

        {!loading && equipments.length > 0 && !error && (
          <>
            <SearchBar
              onSearch={(e) => setSearchQuery(e)}
              filters={filters}
              setFilters={setFilters}
              placeholder="Rechercher par nom, référence..."
              selectValue={selectValue}
              setSelectValue={setSelectValue}
              options={categoriesOptions}
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
                          {equipment.qr_code && equipment.qr_code.length > 0 ? (
                            <QrCode
                              className="text-slate-400 cursor-pointer hover:text-slate-500 transition-colors"
                              onClick={() => setSelectedEquipment(equipment)}
                            />
                          ) : (
                            <span className="py-1 px-2 text-[#FF6900] bg-[#FFF7ED] border-1 border-[#FFD6A8] text-sm rounded-md">
                              Manquante
                            </span>
                          )}
                        </td>
                        {renderStatus(equipment.status)}
                        <td className="py-2 pl-3 pr-5">
                          <TableActions
                            actions={[
                              {
                                icon: (className) => (
                                  <Eye className={className} />
                                ),
                                onClick: () =>
                                  router.push("/equipment/" + equipment.id),
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
                                onClick: () => {
                                  setEquipmentToDelete(equipment);
                                },
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
          </>
        )}
      </div>
      {selectedEquipment && (
        <>
          <QrCodeModal
            equipment={selectedEquipment}
            isOpen={selectedEquipment !== null}
            setIsOpen={(open) => {
              if (!open) setSelectedEquipment(null);
            }}
            handleDownloadQrCode={() =>
              downloadQrCode(
                getQrCodeUrl(qrCodeRef) ?? null,
                selectedEquipment.reference,
              )
            }
          />
          <div ref={qrCodeRef}>
            <QRCodeCanvas value={selectedEquipment.reference} size={0} />
          </div>
        </>
      )}
      {equipmentToDelete && (
        <ConfirmModal
          onConfirm={() => handleDelete(equipmentToDelete)}
          onCancel={() => setEquipmentToDelete(null)}
        />
      )}
    </PageLayout>
  );
}
