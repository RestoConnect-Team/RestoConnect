"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (pathname === "/") return <>{children}</>;

  return (
    <>
      {/* Mobile sidebar - hidden on large screens */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 lg:hidden transition-opacity duration-300 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMobileOpen(false)}
      />
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 lg:hidden transition-transform duration-300 ease-in-out ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Sidebar isMobile={true} onClose={() => setMobileOpen(false)} />
      </div>

      {/* Desktop sidebar — hidden on mobile */}
      <div className="flex h-screen overflow-hidden bg-[var(--background)]">
        <div className="hidden lg:block shrink-0 h-full">
          <Sidebar />
        </div>

        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          <Header onMenuOpen={() => setMobileOpen(true)} />
          {children}
          {pathname === "/scan" && (
            <div className="fixed inset-0 z-50">{children}</div>
          )}
        </div>
      </div>
    </>
  );
}
