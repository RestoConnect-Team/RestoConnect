import { OptionStyle } from "@/components/searchbar/Select";
import {
  CircleCheckBig,
  CircleQuestionMark,
  Clock,
  TriangleAlert,
} from "lucide-react";
import { ReactElement, ReactNode } from "react";

export enum VehiculeStatus {
  WORKING = "en service",
  UNAVAILABLE = "indisponible",
  OUT_OF_ORDER = "hors service",
  IN_MAINTENANCE = "en maintenance",
}

type StatusConfig = {
  icon: ReactElement<any, any>;
  style: OptionStyle;
};

export const getVehiculeStatusConfig = (category: string): StatusConfig => {
  switch (category) {
    case VehiculeStatus.WORKING:
      return {
        icon: <CircleCheckBig className="h-4 w-4 min-h-4 min-w-4" />,
        style: {
          color: "text-[#2D6B31]",
          borderColor: "border-[#BBD8BC]",
          bg: "bg-[#F0F7F0]",
        },
      };
    case VehiculeStatus.IN_MAINTENANCE:
      return {
        icon: <Clock className="h-4 w-4 min-h-4 min-w-4" />,
        style: {
          color: "text-[#7A4F00]",
          borderColor: "border-[#FFAA00]",
          bg: "bg-[#FFF8E6]",
        },
      };
    case VehiculeStatus.OUT_OF_ORDER:
      return {
        icon: <TriangleAlert className="h-4 w-4 min-h-4 min-w-4" />,
        style: {
          color: "text-[#8B1A18]",
          borderColor: "border-[#EE443F]",
          bg: "bg-[#FDECEA]",
        },
      };
    default:
      return {
        icon: <CircleQuestionMark className="h-4 w-4 min-h-4 min-w-4" />,
        style: {
          color: "text-slate-500",
          borderColor: "border-slate-300",
          bg: "bg-slate-100",
        },
      };
  }
};

export function renderVehiculeStatus(
  status: string,
  className?: string,
): ReactNode {
  let statusConfig = getVehiculeStatusConfig(status);
  const style = Object.values(statusConfig.style).join(" ");
  return (
    <span
      className={`${className} w-50 flex items-center text-sm flex gap-2 border-2 rounded-md ${style} font-semibold`}
    >
      {statusConfig.icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
