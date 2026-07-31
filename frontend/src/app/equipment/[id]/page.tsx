"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StockStatus } from "@/app/scan/stock_status_enum";
import { EquipmentDetailHeader } from "@/components/equipment_detail/EquipmentDetailHeader";
import { EquipmentDetailInfo } from "@/components/equipment_detail/EquipmentDetailInfo";
import { EquipmentDetailQrCode } from "@/components/equipment_detail/EquipmentDetailQrCode";
import {
  EquipmentDetailHistory,
  EquipmentHistoryItem,
} from "@/components/equipment_detail/EquipmentDetailHistory";
import { EquipmentDetailStatus } from "@/components/equipment_detail/EquipmentDetailStatus";
import { PageLayout } from "@/components/layout/PageLayout";

interface EquipmentDetailData {
  id: number;
  name: string;
  reference: string;
  status: StockStatus;
  category: string;
  center_name: string;
  added_date: string;
  description: string | null;
  last_scan_date?: string;
  rating: number;
}

export default function EquipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const [equipment, setEquipment] = useState<EquipmentDetailData | null>(null);
  const [history, setHistory] = useState<EquipmentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEquipmentDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/stock/${id}`, {
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.detail || "Failed to fetch Equipment details",
          );
        }

        const data: {
          details: EquipmentDetailData;
          history: EquipmentHistoryItem[];
        } = await response.json();
        setEquipment(data.details);
        setHistory(data.history);
      } catch (err: any) {
        setError(
          err.message || "An error occurred while fetching Equipment details.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEquipmentDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement des détails du produit...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <p>Erreur: {error}</p>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Produit non trouvé.</p>
      </div>
    );
  }

  return (
    <PageLayout>
      <div className="p-6">
        <Link
          href="/equipment"
          className="flex items-center gap-1.5 text-sm text-[#cb006b] hover:text-[#a30056] mb-4 font-medium transition-colors"
        >
          <ArrowLeft size={15} />
          Retour à la liste des matériels
        </Link>

        {equipment && (
          <>
            <EquipmentDetailHeader equipment={equipment} />

            <EquipmentDetailInfo
              equipment={equipment}
              onEdit={() => console.log("Edit equipment", equipment.id)}
            />

            <EquipmentDetailStatus
              equipmentDescription={equipment.description}
              equipmentRating={equipment.rating}
              onReportProblem={() =>
                console.log(
                  "Signaler un problème pour",
                  equipment.id,
                  "from status section",
                )
              }
            />

            <EquipmentDetailQrCode equipment={equipment} />

            <EquipmentDetailHistory
              history={history}
              lastScanDate={equipment.last_scan_date}
            />
          </>
        )}
      </div>
    </PageLayout>
  );
}
