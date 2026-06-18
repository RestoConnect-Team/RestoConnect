"use client"; 


import { useFetchData } from '@/hooks/useFetchData';
import { fetchCenterInfo, Center } from "@/lib/api/my_center_info";

import Navbar from "@/components/navbar/navbar";

import Title from "@/components/title/title";
import PageError from "@/components/page_error/page_error";
import Loading from "@/components/loading/loading";


export default function MyCenter() {

  const { data: center, loading, error } = useFetchData<Center>(fetchCenterInfo);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header Section */}
        <Title title="Mon Centre d'accueil" subtitle="Tableau de bord et informations de gestion" />

        {/* Error State */}
        {error && (
          <PageError page_error={error} />
        )}

        {/* Loading State */}
        {loading && (
          <Loading loading_sentence="Chargement des informations du centre..."/>
        )}
        
        {/* Content State */}
        {!loading && center && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Card */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                {/* Card Header */}
                <div className="h-3 bg-gradient-to-r from-[rgb(230,0,126)] to-[rgb(240,51,127)]"></div>

                {/* Card Content */}
                <div className="p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{center.name}</h2>
                  
                  <div className="inline-block mb-6">
                    <span
                      className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full ${
                        center.alerte === 'active'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${center.alerte === 'active' ? 'bg-red-700' : 'bg-green-700'}`}></span>
                      {center.alerte === 'active' ? 'Alerte active' : 'Fonctionnement normal'}
                    </span>
                  </div>

                  <hr className="my-6 border-gray-200" />

                  {/* Information Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">📍 Localisation</p>
                      <p className="text-lg text-gray-900">{center.location}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">📅 Horaires</p>
                      <p className="text-lg text-gray-900">{center.schedule}</p>
                    </div>
                  </div>

                  {/* Tabs/Sections */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b-2 border-[rgb(230,0,126)]">
                        Responsable du centre
                      </h3>
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-indigo-100">
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Nom</p>
                            <p className="text-lg font-semibold text-gray-900 mt-1">{center.responsable_name}</p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-600">Email</p>
                              <a
                                href={`mailto:${center.responsable_email}`}
                                className="text-[rgb(230,0,126)] hover:underline font-medium mt-1 inline-block"
                              >
                                {center.responsable_email}
                              </a>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">Téléphone</p>
                              <a
                                href={`tel:${center.responsable_number}`}
                                className="text-[rgb(230,0,126)] hover:underline font-medium mt-1 inline-block"
                              >
                                {center.responsable_number}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Quick Stats */}
            <div className="space-y-6">
              {/* Status Card */}
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[rgb(230,0,126)]">
                <p className="text-gray-600 text-sm font-medium mb-3">🏢 Statut</p>
                <p className="text-2xl font-bold text-gray-900">Actif</p>
              </div>

              {/* ID Card */}
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[rgb(240,51,127)]">
                <p className="text-gray-600 text-sm font-medium mb-3">🔑 Identifiant</p>
                <p className="text-2xl font-bold text-gray-900">#{center.id}</p>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-md p-6 border border-purple-100">
                <p className="text-gray-900 font-bold mb-4">Actions rapides</p>
                <div className="space-y-3">
                  <button className="w-full py-3 px-4 bg-[rgb(230,0,126)] text-white font-medium rounded-lg hover:opacity-90 transition-opacity">
                    📊 Voir statistiques
                  </button>
                  <button className="w-full py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors">
                    ⚙️ Paramètres
                  </button>
                  <button className="w-full py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors">
                    📝 Rapports
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !center && !error && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <span className="text-3xl">🏢</span>
            </div>
            <p className="text-gray-600 text-lg">Aucun centre trouvé</p>
            <p className="text-gray-500 text-sm mt-2">Vous n'êtes pas assigné à un centre</p>
          </div>
        )}
      </div>
    </div>
  );
}
