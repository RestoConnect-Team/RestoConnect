import { Monitor, CircleCheckBig, MapPin, TriangleAlert } from "lucide-react";
import { StockStatus } from "@/app/scan/stock_status_enum";

interface ProductDetailHeaderProps {
  product: {
    id: number;
    name: string;
    category: string;
    status: StockStatus;
    center_name: string;
  };
}

function getStatusBadge(status: StockStatus) {
  switch (status) {
    case StockStatus.DISPONIBLE:
      return {
        className:
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-sm font-medium border bg-[#F0F7F0] border-[#BBD8BC] text-[#2D6B31]",
        Icon: CircleCheckBig,
        label: "Disponible",
      };
    case StockStatus.LOST:
      return {
        className:
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-sm font-medium border bg-red-50 text-red-700 border-red-200",
        Icon: TriangleAlert,
        label: "Perdu",
      };
    case StockStatus.ERROR:
    default:
      return {
        className:
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-sm font-medium border bg-gray-50 text-gray-700 border-gray-200",
        Icon: Monitor,
        label: "Inconnu",
      };
  }
}

export function ProductDetailHeader({ product }: ProductDetailHeaderProps) {
  const statusBadge = getStatusBadge(product.status);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 lg:p-6 mb-4">
      <h1 className="text-xl font-bold text-gray-900 leading-snug">
        {product.name}
      </h1>
      <div className="flex flex-wrap gap-2 mt-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-sm font-medium border bg-blue-50 text-blue-700 border-blue-200">
          <Monitor size={13} />
          {product.category}
        </span>
        <span className={statusBadge.className}>
          <statusBadge.Icon size={13} />
          {statusBadge.label}
        </span>
      </div>
      <div className="flex items-center gap-1.5 mt-3 text-sm text-gray-500">
        <MapPin size={13} className="text-[#cb006b]" />
        {product.center_name}
      </div>
    </div>
  );
}
