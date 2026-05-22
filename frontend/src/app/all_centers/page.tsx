"use client"; 

import Navbar from "@/components/navbar/navbar";
import { useEffect, useState } from 'react';

export default function AllCenters() {
  // Définis l'interface
  interface Center {
    id: number;
    name: string;
    location: string;
    alerte: string;
    schedule: string;
    responsable_name: string;
    responsable_email: string;
    responsable_number: string;
  }

  // Typage du useState
  const [centersList, setCentersList] = useState<Center[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCentersList = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/list_centers', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'Failed to fetch');
        setCentersList(data);
        console.log('Centers List:', data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCentersList();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Liste des centres</h1>
          <p className="text-gray-600 text-lg">Trouvez un centre d'accueil près de chez vous</p>
          <div className="h-1 w-20 bg-gradient-to-r from-[rgb(230,0,126)] to-[rgb(240,51,127)] rounded-full mt-4"></div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex gap-3">
            <span className="text-lg">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin mb-4">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-[rgb(230,0,126)] rounded-full"></div>
              </div>
              <p className="text-gray-600">Chargement des centres...</p>
            </div>
          </div>
        )}

        {/* Content State */}
        {!loading && centersList.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {centersList.map((center) => (
              <div
                key={center.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 hover:border-[rgb(230,0,126)]"
              >
                {/* Card Header */}
                <div className="h-2 bg-gradient-to-r from-[rgb(230,0,126)] to-[rgb(240,51,127)]"></div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 line-clamp-2">{center.name}</h3>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-sm font-medium text-gray-500 w-24">📍 location:</span>
                      <span className="text-sm text-gray-700">{center.location}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-500 w-24">📅 Horaires:</span>
                      <span className="text-sm text-gray-700">{center.schedule}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-500 w-24">🚨 Alerte:</span>
                      <span
                        className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                          center.alerte === 'active'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {center.alerte}
                      </span>
                    </div>
                  </div>

                  <hr className="my-4 border-gray-200" />

                  <div className="space-y-2 text-sm">
                    <p className="font-semibold text-gray-900">Responsable</p>
                    <p className="text-gray-700"><strong>Nom:</strong> {center.responsable_name}</p>
                    <p className="text-gray-700">
                      <strong>Email:</strong>{' '}
                      <a href={`mailto:${center.responsable_email}`} className="text-[rgb(230,0,126)] hover:underline">
                        {center.responsable_email}
                      </a>
                    </p>
                    <p className="text-gray-700">
                      <strong>Téléphone:</strong>{' '}
                      <a href={`tel:${center.responsable_number}`} className="text-[rgb(230,0,126)] hover:underline">
                        {center.responsable_number}
                      </a>
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="bg-gray-50 px-6 py-3 flex gap-3">
                  <button className="flex-1 py-2 px-3 bg-[rgb(230,0,126)] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
                    Contacter
                  </button>
                  <button className="flex-1 py-2 px-3 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors">
                    Détails
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && centersList.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <span className="text-3xl">🏢</span>
            </div>
            <p className="text-gray-600 text-lg">Aucun centre trouvé</p>
            <p className="text-gray-500 text-sm mt-2">Aucun centre d'accueil disponible pour le moment</p>
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[rgb(230,0,126)]">
            <p className="text-gray-600 text-sm font-medium mb-2">Total centres</p>
            <p className="text-3xl font-bold text-gray-900">{centersList.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[rgb(240,51,127)]">
            <p className="text-gray-600 text-sm font-medium mb-2">Alertes actives</p>
            <p className="text-3xl font-bold text-gray-900">
              {centersList.filter(c => c.alerte === 'active').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[rgb(200,0,100)]">
            <p className="text-gray-600 text-sm font-medium mb-2">Centres actifs</p>
            <p className="text-3xl font-bold text-gray-900">
              {centersList.filter(c => c.alerte !== 'active').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
