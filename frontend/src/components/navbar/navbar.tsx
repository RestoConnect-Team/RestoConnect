'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href ? 'border-b-2 border-[rgb(230,0,126)] text-[rgb(230,0,126)]' : 'text-gray-600 hover:text-gray-900';
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex gap-8">
        <Link href="/my_center" className={`text-sm font-medium transition-colors pb-2 ${isActive('/my_center')}`}>
          Mon centre 
        </Link>
        <Link
          href="/all_centers"
          className={`text-sm font-medium transition-colors pb-2 ${isActive('/all_centers')}`}
        >
          Les centres
        </Link>
        <Link
          href="/equipement"
          className={`text-sm font-medium transition-colors pb-2 ${isActive('/equipement')}`}
        >
          Liste du matériel
        </Link>
        <Link
          href="/vehicule"
          className={`text-sm font-medium transition-colors pb-2 ${isActive('/vehicule')}`}
        >
          Liste des véhicules
        </Link>
        <Link
          href="/profil"
          className={`text-sm font-medium transition-colors pb-2 ${isActive('/profil')}`}
        >
          Mon profil
        </Link>
      </div>
    </nav>
  );
}
