"use client";

import { useState } from "react";
import Link from "next/link";
import { useFetchData } from "@/hooks/useFetchData";
import { fetchCentersList, Center, ListCentersResponse } from "@/lib/api/centers_list_info";
import PageError from "@/components/page_error/page_error";
import Loading from "@/components/loading/loading";
import { Building2, MapPin, Package, Users } from "lucide-react";

const INITIAL_VISIBLE = 4;

function CenterCard({
  center,
  isUserCenter,
}: {
  center: Center;
  isUserCenter?: boolean;
}) {
  return (
    <Link href={`/all_centers/${center.center_id}`} className="block bg-white rounded-xl border border-gray-200 p-4 relative hover:shadow-md hover:border-[rgb(230,0,126)] transition-all">
      {isUserCenter && (
        <span className="absolute top-3 right-3 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[rgb(230,0,126)] text-white">
          Mon centre
        </span>
      )}
      <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center mb-3">
        <Building2 size={20} className="text-[rgb(230,0,126)]" />
      </div>
      <p className="text-[14px] font-semibold text-gray-900 leading-snug mb-1 pr-16">
        {center.name}
      </p>
      <div className="flex items-center gap-1 text-[12px] text-gray-500 mb-3">
        <MapPin size={11} className="shrink-0" />
        <span>{center.city}</span>
      </div>
      <div className="flex items-center gap-4 text-[12px] text-gray-500">
        <span className="flex items-center gap-1">
          <Package size={12} />
          {center.materials_count} matériels
        </span>
        <span className="flex items-center gap-1">
          <Users size={12} />
          {center.contacts_count} contact{center.contacts_count !== 1 ? "s" : ""}
        </span>
      </div>
    </Link>
  );
}

function Section({
  title,
  items,
  userCenterId,
  loadMoreLabel,
}: {
  title: string;
  items: Center[];
  userCenterId?: number;
  loadMoreLabel: string;
}) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const visible = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  return (
    <section className="mb-8">
      <h2 className="text-[18px] font-bold text-gray-900 mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {visible.map((center) => (
          <CenterCard
            key={center.center_id}
            center={center}
            isUserCenter={center.center_id === userCenterId}
          />
        ))}
      </div>
      {hasMore && (
        <button
          onClick={() => setVisibleCount((v) => v + INITIAL_VISIBLE)}
          className="mt-4 w-full text-center text-[13px] text-gray-500 hover:text-[rgb(230,0,126)] transition-colors py-1"
        >
          ... {loadMoreLabel} ...
        </button>
      )}
    </section>
  );
}

export default function AllCenters() {
  const { data, loading, error } = useFetchData<ListCentersResponse>(fetchCentersList);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {error && <PageError page_error={error} />}
        {loading && <Loading loading_sentence="Chargement des centres..." />}

        {!loading && data && (
          <>
            <Section
              title="Entrepôts"
              items={data.warehouses_list}
              loadMoreLabel="Charger plus d'entrepôts"
            />
            <Section
              title="Centres"
              items={[data.user_center, ...data.centers_list]}
              userCenterId={data.user_center.center_id}
              loadMoreLabel="Charger plus de centres"
            />
          </>
        )}
      </div>
    </div>
  );
}
