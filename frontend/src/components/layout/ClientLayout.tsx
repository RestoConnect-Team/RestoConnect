"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileMenu } from "./MobileMenu";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname === "/") {
    return <>{children}</>;
  }

  return (
    <>
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex min-h-screen bg-[var(--background)]">
        {/* Desktop sidebar — hidden on mobile */}
        <div className="hidden lg:block shrink-0">
          <Sidebar />
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <Header onMenuOpen={() => setMobileOpen(true)} />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </>
  );
}
