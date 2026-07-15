"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ScanLine, LogOut, X } from "lucide-react";
import { useFetchData } from "@/hooks/useFetchData";
import { fetchProfilInfo, Profile } from "@/lib/api/my_profil_info";
import { routes } from "@/routes";
import { AuthService } from "@/services/auth.service";

interface SidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
  unread?: number;
}

export function Sidebar({
  unread = 0,
  isMobile = false,
  onClose,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: profile } = useFetchData<Profile>(fetchProfilInfo);

  const centerName = profile?.center ?? "Mon centre";

  const authService = new AuthService();

  const handleLogOut = async () => {
    try {
      await authService.logOut();
      router.push("/");
    } catch (error) {
      throw error;
    }
  };

  return (
    <aside className="flex flex-col w-64 shrink-0 bg-[var(--sidebar)] border-r border-[var(--sidebar-border)] h-full overflow-hidden">
      {/* Logo */}
      <div className="px-4 py-3 border-b border-[var(--sidebar-border)]">
        {isMobile ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/Restos_du_coeur_Logo.svg"
                alt="Restos du Coeur"
                width={64}
                height={26}
                className="h-8 w-auto object-contain"
                priority
              />
              <span className="text-[14px] font-semibold text-[var(--sidebar-foreground)]">
                RestoGestion
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[var(--muted)] cursor-pointer"
            >
              <X size={18} className="text-[var(--muted-foreground)]" />
            </button>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-0.5">
        {routes.map(({ href, label, Icon, badge }) => {
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

        {/* Scan Button */}
        <div className="py-3">
          <Link
            href="/scan"
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-[rgb(230,0,126)] text-white font-semibold rounded-2xl hover:opacity-90 transition-opacity text-center shadow-md hover:shadow-lg"
          >
            <ScanLine size={18} />
            <span>Scanner</span>
          </Link>
        </div>
      </nav>

      {/* User */}
      <div className="border-t border-[var(--sidebar-border)]">
        <div
          className="flex gap-4 px-4 py-3 text-[var(--muted-foreground)] 
          text-sm hover:bg-red-100 hover:text-red-600 cursor-pointer 
          transition-colors items-center"
          onClick={handleLogOut}
        >
          <LogOut size={18} />
          <span>Se déconnecter</span>
        </div>
      </div>
    </aside>
  );
}
