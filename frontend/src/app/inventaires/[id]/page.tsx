"use client";

import Link from "next/link";
import { use } from "react";
import { ArrowLeft, CheckCircle2, CircleAlert } from "lucide-react";

import { useFetchData } from "@/hooks/useFetchData";
import {
  fetchInventoryStocks,
  InventoryStockItem,
} from "@/lib/api/inventories";

import PageError from "@/components/page_error/page_error";
import Loading from "@/components/loading/loading";
import { PageLayout } from "@/components/layout/PageLayout";

function statusBadge(status: string) {
  if (status === "Présent") {
    return {
      className:
        "inline-flex items-center gap-1.5 rounded-md border border-green-200 bg-green-50 px-3 py-1 text-green-700 font-medium",
      Icon: CheckCircle2,
    };
  }
  return {
    className:
      "inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-3 py-1 text-red-700 font-medium",
    Icon: CircleAlert,
  };
}

export default function InventoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const inventoryId = Number(id);

  const { data, loading, error } = useFetchData<InventoryStockItem[]>(() =>
    fetchInventoryStocks(inventoryId),
  );
  const stocks = data ?? [];

  const present = stocks.filter((s) => s.status_inventory_stock === "Présent");
  const absent = stocks.filter((s) => s.status_inventory_stock === "Absent");

  return (
    <PageLayout>
      <div className="p-6 flex flex-col gap-4">
        <Link
          href="/inventaires"
          className="text-sm text-[rgb(230,0,126)] hover:underline"
        >
          ← Retour à la liste
        </Link>

        {error && <PageError page_error={error} />}
        {loading && (
          <Loading loading_sentence="Chargement de l'inventaire..." />
        )}

        {!loading && !error && (
          <>
            <div className="flex gap-4">
              <div className="flex-1 rounded-xl border border-green-200 bg-green-50 p-4 text-center">
                <p className="text-2xl font-bold text-green-700">
                  {present.length}
                </p>
                <p className="text-sm text-green-700">Présents</p>
              </div>
              <div className="flex-1 rounded-xl border border-red-200 bg-red-50 p-4 text-center">
                <p className="text-2xl font-bold text-red-700">
                  {absent.length}
                </p>
                <p className="text-sm text-red-700">Absents</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wide text-xs">
                    <th className="text-left px-4 py-3 font-semibold">Nom</th>
                    <th className="text-left px-4 py-3 font-semibold">
                      Référence
                    </th>
                    <th className="text-left px-4 py-3 font-semibold">
                      Catégorie
                    </th>
                    <th className="text-left px-4 py-3 font-semibold">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stocks.map((stock) => {
                    const badge = statusBadge(stock.status_inventory_stock);
                    const Icon = badge.Icon;
                    return (
                      <tr
                        key={stock.inventory_stock_id}
                        className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70"
                      >
                        <td className="px-4 py-4 font-semibold text-slate-900">
                          {stock.name}
                        </td>
                        <td className="px-4 py-4 text-slate-600 font-mono">
                          {stock.reference}
                        </td>
                        <td className="px-4 py-4 text-slate-600">
                          {stock.category}
                        </td>
                        <td className="px-4 py-4">
                          <span className={badge.className}>
                            <Icon size={14} />
                            {stock.status_inventory_stock}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
}
