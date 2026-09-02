"use client";

import { useFetchData } from "@/hooks/useFetchData";
import { fetchProfilInfo, Profile } from "@/lib/api/my_profil_info";
import PageError from "@/components/page_error/page_error";
import Loading from "@/components/loading/loading";
import { PageLayout } from "@/components/layout/PageLayout";
import { ProfilePicture } from "@/components/layout/ProfilePicture";
import { Info, LogOut, Settings } from "lucide-react";
import { AuthService } from "@/services/auth.service";
import { useRouter } from "next/navigation";

export default function Profil() {
  const {
    data: profil,
    loading,
    error,
  } = useFetchData<Profile>(fetchProfilInfo);

  const authService = new AuthService();
  const router = useRouter();

  const handleLogOut = async () => {
    try {
      await authService.logOut();
      router.push("/");
    } catch (error) {
      throw error;
    }
  };

  return (
    <PageLayout title={"Mon profil"} onClick={() => {}} buttonLabel="Modifier">
      {/* Error State */}
      {error && <PageError page_error={error} />}

      {/* Loading State */}
      {loading && <Loading loading_sentence="Chargement du profil..." />}

      {/* Content State */}
      {!loading && profil && (
        <div className="space-y-6 p-6 h-full ">
          {/* Profile Header Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="flex flex-col gap-6 p-8">
              <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <ProfilePicture profile={profil} size="lg" />
                </div>

                {/* Basic Info */}
                <div className="flex-1 flex flex-col gap-2">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {profil.name} {profil.lastname}
                  </h2>
                  <p className="text-gray-400">
                    <a href={`mailto:${profil.email}`}>{profil.email}</a> - {profil.telephone}
                  </p>
                  <p className="text-[rgb(230,0,126)] font-semibold text-lg">
                    {profil.status}
                  </p>
                </div>
              </div>
              <hr className="border-1 border-gray-100"></hr>
              {/* Information Section */}
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-gray-400">Centre</p>
                  <p className="text-gray-900">{profil.center}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium text-gray-400">Ville</p>
                  <p className="text-gray-900">
                    {profil.city} ({profil.postal_code.slice(0, 2)})
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium text-gray-400">Bénévole depuis</p>
                  <p className="text-gray-900">
                    {new Date(profil.created_at).getFullYear()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="flex p-4 gap-4 text-gray-600 hover:bg-[var(--muted)] border-1 border-gray-100 cursor-pointer transition-colors">
              <Info />
              <span>Revoir le guide de démarrage</span>
            </div>
            <div className="flex p-4 gap-4 text-gray-600 hover:bg-[var(--muted)] border-1 border-gray-100 cursor-pointer transition-colors">
              <Settings />
              <span>Paramètres</span>
            </div>
            <button
              onClick={handleLogOut}
              className="flex p-4 gap-4 w-full text-red-600 hover:bg-red-100 cursor-pointer transition-colors"
            >
              <LogOut />
              <span>Se déconnecter</span>
            </button>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
