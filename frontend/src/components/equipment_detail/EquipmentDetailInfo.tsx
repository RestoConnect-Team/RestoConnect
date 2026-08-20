import { StockStatus } from "@/app/scan/stock_status_enum";
import { Pencil, SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EquipmentDetailInfoProps {
  equipment: {
    reference: string;
    center_name: string;
    added_date: string;
    category: string;
  };
  onEdit: () => void;
}

export function EquipmentDetailInfo({
  equipment,
  onEdit,
}: EquipmentDetailInfoProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-[15px] font-semibold text-gray-900">
          Informations
        </h2>
        <Button variant="solid" onClick={onEdit} className="w-fit">
          <SquarePen size={16} />
          Modifier
        </Button>
      </div>
      <dl className="space-y-2.5">
        <div className="flex items-start gap-3">
          <dt className="text-sm text-gray-400 w-36 shrink-0">Référence</dt>
          <dd className="text-sm font-medium text-gray-700">
            {equipment.reference}
          </dd>
        </div>
        <div className="flex items-start gap-3">
          <dt className="text-sm text-gray-400 w-36 shrink-0">Centre</dt>
          <dd className="text-sm font-medium text-gray-700">
            {equipment.center_name}
          </dd>
        </div>
        <div className="flex items-start gap-3">
          <dt className="text-sm text-gray-400 w-36 shrink-0">Date d'ajout</dt>
          <dd className="text-sm font-medium text-gray-700">
            {new Date(equipment.added_date).toLocaleDateString()}
          </dd>
        </div>
        <div className="flex items-start gap-3">
          <dt className="text-sm text-gray-400 w-36 shrink-0">Catégorie</dt>
          <dd className="text-sm font-medium text-gray-700">
            {equipment.category}
          </dd>
        </div>
      </dl>
    </div>
  );
}
