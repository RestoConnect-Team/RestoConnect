import { MapPin } from "lucide-react";
import { StockStatus } from "@/app/scan/stock_status_enum";
import { getCategoryConfig } from "@/app/equipment/utils/getCategoryConfig";
import { getStatusConfig } from "@/app/equipment/utils/getStatusConfig";

interface EquipmentDetailHeaderProps {
  equipment: {
    id: number;
    name: string;
    category: string;
    status: StockStatus;
    center_name: string;
  };
}

export function EquipmentDetailHeader({
  equipment,
}: EquipmentDetailHeaderProps) {
  let statusConfig = getStatusConfig(equipment.status);
  let categoryConfig = getCategoryConfig(equipment.category);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 lg:p-6 mb-4">
      <h1 className="text-xl font-bold text-gray-900 leading-snug">
        {equipment.name}
      </h1>
      <div className="flex flex-wrap gap-2 mt-3">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-sm border-2 font-medium ${categoryConfig.style}`}
        >
          {categoryConfig.icon}
          {equipment.category}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-sm border-2 font-medium ${statusConfig.style}`}
        >
          {statusConfig.icon}
          {equipment.status}
        </span>
      </div>
      <div className="flex items-center gap-1.5 mt-3 text-sm text-gray-500">
        <MapPin size={13} className="text-[#cb006b]" />
        {equipment.center_name}
      </div>
    </div>
  );
}
