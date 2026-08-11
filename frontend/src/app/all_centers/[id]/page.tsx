"use client";

import { CenterDetailView } from "@/components/center_detail/CenterDetailView";
import { PageLayout } from "@/components/layout/PageLayout";
import Loading from "@/components/loading/loading";
import PageError from "@/components/page_error/page_error";
import { useFetchData } from "@/hooks/useFetchData";
import { fetchCenterDetail } from "@/lib/api/center_detail_info";
import { CenterDetails } from "@/types/center";
import { use } from "react";

export default function CenterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const {
    data: center,
    loading,
    error,
  } = useFetchData<CenterDetails>(fetchCenterDetail(Number(id)));

  return (
    <PageLayout>
      {error && <PageError page_error={error} />}
      {loading && <Loading loading_sentence="Chargement du centre..." />}

      {!loading && center && <CenterDetailView center={center} />}
    </PageLayout>
  );
}
