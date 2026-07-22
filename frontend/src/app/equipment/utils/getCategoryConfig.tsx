import { Box, ChefHat, Monitor, Snowflake, Sofa } from "lucide-react";
import { ReactElement } from "react";
import { EquipmentCategory } from "@/app/types/categoryStatus";

export type CategoryConfig = {
  icon: ReactElement<any, any>;
  style: {
    color: string;
    borderColor: string;
    bg: string;
  };
};

export const getCategoryConfig = (category: string): CategoryConfig => {
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
};
