import {
  Monitor,
  CircleCheckBig,
  MapPin,
  Eye,
  CircleAlert,
  Send,
} from "lucide-react";
import { StockStatus } from "@/app/scan/stock_status_enum";
import { Button } from "@/components/ui/button";

export interface ProductInfo {
  id: number;
  name: string;
  reference: string;
  status: StockStatus;
  center_name: string;
}

interface ProductInfoFooterProps {
  product: ProductInfo;
  onNewScan: () => void;
  onViewDetails: () => void;
}

export function ProductInfoFooter({
  product,
  onNewScan,
  onViewDetails,
}: ProductInfoFooterProps) {
  const isError = product.status === StockStatus.ERROR;

  if (isError) {
    return (
      <div className="bg-white rounded-t-2xl p-5 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-[#FDECEA] border border-[#EE443F]">
          <CircleAlert size={18} className="text-[#8B1A18] shrink-0" />
          <div>
            <div className="text-[14px] font-semibold text-[#8B1A18]">
              Étiquette non reconnue
            </div>
            <div className="text-[12px] text-[#8B1A18]/80">
              Cette étiquette n'est pas dans le système.
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onNewScan}>
            Scanner autre
          </Button>
          <Button onClick={() => console.log("Signaler un problème")}>
            <Send size={14} />
            Signaler
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-t-2xl p-5 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border bg-blue-50 text-blue-700 border-blue-200">
          <Monitor size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[15px] font-bold text-gray-900">
            {product.name}
          </div>
          <div className="text-[12px] text-gray-400 font-mono">
            {product.reference}
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-sm font-medium border bg-[#F0F7F0] border-[#BBD8BC] text-[#2D6B31]">
          <CircleCheckBig size={13} />
          Disponible
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
        <MapPin size={12} className="text-[#cb006b]" />
        {product.center_name}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onNewScan}>
          Scanner autre
        </Button>
        <Button onClick={onViewDetails}>
          <Eye size={14} />
          Voir la fiche
        </Button>
      </div>
    </div>
  );
}
