import { StockStatus } from "@/app/scan/stock_status_enum";
import {
  ArrowRight,
  CircleCheckBig,
  CircleQuestionMark,
  Clock,
  TriangleAlert,
} from "lucide-react";
import { ReactElement } from "react";

export type StatusConfig = {
  icon: ReactElement<any, any>;
  style: string;
  rowStyle: {
    borderColor: string;
    bgColor: string;
  };
};

export const getStatusConfig = (category: string): StatusConfig => {
  switch (category) {
    case StockStatus.DISPONIBLE:
      return {
        icon: <CircleCheckBig className="h-4 w-4 min-h-4 min-w-4" />,
        style: "text-[#2D6B31] border-[#BBD8BC] bg-[#F0F7F0]",
        rowStyle: {
          bgColor: "bg-[#BBD8BC]",
          borderColor: "border-[#BBD8BC]",
        },
      };
    case "En transit":
      return {
        icon: <ArrowRight className="h-4 w-4 min-h-4 min-w-4" />,
        style: "text-[#1A6A82] border-[#75BDD5] bg-[#EAF5FA]",
        rowStyle: {
          bgColor: "bg-[#75BDD5]",
          borderColor: "border-[#75BDD5]",
        },
      };
    case "Maintenance":
      return {
        icon: <Clock className="h-4 w-4 min-h-4 min-w-4" />,
        style: "text-[#7A4F00] border-[#FFAA00] bg-[#FFF8E6]",
        rowStyle: {
          bgColor: "bg-[#FFAA00]",
          borderColor: "border-[#FFAA00]",
        },
      };
    case "En panne":
      return {
        icon: <TriangleAlert className="h-4 w-4 min-h-4 min-w-4" />,
        style: "text-[#8B1A18] border-[#EE443F] bg-[#FDECEA]",
        rowStyle: {
          bgColor: "bg-[#EE443F]",
          borderColor: "border-[#EE443F]",
        },
      };
    default:
      return {
        icon: <CircleQuestionMark className="h-4 w-4 min-h-4 min-w-4" />,
        style: "text-slate-500 border-slate-300 bg-slate-100",
        rowStyle: {
          bgColor: "bg-slate-300",
          borderColor: "border-slate-300",
        },
      };
  }
};
