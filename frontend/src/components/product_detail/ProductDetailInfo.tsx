import { StockStatus } from "@/app/scan/stock_status_enum";
import { Pencil, SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductDetailInfoProps {
  product: {
    reference: string;
    center_name: string;
    added_date: string;
    category: string;
  };
  onEdit: () => void;
}

export function ProductDetailInfo({ product, onEdit }: ProductDetailInfoProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-[15px] font-semibold text-gray-900">
          Informations
        </h2>
        <Button
          variant="outline"
          onClick={onEdit}
          className="h-8 rounded-md border border-gray-200 bg-white px-3 text-gray-700 hover:bg-gray-50"
        >
          <SquarePen size={16} className="ml-2" />
          Modifier 
        </Button>
      </div>
      <dl className="space-y-2.5">
        <div className="flex items-start gap-3">
          <dt className="text-sm text-gray-400 w-36 shrink-0">Référence</dt>
          <dd className="text-sm font-medium text-gray-700">
            {product.reference}
          </dd>
        </div>
        <div className="flex items-start gap-3">
          <dt className="text-sm text-gray-400 w-36 shrink-0">Centre</dt>
          <dd className="text-sm font-medium text-gray-700">
            {product.center_name}
          </dd>
        </div>
        <div className="flex items-start gap-3">
          <dt className="text-sm text-gray-400 w-36 shrink-0">Date d'ajout</dt>
          <dd className="text-sm font-medium text-gray-700">
            {new Date(product.added_date).toLocaleDateString()}
          </dd>
        </div>
        <div className="flex items-start gap-3">
          <dt className="text-sm text-gray-400 w-36 shrink-0">Catégorie</dt>
          <dd className="text-sm font-medium text-gray-700">
            {product.category}
          </dd>
        </div>
      </dl>
    </div>
  );
}
