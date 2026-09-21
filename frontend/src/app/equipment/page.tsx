"use client";

import { StockStatus } from "@/app/scan/stock_status_enum";
import QrCodeModal from "@/components/equipment_detail/QrCodeModal";
import { PageLayout } from "@/components/layout/PageLayout";
import Loading from "@/components/loading/loading";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import PageError from "@/components/page_error/page_error";
import { FilterOption } from "@/components/searchbar/SearchbarFilters";
import { Table } from "@/components/table/Table";
import TableActions from "@/components/table/TableActions";
import { EquipmentService } from "@/services/equipment.service";
import { EquipmentItem } from "@/types/equipment";
import { downloadQrCode } from "@/utils/downloadQrCode";
import { getCategoryConfig, renderCategory } from "@/utils/equipmentCategory";
import { renderStatus } from "@/utils/equipmentStatus";
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
    const fetchEquipment = async () => {
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
      fetchEquipment();
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

  function handleDelete(equipment: EquipmentItem) {
    equipmentService.deleteEquipment(equipment.id);
    setEquipmentToDelete(null);
    setMustReload(true);
  }

  const renderRow = (equipment: EquipmentItem): ReactNode => {
    return (
      <>
        <td className="relative max-w-[200px]">
          <div className="px-4 font-semibold truncate">{equipment.name}</div>
        </td>
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
        <td className="py-2 px-3 w-50">
          {renderStatus(equipment.status, "py-1 px-2")}
        </td>
        <td className="py-2 pl-3 pr-5">
          <TableActions
            actions={[
              {
                icon: (className) => <Eye className={className} />,
                onClick: () => {
                  router.push("/equipment/" + equipment.id);
                },
              },
              {
                icon: (className) => <PenBox className={className} />,
                onClick: () => {},
              },
              {
                icon: (className) => <Trash2 className={className} />,
                onClick: () => {
                  setEquipmentToDelete(equipment);
                },
              },
            ]}
          />
        </td>
      </>
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
          <Table
            data={equipments}
            defaultNumberPerPage={DEFAULT_NUMBER_PER_PAGE}
            labels={labels}
            renderRow={renderRow}
            filters={filters}
            setFilters={setFilters}
            options={categoriesOptions}
          />
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
