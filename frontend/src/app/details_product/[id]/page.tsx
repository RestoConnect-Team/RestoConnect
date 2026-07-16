"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StockStatus } from "@/app/scan/stock_status_enum";
import { ProductDetailHeader } from "@/components/product_detail/ProductDetailHeader";
import { ProductDetailInfo } from "@/components/product_detail/ProductDetailInfo";
import { ProductDetailQrCode } from "@/components/product_detail/ProductDetailQrCode";
import {
  ProductDetailHistory,
  ProductHistoryItem,
} from "@/components/product_detail/ProductDetailHistory";
import { ProductDetailStatus } from "@/components/product_detail/ProductDetailStatus";

interface ProductDetailData {
  id: number;
  name: string;
  reference: string;
  status: StockStatus;
  category: string;
  center_name: string;
  added_date: string;
  description: string | null;
  last_scan_date?: string;
  rating: number;
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const [product, setProduct] = useState<ProductDetailData | null>(null);
  const [history, setHistory] = useState<ProductHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/stock/${id}`, {
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.detail || "Failed to fetch product details",
          );
        }

        const data: {
          details: ProductDetailData;
          history: ProductHistoryItem[];
        } = await response.json();
        setProduct(data.details);
        setHistory(data.history);
      } catch (err: any) {
        setError(
          err.message || "An error occurred while fetching product details.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement des détails du produit...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <p>Erreur: {error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Produit non trouvé.</p>
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-4 lg:p-6 max-w-3xl mx-auto pb-24 lg:pb-6">
        <Link
          href="/equipement"
          className="flex items-center gap-1.5 text-sm text-[#cb006b] hover:text-[#a30056] mb-4 font-medium transition-colors"
        >
          <ArrowLeft size={15} />
          Retour à la liste des matériels
        </Link>

        {product && (
          <>
            <ProductDetailHeader product={product} />

            <ProductDetailInfo
              product={product}
              onEdit={() => handleProductUpdated(product)}
            />

            <ProductDetailStatus
              productDescription={product.description}
              productRating={product.rating}
              onReportProblem={() =>
                console.log(
                  "Signaler un problème pour",
                  product.id,
                  "from status section",
                )
              }
            />

            <ProductDetailQrCode
              productReference={product.reference}
              productName={product.name}
            />

            <ProductDetailHistory
              history={history}
              lastScanDate={product.last_scan_date}
            />
          </>
        )}
      </div>
    </main>
  );
}
