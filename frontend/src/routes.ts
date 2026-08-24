import {
  LayoutDashboard,
  Package,
  Truck,
  ClipboardList,
  Building2,
  Bell,
  User,
} from "lucide-react";

export const routes = [
  { href: "/my_center", label: "Mon tableau de bord", Icon: LayoutDashboard },
  { href: "/equipment", label: "Matériels", Icon: Package },
  { href: "/inventaires", label: "Inventaires", Icon: ClipboardList },
  { href: "/vehicule", label: "Véhicules", Icon: Truck },
  { href: "/all_centers", label: "Centres", Icon: Building2 },
  { href: "/notifications", label: "Notifications", Icon: Bell, badge: true },
  { href: "/profil", label: "Mon profil", Icon: User },
];
