"use client"; 

import Navbar from "@/components/navbar/navbar";
import { useEffect, useState } from 'react';

export default function Profil() {
  interface Profil {
    id: number;
    name: string;
    lastname: string;
    email: string;
    telephone: string;
    street: string;
    city: string;
    postal_code: string;
    status: string;
    created_at: string;
    updated_at: string;
    center: string;
    photo_url?: string | null;
  }
  const [profil, setProfil] = useState<Profil | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
      const fetchProfil = async () => {
          try {
              const response = await fetch('http://localhost:8000/api/profil', {
                  method: 'GET',
                  credentials: 'include', 
                  headers: { 'Content-Type': 'application/json' },
              });
              const data = await response.json();
              if (!response.ok) throw new Error(data.detail || 'Failed to fetch');
              setProfil(data);
              console.log('Profil:', data);
          } catch (err) {
              setError(err instanceof Error ? err.message : 'Une erreur est survenue');
              console.error('Error:', err);
          } finally {
              setLoading(false);
          }
      };

      fetchProfil();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mon profil</h1>
          <p className="text-gray-600 text-lg">Gérer vos informations personnelles</p>
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
              <p className="text-gray-600">Chargement du profil...</p>
            </div>
          </div>
        )}

        {/* Content State */}
        {!loading && profil && (
          <div className="space-y-8">
            {/* Profile Header Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="h-2 bg-gradient-to-r from-[rgb(230,0,126)] to-[rgb(240,51,127)]"></div>
              <div className="p-8">
                <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <img 
                      src={profil.photo_url ?? "/default-avatar.png"} 
                      alt={profil.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-[rgb(230,0,126)]"
                    />
                  </div>
                  
                  {/* Basic Info */}
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{profil.name} {profil.lastname}</h2>
                    <p className="text-[rgb(230,0,126)] font-semibold mb-4 text-lg">{profil.center}</p>
                    <div className="space-y-2">
                      <p className="text-gray-600"><strong>Email:</strong> {profil.email}</p>
                      <p className="text-gray-600"><strong>Téléphone:</strong> {profil.telephone}</p>
                      <p className="text-gray-600"><strong>Statut:</strong> 
                        <span className="ml-2 inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                          {profil.status}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 w-full md:w-auto">
                    <button className="w-full md:w-40 py-2 px-4 bg-[rgb(230,0,126)] text-white font-medium rounded-lg hover:opacity-90 transition-opacity">
                      Modifier
                    </button>
                    <button className="w-full md:w-40 py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors">
                      Paramètres
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Information Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Address Card */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">📍</span>
                  <h3 className="text-xl font-bold text-gray-900">Adresse</h3>
                </div>
                <div className="space-y-3 text-gray-600">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Rue</p>
                    <p className="text-gray-900">{profil.street}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Ville</p>
                      <p className="text-gray-900">{profil.city}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Code postal</p>
                      <p className="text-gray-900">{profil.postal_code}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dates Card */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">📅</span>
                  <h3 className="text-xl font-bold text-gray-900">Dates</h3>
                </div>
                <div className="space-y-3 text-gray-600">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Compte créé le</p>
                    <p className="text-gray-900 font-mono">{new Date(profil.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Dernière modification</p>
                    <p className="text-gray-900 font-mono">{new Date(profil.updated_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[rgb(230,0,126)]">
                <p className="text-gray-600 text-sm font-medium mb-2">ID Profil</p>
                <p className="text-3xl font-bold text-gray-900">{profil.id}</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[rgb(240,51,127)]">
                <p className="text-gray-600 text-sm font-medium mb-2">Centre</p>
                <p className="text-lg font-bold text-gray-900 truncate">{profil.center}</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[rgb(200,0,100)]">
                <p className="text-gray-600 text-sm font-medium mb-2">Statut</p>
                <p className="text-lg font-bold text-green-600">{profil.status}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
