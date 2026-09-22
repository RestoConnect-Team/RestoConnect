"use client";

import { CenterCard } from "@/components/centers/CenterCard";
import { PageLayout } from "@/components/layout/PageLayout";
import Loading from "@/components/loading/loading";
import PageError from "@/components/page_error/page_error";
import SearchBar from "@/components/searchbar/Searchbar";
import { CenterService } from "@/services/center.service";
import { Center, ListCentersResponse } from "@/types/center";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
const INITIAL_VISIBLE = 16;

function Section({
  title,
  items,
  loadMoreLabel,
  user_center,
}: {
  title: string;
  items: Center[];
  loadMoreLabel?: string;
  user_center?: Center;
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
            user_center={user_center}
          />
        ))}
      </div>
      {hasMore && loadMoreLabel && (
        <button
          onClick={() => setVisibleCount((v) => v + INITIAL_VISIBLE)}
          className="mt-4 w-full text-center text-[13px] text-gray-500 hover:text-[#cb006b] transition-colors py-1 cursor-pointer"
        >
          {loadMoreLabel}
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
        data.centers_list = [data.user_center].concat(data.centers_list);
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
            {(filteredData.centers_list.length > 0 ||
              filteredData.user_center) && (
              <Section
                title="Centres"
                items={filteredData.centers_list}
                loadMoreLabel="Charger plus de centres"
                user_center={filteredData.user_center}
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
