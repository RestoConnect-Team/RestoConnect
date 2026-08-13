import { ReactNode } from "react";

import { Box, ChefHat, Monitor, Snowflake, Sofa } from "lucide-react";
import { ReactElement } from "react";
import { EquipmentCategory } from "@/types/categoryStatus";

export type CategoryConfig = {
  icon: ReactElement<any, any>;
  style: {
    color: string;
    borderColor: string;
    bg: string;
  };
};

export function getCategoryConfig(category: string): CategoryConfig {
  switch (category) {
    case EquipmentCategory.IT:
      return {
        icon: <Monitor className="h-4 w-4 min-h-4 min-w-4" />,
        style: {
          color: "text-[#1447E6]",
          borderColor: "border-[#BEDBFF]",
          bg: "bg-[#EFF6FF]",
        },
      };
    case EquipmentCategory.COLD:
      return {
        icon: <Snowflake className="h-4 w-4 min-h-4 min-w-4" />,
        style: {
          color: "text-[#007595]",
          borderColor: "border-[#A2F4FD]",
          bg: "bg-[#ECFEFF]",
        },
      };
    case EquipmentCategory.CATERING:
      return {
        icon: <ChefHat className="h-4 w-4 min-h-4 min-w-4" />,
        style: {
          color: "text-[#CA3500]",
          borderColor: "border-[#FFD6A8]",
          bg: "bg-[#FFF7ED]",
        },
      };
    case EquipmentCategory.OFFICE:
      return {
        icon: <Sofa className="h-4 w-4 min-h-4 min-w-4" />,
        style: {
          color: "text-[#008236]",
          borderColor: "border-[#B9F8CF]",
          bg: "bg-[#F0FDF4]",
        },
      };
    default:
      return {
        icon: <Box className="h-4 w-4 min-h-4 min-w-4" />,
        style: {
          color: "text-slate-500",
          borderColor: "border-slate-300",
          bg: "bg-slate-100",
        },
      };
  }
}

export function renderCategory(category: string): ReactNode {
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
}

export function renderCategoryIcon(category: string): ReactNode {
  const categoryConfig = getCategoryConfig(category);
  const style = Object.values(categoryConfig.style).join(" ");

  return (
    <span
      className={`flex-none h-8 w-8 flex items-center justify-center gap-2 border-2 rounded-lg ${style} font-semibold`}
    >
      {categoryConfig.icon}
    </span>
  );
}
