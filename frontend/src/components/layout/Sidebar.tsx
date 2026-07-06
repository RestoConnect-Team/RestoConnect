"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
LayoutDashboard, Package, Truck, ClipboardList, ScanLine,
  Building2, Users, Bell, User,
} from "lucide-react";
import { useFetchData } from "@/hooks/useFetchData";
import { fetchProfilInfo, Profile } from "@/lib/api/my_profil_info";
import { ProfilePicture } from "./ProfilePicture";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  { href: "/my_center",     label: "Mon tableau de bord", Icon: LayoutDashboard },
  { href: "/equipement",    label: "Matériels",           Icon: Package         },
  { href: "/inventaires",   label: "Inventaires",         Icon: ClipboardList   },
  { href: "/vehicule",      label: "Véhicules",           Icon: Truck           },
  { href: "/all_centers",   label: "Centres",             Icon: Building2       },
  { href: "/equipe",        label: "Équipe",              Icon: Users           },
  { href: "/notifications", label: "Notifications",       Icon: Bell, badge: true },
  { href: "/profil",        label: "Mon profil",          Icon: User            },
];

export function Sidebar({ unread = 0 }: { unread?: number }) {
  const pathname = usePathname();
  const { data: profile } = useFetchData<Profile>(fetchProfilInfo);

  const displayName = profile ? `${profile.name} ${profile.lastname}` : "";
  const role = profile?.status ?? "";
  const centerName = profile?.center ?? "Mon centre";
  const router = useRouter();

  return (
    <aside className="flex flex-col w-64 shrink-0 bg-[var(--sidebar)] border-r border-[var(--sidebar-border)] h-full overflow-hidden">
      {/* Logo */}
      <div className="px-4 py-3 border-b border-[var(--sidebar-border)]">
        <Image
          src="/Restos_du_coeur_Logo.svg"
          alt="Restos du Cœur"
          width={80}
          height={32}
          className="h-10 w-auto object-contain"
          priority
        />
        <div className="mt-2">
          <div className="text-[13px] font-semibold text-[var(--sidebar-foreground)] leading-none">
            RestoGestion
          </div>
          <div className="text-[11px] text-[var(--muted-foreground)] mt-0.5">
            {centerName}
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-0.5">
        {NAV_ITEMS.map(({ href, label, Icon, badge }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${
                active
                  ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)]"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--sidebar-foreground)]"
              }`}
            >
              <Icon
                size={18}
                className={
                  active
                    ? "text-[var(--sidebar-primary)]"
                    : "text-[var(--muted-foreground)]"
                }
              />
              <span className="flex-1">{label}</span>
              {badge && unread > 0 && (
                <span className="min-w-[20px] h-5 rounded-full bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)] text-[11px] font-bold flex items-center justify-center px-1.5">
                  {unread}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Scan Button */}
      <div className="px-3 py-3 mt-auto">
        <Link
          href="/scan"
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-[rgb(230,0,126)] text-white font-semibold rounded-2xl hover:opacity-90 transition-opacity text-center shadow-md hover:shadow-lg"
        >
          <ScanLine size={18} />
          <span>Scanner</span>
        </Link>
      </div>

      {/* User */}
      <div className="px-4 py-3 border-t border-[var(--sidebar-border)]">
        <div className="flex items-center gap-3">
          <ProfilePicture
            profile={profile}
            size={"sm"}
            onClick={() => router.push("/profil")}
          />
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-[var(--sidebar-foreground)] truncate">
              {displayName}
            </div>
            <div className="text-[11px] text-[var(--muted-foreground)] capitalize">
              {role}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
