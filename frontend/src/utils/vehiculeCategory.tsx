import { OptionStyle } from "@/components/searchbar/Select";
import { Car, CircleQuestionMark, Truck, Van } from "lucide-react";
import { ReactElement, ReactNode } from "react";

enum VehiculeCategory {
  VAN = "utilitaire",
  TRUCK = "camion",
  CAR = "voiture",
}

type CategoryConfig = {
  icon: ReactElement<any, any>;
  style: OptionStyle;
};

export const getVehiculeCategoryConfig = (
  category?: string,
): CategoryConfig => {
  switch (category) {
    case VehiculeCategory.VAN:
      return {
        icon: <Van className="h-4 w-4 min-h-4 min-w-4" />,
        style: {
          color: "text-[#642d6b]",
          borderColor: "border-[#cb8be5]",
          bg: "bg-[#f7f0f7]",
        },
      };
    case VehiculeCategory.TRUCK:
      return {
        icon: <Truck className="h-4 w-4 min-h-4 min-w-4" />,
        style: {
          color: "text-[#a10155]",
          borderColor: "border-[#f56bb4]",
          bg: "bg-[#f6f0f7]",
        },
      };
    case VehiculeCategory.CAR:
      return {
        icon: <Car className="h-4 w-4 min-h-4 min-w-4" />,
        style: {
          color: "text-[#1A6A82]",
          borderColor: "border-[#75BDD5]",
          bg: "bg-[#EAF5FA]",
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

export function renderVehiculeCategory(
  status: string,
  className?: string,
): ReactNode {
  let categoryConfig = getVehiculeCategoryConfig(status);
  const style = Object.values(categoryConfig.style).join(" ");
  return (
    <span
      className={`${className} w-25 flex items-center text-sm flex gap-2 border-2 rounded-md ${style} font-semibold`}
    >
      {categoryConfig.icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
