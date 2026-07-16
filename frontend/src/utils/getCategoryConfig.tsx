import { Box, ChefHat, Monitor, Snowflake, Sofa } from "lucide-react";
import { ReactElement } from "react";

export type CategoryConfig = {
  icon: ReactElement<any, any>;
  style: string;
};

export const getCategoryConfig = (category: string): CategoryConfig => {
  switch (category) {
    case "Informatique":
      return {
        icon: <Monitor className="h-4 w-4 min-h-4 min-w-4" />,
        style: "text-[#1447E6] border-[#BEDBFF] bg-[#EFF6FF]",
      };
    case "Réfrigéré":
      return {
        icon: <Snowflake className="h-4 w-4 min-h-4 min-w-4" />,
        style: "text-[#007595] border-[#A2F4FD] bg-[#ECFEFF]",
      };
    case "Restauration":
      return {
        icon: <ChefHat className="h-4 w-4 min-h-4 min-w-4" />,
        style: "text-[#CA3500] border-[#FFD6A8] bg-[#FFF7ED]",
      };
    case "Bureau":
      return {
        icon: <Sofa className="h-4 w-4 min-h-4 min-w-4" />,
        style: "text-[#008236] border-[#B9F8CF] bg-[#F0FDF4]",
      };
    default:
      return {
        icon: <Box className="h-4 w-4 min-h-4 min-w-4" />,
        style: "text-slate-500 border-slate-300 bg-slate-100",
      };
  }
};
