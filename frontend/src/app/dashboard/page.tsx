"use client";

import { CenterDetailView } from "@/components/center_detail/CenterDetailView";
import { PageLayout } from "@/components/layout/PageLayout";
import Loading from "@/components/loading/loading";
import PageError from "@/components/page_error/page_error";
import { useFetchData } from "@/hooks/useFetchData";
import { fetchMyCenterDetail } from "@/lib/api/center_detail_info";
import { CenterDetails } from "@/types/center";

export function Row({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 py-1.5 text-[13px] ml-12">
      <span className="w-35 shrink-0 text-gray-400">{label}</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );
}

export default function Dashboard() {
  const {
    data: center,
    loading,
    error,
  } = useFetchData<CenterDetails>(fetchMyCenterDetail);

  return (
    <PageLayout>
      {error && <PageError page_error={error} />}
      {loading && (
        <Loading loading_sentence="Chargement des informations du centre..." />
      )}
      {!loading && center && (
        <CenterDetailView center={center} isDashboard={true} />
      )}
    </PageLayout>
  );
}
