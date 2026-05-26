"use client";

import Navbar from "@/components/navbar/navbar";
import { useEffect, useState } from 'react';

export default function Vehicule() {
  // Définis l'interface
  interface VehiculeItem {
    id: number;
    name: string;
    location: string;
    center_name: string;
    responsable_name: string;
    responsable_email: string;
    has_documents: boolean;
  }

  interface VehiculeData {
    vehicules_center: VehiculeItem[];
    vehicules_other: VehiculeItem[];
  }

  // Typage du useState
  const [vehiculesData, setVehiculesData] = useState<VehiculeData>({
    vehicules_center: [],
    vehicules_other: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVehicules = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/list_vehicules', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'Failed to fetch');
        setVehiculesData(data);
        console.log('Vehicules List:', data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicules();
  }, []);

  const VehiculeCard = ({ vehicule, isCenterVehicule }: { vehicule: VehiculeItem; isCenterVehicule: boolean }) => (
    <div
      className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border ${
        isCenterVehicule
          ? 'border-[rgb(230,0,126)] hover:border-[rgb(240,51,127)]'
          : 'border-gray-100 hover:border-[rgb(230,0,126)]'
      }`}
    >
      {/* Card Header */}
      <div className={`h-2 ${
        isCenterVehicule
          ? 'bg-gradient-to-r from-[rgb(230,0,126)] to-[rgb(240,51,127)]'
          : 'bg-gradient-to-r from-gray-300 to-gray-400'
      }`}></div>

      {/* Card Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 flex-1">{vehicule.name}</h3>
          {isCenterVehicule && (
            <span className="ml-2 inline-block text-xs font-semibold px-3 py-1 rounded-full bg-[rgb(230,0,126)] text-white whitespace-nowrap">
              Mon centre
            </span>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-sm font-medium text-gray-500 w-24">📍 Localisation:</span>
            <span className="text-sm text-gray-700">{vehicule.location || 'Non spécifiée'}</span>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-sm font-medium text-gray-500 w-24">🏢 Centre:</span>
            <span className="text-sm text-gray-700">{vehicule.center_name || 'Non assigné'}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500 w-24">📄 Documents:</span>
            <span
              className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                vehicule.has_documents
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {vehicule.has_documents ? '✓ Oui' : '✗ Non'}
            </span>
          </div>
        </div>

        <hr className="my-4 border-gray-200" />

        <div className="space-y-2 text-sm">
          <p className="font-semibold text-gray-900">Responsable</p>
          <p className="text-gray-700"><strong>Nom:</strong> {vehicule.responsable_name || 'Non assigné'}</p>
          <p className="text-gray-700">
            <strong>Email:</strong>{' '}
            {vehicule.responsable_email ? (
              <a href={`mailto:${vehicule.responsable_email}`} className="text-[rgb(230,0,126)] hover:underline">
                {vehicule.responsable_email}
              </a>
            ) : (
              'Non assigné'
            )}
          </p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="bg-gray-50 px-6 py-3 flex gap-3">
        <button className="flex-1 py-2 px-3 bg-[rgb(230,0,126)] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
          Détails
        </button>
        <button className="flex-1 py-2 px-3 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors">
          Documents
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Liste des véhicules</h1>
          <p className="text-gray-600 text-lg">Gérez les véhicules de votre centre</p>
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
              <p className="text-gray-600">Chargement des véhicules...</p>
            </div>
          </div>
        )}

        {/* Vehicules de mon centre */}
        {!loading && vehiculesData.vehicules_center.length > 0 && (
          <div className="mb-12">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">🎯 Véhicules de mon centre</h2>
              <p className="text-gray-600">Les véhicules assignés à votre centre</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehiculesData.vehicules_center.map((vehicule) => (
                <VehiculeCard key={vehicule.id} vehicule={vehicule} isCenterVehicule={true} />
              ))}
            </div>
          </div>
        )}

        {/* Autres véhicules */}
        {!loading && vehiculesData.vehicules_other.length > 0 && (
          <div className="mb-12">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">📦 Autres véhicules</h2>
              <p className="text-gray-600">Les véhicules d'autres centres</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehiculesData.vehicules_other.map((vehicule) => (
                <VehiculeCard key={vehicule.id} vehicule={vehicule} isCenterVehicule={false} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && vehiculesData.vehicules_center.length === 0 && vehiculesData.vehicules_other.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <span className="text-3xl">🚗</span>
            </div>
            <p className="text-gray-600 text-lg">Aucun véhicule trouvé</p>
            <p className="text-gray-500 text-sm mt-2">Aucun véhicule disponible pour le moment</p>
          </div>
        )}

        {/* Stats Section */}
        {!loading && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[rgb(230,0,126)]">
              <p className="text-gray-600 text-sm font-medium mb-2">Véhicules du centre</p>
              <p className="text-3xl font-bold text-gray-900">{vehiculesData.vehicules_center.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[rgb(240,51,127)]">
              <p className="text-gray-600 text-sm font-medium mb-2">Avec documents</p>
              <p className="text-3xl font-bold text-gray-900">
                {vehiculesData.vehicules_center.filter(v => v.has_documents).length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[rgb(200,0,100)]">
              <p className="text-gray-600 text-sm font-medium mb-2">Autres véhicules</p>
              <p className="text-3xl font-bold text-gray-900">
                {vehiculesData.vehicules_other.length}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
