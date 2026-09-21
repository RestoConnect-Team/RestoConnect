import { Car, CircleQuestionMark, Truck, Van } from "lucide-react";
import { ReactElement, ReactNode } from "react";

enum VehiculeCategory {
  VAN = "utilitaire",
  TRUCK = "camion",
  CAR = "voiture",
}

type CategoryConfig = {
  icon: ReactElement<any, any>;
  style: string;
};

export const getVehiculeStatusConfig = (category?: string): CategoryConfig => {
  switch (category) {
    case VehiculeCategory.VAN:
      return {
        icon: <Van className="h-4 w-4 min-h-4 min-w-4" />,
        style: "text-[#642d6b] border-[#cb8be5] bg-[#f7f0f7]",
      };
    case VehiculeCategory.TRUCK:
      return {
        icon: <Truck className="h-4 w-4 min-h-4 min-w-4" />,
        style: "text-[#a10155] border-[#f56bb4] bg-[#f6f0f7]",
      };
    case VehiculeCategory.CAR:
      return {
        icon: <Car className="h-4 w-4 min-h-4 min-w-4" />,
        style: "text-[#1A6A82] border-[#75BDD5] bg-[#EAF5FA]",
      };
    default:
      return {
        icon: <CircleQuestionMark className="h-4 w-4 min-h-4 min-w-4" />,
        style: "text-slate-500 border-slate-300 bg-slate-100",
      };
  }
};

export function renderVehiculeCategory(
  status: string,
  className?: string,
): ReactNode {
  let statusConfig = getVehiculeStatusConfig(status);
  return (
    <span
      className={`${className} w-25 flex items-center text-sm flex gap-2 border-2 rounded-md ${statusConfig.style} font-semibold`}
    >
      {statusConfig.icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
