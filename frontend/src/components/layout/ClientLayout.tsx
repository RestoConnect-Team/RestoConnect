"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileMenu } from "./MobileMenu";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (pathname === "/") return <>{children}</>;

  return (
    <>
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex h-screen overflow-hidden bg-[var(--background)]">
        {/* Desktop sidebar — hidden on mobile */}
        <div className="hidden lg:block shrink-0 h-full">
          <Sidebar />
        </div>

        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          <Header onMenuOpen={() => setMobileOpen(true)} />
          <main className="flex-1 overflow-y-auto">{children}</main>
          {pathname === "/scan" && (
            <div className="fixed inset-0 z-50">{children}</div>
          )}
        </div>
      </div>
    </>
  );
}
