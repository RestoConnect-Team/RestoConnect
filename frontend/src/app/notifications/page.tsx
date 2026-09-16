"use client";

import { useFetchData } from "@/hooks/useFetchData";
import { fetchMyCenterDetail } from "@/lib/api/center_detail_info";
import { CenterDetails } from "@/types/center";
import PageError from "@/components/page_error/page_error";
import Loading from "@/components/loading/loading";
import { PageLayout } from "@/components/layout/PageLayout";
import { AlertRow } from "@/components/dashboard/AlertRow";

export default function Notifications() {
  const { data: center, loading, error } =
    useFetchData<CenterDetails>(fetchMyCenterDetail);

  const alerts = center?.alerts ?? [];

  return (
    <PageLayout title="Notifications">
      <div className="p-6 flex flex-col gap-4">
        {error && <PageError page_error={error} />}
        {loading && (
          <Loading loading_sentence="Chargement des notifications..." />
        )}

        {!loading && !error && (
          <>
            {alerts.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                Aucune notification.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {alerts.map((alert, idx) => (
                  <AlertRow key={idx} alert={alert} idx={idx} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
}
