"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CheckCircle2, Clock, Eye, Plus } from "lucide-react";

import { useFetchData } from "@/hooks/useFetchData";
import {
  fetchInventoriesList,
  createInventory,
  InventoryItem,
} from "@/lib/api/inventories";

import PageError from "@/components/page_error/page_error";
import Loading from "@/components/loading/loading";
import { PageLayout } from "@/components/layout/PageLayout";
import { formatDate } from "@/utils/formatDate";

function statusBadge(status: string) {
  if (status === "terminé") {
    return {
      className:
        "inline-flex items-center gap-1.5 rounded-md border border-green-200 bg-green-50 px-3 py-1 text-green-700 font-medium",
      Icon: CheckCircle2,
    };
  }
  return {
    className:
      "inline-flex items-center gap-1.5 rounded-md border border-amber-300 bg-amber-50 px-3 py-1 text-amber-800 font-medium",
    Icon: Clock,
  };
}

export default function Inventaires() {
  const { data, loading, error } =
    useFetchData<InventoryItem[]>(fetchInventoriesList);
  const inventories = data ?? [];
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const sorted = useMemo(
    () =>
      [...inventories].sort(
        (a, b) =>
          new Date(b.start_date).getTime() - new Date(a.start_date).getTime(),
      ),
    [inventories],
  );

  const handleCreate = async () => {
    setCreating(true);
    setCreateError("");
    try {
      await createInventory();
      window.location.reload();
    } catch (err: any) {
      setCreateError(err.message || "Erreur lors de la création de l'inventaire");
      setCreating(false);
    }
  };

  return (
    <PageLayout
      title="Inventaires"
      onClick={handleCreate}
      buttonLabel={
        <>
          <Plus size={16} />
          {creating ? "Création..." : "Réaliser un inventaire"}
        </>
      }
    >
      <div className="p-6 flex flex-col gap-4">
        {createError && <PageError page_error={createError} />}
        {error && <PageError page_error={error} />}
        {loading && (
          <Loading loading_sentence="Chargement des inventaires..." />
        )}

        {!loading && !error && (
          <>
            {sorted.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                Aucun inventaire pour ce centre.
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wide text-xs">
                      <th className="text-left px-4 py-3 font-semibold">
                        Début
                      </th>
                      <th className="text-left px-4 py-3 font-semibold">
                        Fin
                      </th>
                      <th className="text-left px-4 py-3 font-semibold">
                        Statut
                      </th>
                      <th className="text-left px-4 py-3 font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((inv) => {
                      const badge = statusBadge(inv.status_inventory_stock);
                      const Icon = badge.Icon;
                      return (
                        <tr
                          key={inv.inventory_id}
                          className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70"
                        >
                          <td className="px-4 py-4 text-slate-600">
                            {formatDate(inv.start_date)}
                          </td>
                          <td className="px-4 py-4 text-slate-600">
                            {inv.end_date ? formatDate(inv.end_date) : "—"}
                          </td>
                          <td className="px-4 py-4">
                            <span className={badge.className}>
                              <Icon size={14} />
                              {inv.status_inventory_stock}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <Link
                              href={`/inventaires/${inv.inventory_id}`}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                              aria-label={`Voir l'inventaire du ${formatDate(inv.start_date)}`}
                            >
                              <Eye size={16} />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
}
