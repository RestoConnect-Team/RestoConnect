"use client";

import Link from "next/link";
import Image from "next/image";
import { X, LayoutDashboard, Package, Truck, ClipboardList, Building2, Users, Bell, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useFetchData } from "@/hooks/useFetchData";
import { fetchProfilInfo, Profile } from "@/lib/api/my_profil_info";

const NAV_ITEMS = [
  { href: "/my_center",     label: "Mon tableau de bord", Icon: LayoutDashboard, badge: false },
  { href: "/equipement",    label: "Materiels",           Icon: Package,         badge: false },
  { href: "/vehicule",      label: "Vehicules",           Icon: Truck,           badge: false },
  { href: "/inventaires",   label: "Inventaires",         Icon: ClipboardList,   badge: false },
  { href: "/all_centers",   label: "Centres",             Icon: Building2,       badge: false },
  { href: "/equipe",        label: "Equipe",              Icon: Users,           badge: false },
  { href: "/notifications", label: "Notifications",       Icon: Bell,            badge: true  },
  { href: "/profil",        label: "Mon profil",          Icon: User,            badge: false },
];

function getInitials(p: Profile | null) {
  if (!p) return "?";
  return `${p.name?.[0] ?? ""}${p.lastname?.[0] ?? ""}`.toUpperCase();
}

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  unread?: number;
}

export function MobileMenu({ open, onClose, unread = 0 }: MobileMenuProps) {
  const pathname = usePathname();
  const { data: profile } = useFetchData<Profile>(fetchProfilInfo);

  const displayName = profile ? `${profile.name} ${profile.lastname}` : "";
  const role = profile?.status ?? "";
  const initials = getInitials(profile);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 lg:hidden transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 lg:hidden transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full bg-[var(--sidebar)] shadow-xl">
        <div className="px-5 py-4 border-b border-[var(--sidebar-border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/Restos_du_coeur_Logo.svg" alt="Restos du Coeur" width={64} height={26} className="h-8 w-auto object-contain" priority />
            <span className="text-[14px] font-semibold text-[var(--sidebar-foreground)]">RestoGestion</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[var(--muted)]">
            <X size={18} className="text-[var(--muted-foreground)]" />
          </button>
        </div>
        <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-0.5">
          {NAV_ITEMS.map(({ href, label, Icon, badge }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} onClick={onClose}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-[15px] font-medium transition-colors ${active ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)]" : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"}`}
              >
                <Icon size={20} className={active ? "text-[var(--sidebar-primary)]" : "text-[var(--muted-foreground)]"} />
                <span className="flex-1">{label}</span>
                {badge && unread > 0 && (
                  <span className="ml-auto min-w-[20px] h-5 rounded-full bg-[var(--primary)] text-white text-[11px] font-bold flex items-center justify-center px-1.5">{unread}</span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="px-4 py-3 border-t border-[var(--sidebar-border)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[var(--sidebar-accent)] flex items-center justify-center shrink-0">
              <span className="text-[var(--sidebar-primary)] font-semibold text-sm">{initials}</span>
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-[var(--sidebar-foreground)] truncate">{displayName}</div>
              <div className="text-[11px] text-[var(--muted-foreground)] capitalize">{role}</div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}