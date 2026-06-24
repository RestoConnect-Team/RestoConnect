"use client"; 


import { useFetchData } from '@/hooks/useFetchData';
import { fetchProfilInfo, Profile } from "@/lib/api/my_profil_info";

import { 
  Button, buttonVariants
} from "@/components/figma_imports/button";

import Title from "@/components/title/title";
import PageError from "@/components/page_error/page_error";
import Loading from "@/components/loading/loading";
import WhiteButton from "@/components/button/white_button";
import PinkButton from "@/components/button/pink_button";

export default function Profil() {

  const { data: profil, loading, error } = useFetchData<Profile>(fetchProfilInfo);

  


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* Header Section */}
        <Title 
          title="Mon profil" 
          subtitle="Gérer vos informations personnelles"
        />

        {/* Error State */}
        {error && (
          <PageError page_error={error} />
        )}

        {/* Loading State */}
        {loading && (
          <Loading loading_sentence="Chargement du profil..."/>
        )}

        

        {/* Content State */}
        {!loading && profil && (

          /*Créer moi un bouton ici avec le fichier Button */
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
                    <PinkButton text="Modifier" />
                    <Button />
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

            
          </div>
        )}
      </div>
    </div>
  );
}
