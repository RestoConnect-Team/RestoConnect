import { CircleCheckBig, CircleQuestionMark, Clock } from "lucide-react";
import { InventoryStatus } from "@/types/inventoryStatus";
import { ReactNode } from "react";

interface InventoryStatusConfig {
  icon: ReactNode;
  style: string;
}

export const getStatusConfig = (status: string): InventoryStatusConfig => {
  switch (status) {
    case InventoryStatus.FINISHED:
      return {
        icon: <CircleCheckBig className="h-4 w-4 min-h-4 min-w-4" />,
        style: "text-[#2D6B31] border-[#BBD8BC] bg-[#F0F7F0]",
      };
    case InventoryStatus.ONGOING:
      return {
        icon: <Clock className="h-4 w-4 min-h-4 min-w-4" />,
        style: "text-[#7A4F00] border-[#FFAA00] bg-[#FFF8E6]",
      };
    default:
      return {
        icon: <CircleQuestionMark className="h-4 w-4 min-h-4 min-w-4" />,
        style: "text-slate-500 border-slate-300 bg-slate-100",
      };
  }
};

export function renderInventoryStatus(status: string): ReactNode {
  const categoryConfig = getStatusConfig(status);

  return (
    <td className="py-2 px-3 text-sm max-w-[175px] w-50">
      <span
        className={`py-1 px-2 flex items-center gap-2 border-2 rounded-lg ${categoryConfig.style} font-semibold`}
      >
        {categoryConfig.icon}
        {status}
      </span>
    </td>
  );
}
