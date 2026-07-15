"use client";

import { MapPin, WifiOff, Bell, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFetchData } from "@/hooks/useFetchData";
import { fetchProfilInfo, Profile } from "@/lib/api/my_profil_info";
import { ProfilePicture } from "./ProfilePicture";

interface HeaderProps {
  isOffline?: boolean;
  unread?: number;
  onMenuOpen: () => void;
}

export function Header({
  isOffline = false,
  unread = 0,
  onMenuOpen,
}: HeaderProps) {
  const router = useRouter();
  const { data: profile } = useFetchData<Profile>(fetchProfilInfo);

  const centerName = profile?.center ?? "Mon centre";

  return (
    <header className="bg-[var(--card)]/95 backdrop-blur border-b border-[var(--border)] px-4 lg:px-6 h-14 flex items-center gap-3 sticky top-0 z-30 shrink-0">
      <button
        onClick={onMenuOpen}
        className="cursor-pointer lg:hidden p-2 -ml-2 rounded-lg hover:bg-[var(--muted)]"
      >
        <Menu size={20} className="text-[var(--muted-foreground)]" />
      </button>
      <div className="flex-1 hidden sm:flex items-center justify-center">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--secondary)] border border-[var(--border)]">
          <MapPin size={12} className="text-[var(--primary)]" />
          <span className="text-[13px] font-medium text-[var(--foreground)]">
            {centerName}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 ml-auto">
        {isOffline && (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 border border-red-200">
            <WifiOff size={12} className="text-red-600" />
            <span className="text-[12px] font-medium text-red-700">
              Hors connexion
            </span>
          </div>
        )}
        <button
          onClick={() => router.push("/notifications")}
          className="relative w-9 h-9 rounded-lg hover:bg-[var(--muted)] flex items-center justify-center"
        >
          <Bell size={18} className="text-[var(--muted-foreground)]" />
          {unread > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--primary)]" />
          )}
        </button>
        <ProfilePicture
          profile={profile ?? null}
          size="sm"
          onClick={() => router.push("/profil")}
        />
      </div>
    </header>
  );
}
