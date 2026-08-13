"use client";

import { PageLayout } from "@/components/layout/PageLayout";
import Loading from "@/components/loading/loading";
import PageError from "@/components/page_error/page_error";
import SearchBar from "@/components/searchbar/Searchbar";
import { CenterService } from "@/services/center.service";
import { Center, ListCentersResponse } from "@/types/center";
import { Building2, MapPin, Package, Plus, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const INITIAL_VISIBLE = 4;

function CenterCard({
  center,
  isUserCenter,
}: {
  center: Center;
  isUserCenter?: boolean;
}) {
  return (
    <Link
      href={`/all_centers/${center.center_id}`}
      className="block bg-white rounded-xl border border-gray-200 p-4 relative hover:shadow-md hover:border-[#cb006b] transition-all"
    >
      {isUserCenter && (
        <span className="absolute top-3 right-3 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-pink-100 text-[#cb006b]">
          Mon centre
        </span>
      )}
      <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center mb-3">
        <Building2 size={20} className="text-[#cb006b]" />
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
          {center.contacts_count} contact
          {center.contacts_count !== 1 ? "s" : ""}
        </span>
      </div>
    </Link>
  );
}

function Section({
  title,
  items,
  isUserCenter,
  loadMoreLabel,
}: {
  title: string;
  items: Center[];
  isUserCenter?: boolean;
  loadMoreLabel?: string;
}) {
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_VISIBLE);
  const visible =
    items.length > visibleCount ? items.slice(0, visibleCount) : items;
  const hasMore = visibleCount < items.length;

  return (
    <section>
      <h2 className="text-[18px] font-bold text-[#cb006b] mb-2">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {visible.map((center) => (
          <CenterCard
            key={center.center_id}
            center={center}
            isUserCenter={isUserCenter}
          />
        ))}
      </div>
      {hasMore && loadMoreLabel && (
        <button
          onClick={() => setVisibleCount((v) => v + INITIAL_VISIBLE)}
          className="mt-4 w-full text-center text-[13px] text-gray-500 hover:text-[#cb006b] transition-colors py-1 cursor-pointer"
        >
          ... {loadMoreLabel} ...
        </button>
      )}
    </section>
  );
}

export default function AllCenters() {
  const [data, setData] = useState<ListCentersResponse | null>(null);
  const [filteredData, setFilteredData] = useState<ListCentersResponse | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [mustReload, setMustReload] = useState<boolean>(true);

  const centerService = new CenterService();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const data = await centerService.fetchCentersList();
        setData(data);
        setFilteredData(data);
        setSearchQuery("");
      } catch (e: any) {
        setError(e);
      } finally {
        setLoading(false);
        setMustReload(false);
      }
    };

    if (mustReload) {
      fetchData();
    }
  }, [mustReload]);

  function filterList(centers: Center[], searchQuery: string): Center[] {
    if (centers.length <= 0) {
      return centers;
    }
    return centers.filter(
      (element) =>
        element.name.toLowerCase().includes(searchQuery) ||
        element.city.toLowerCase().includes(searchQuery),
    );
  }

  useEffect(() => {
    if (!data) return;
    if (searchQuery === "") {
      setFilteredData(data);
    } else {
      setFilteredData({
        user_center: filterList([data.user_center], searchQuery)[0],
        centers_list: filterList(data.centers_list, searchQuery),
        warehouses_list: filterList(data.warehouses_list, searchQuery),
      });
    }
  }, [searchQuery]);

  return (
    <PageLayout
      title="Centres et entrepôts"
      onClick={() => {}}
      buttonLabel={
        <>
          <Plus />
          Ajouter
        </>
      }
    >
      <div className="p-6 flex flex-col gap-5">
        {error && <PageError page_error={error.message} />}
        {loading && <Loading loading_sentence="Chargement des centres..." />}

        {!loading && filteredData && (
          <>
            <SearchBar
              onSearch={(e) => setSearchQuery(e)}
              placeholder="Rechercher par nom, localisation..."
            />
            {filteredData.user_center && (
              <Section
                title="Mon centre"
                items={[filteredData.user_center]}
                isUserCenter={true}
              />
            )}
            {filteredData.centers_list.length > 0 && (
              <Section
                title="Centres"
                items={filteredData.centers_list}
                loadMoreLabel="Charger plus de centres"
              />
            )}
            {filteredData.warehouses_list.length > 0 && (
              <Section
                title="Entrepôts"
                items={filteredData.warehouses_list}
                loadMoreLabel="Charger plus d'entrepôts "
              />
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
}
