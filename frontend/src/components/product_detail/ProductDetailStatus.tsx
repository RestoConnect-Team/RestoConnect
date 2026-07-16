"use client";

import { useState } from "react";
import { Star, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductDetailStatusProps {
  productDescription: string | null;
  productRating: number | null;
  onReportProblem: () => void;
}

export function ProductDetailStatus({
  productDescription,
  productRating: productRated,
  onReportProblem,
}: ProductDetailStatusProps) {
  const [rating, setRating] = useState(0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
      <h2 className="text-[15px] font-semibold text-gray-900 mb-3">
        État du matériel
      </h2>

      {/* Signaler un problème
      <div className="mb-4">
        <Button
          onClick={onReportProblem}
          variant="outline"
          className="inline-flex items-center gap-1.5 px-3.5 h-9 rounded-lg border border-orange-200 bg-orange-50 text-orange-700 text-sm font-medium hover:bg-orange-100 w-full justify-start"
        >
          <TriangleAlert size={13} />
          Signaler un problème
        </Button>
      </div> */}

      {/* Notation par étoiles */}
      {/* <div className="mb-4 pt-4 border-t border-gray-100">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Quel est l'état de ce matériel ?
        </h3>

        {productRated && (
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={24}
                className={
                  star <= rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
          </div> }
          )
      
      </div> */}

      {/* Notes déjà saisies */}
      <div className="pt-4 border-t border-gray-100">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Notes</h3>
        {productDescription ? (
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
            {productDescription}
          </p>
        ) : (
          <p className="text-sm text-gray-500">
            Aucune note n'a été saisie pour ce matériel.
          </p>
        )}
      </div>
    </div>
  );
}
