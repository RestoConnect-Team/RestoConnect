"use client";

import { useFetchData } from "@/hooks/useFetchData";
import {
  fetchEquipementList,
  EquipementItem,
} from "@/lib/api/equipements_list_info";

import Title from "@/components/title/title";
import PageError from "@/components/page_error/page_error";
import Loading from "@/components/loading/loading";
import { PageLayout } from "@/components/layout/PageLayout";

export default function Equipement() {
  const { data, loading, error } =
    useFetchData<EquipementItem[]>(fetchEquipementList);
  const equipementList = data ?? [];

  return (
    <PageLayout title="Matériels" onClick={() => {}} buttonLabel="Ajouter">
      <div className="p-6">
        {/* Error State */}
        {error && <PageError page_error={error} />}

        {/* Loading State */}
        {loading && (
          <Loading loading_sentence="Chargement des équipements..." />
        )}

        {/* Content State */}
        {!loading && equipementList.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipementList.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 hover:border-[rgb(230,0,126)]"
              >
                {/* Card Header */}
                <div className="h-2 bg-gradient-to-r from-[rgb(230,0,126)] to-[rgb(240,51,127)]"></div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 line-clamp-2">
                    {item.name}
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-500 w-24">
                        Référence:
                      </span>
                      <span className="text-sm font-mono bg-gray-100 px-3 py-1 rounded text-gray-700">
                        {item.reference}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-500 w-24">
                        Quantité:
                      </span>
                      <span className="text-2xl font-bold text-[rgb(230,0,126)]">
                        {item.quantity}
                      </span>
                    </div>

                    {item.categorie && (
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500 w-24">
                          Catégorie:
                        </span>
                        <span className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
                          {item.categorie}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="bg-gray-50 px-6 py-3 flex gap-3">
                  <button className="flex-1 py-2 px-3 bg-[rgb(230,0,126)] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
                    Éditer
                  </button>
                  <button className="flex-1 py-2 px-3 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors">
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && equipementList.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <span className="text-3xl">📦</span>
            </div>
            <p className="text-gray-600 text-lg">Aucun équipement trouvé</p>
            <p className="text-gray-500 text-sm mt-2">
              Commencez par ajouter des équipements à l'inventaire
            </p>
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[rgb(230,0,126)]">
            <p className="text-gray-600 text-sm font-medium mb-2">
              Total équipements
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {equipementList.length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[rgb(240,51,127)]">
            <p className="text-gray-600 text-sm font-medium mb-2">
              Stock total
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {equipementList.reduce(
                (sum, item) => sum + (item.quantity || 0),
                0,
              )}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[rgb(200,0,100)]">
            <p className="text-gray-600 text-sm font-medium mb-2">Catégories</p>
            <p className="text-3xl font-bold text-gray-900">
              {new Set(equipementList.map((item) => item.categorie)).size}
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
