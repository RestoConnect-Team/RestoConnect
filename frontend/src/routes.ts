import {
  LayoutDashboard,
  Package,
  Truck,
  ClipboardList,
  Building2,
  Users,
  Bell,
  User,
} from "lucide-react";

// Roles autorisés par route. Si undefined = tous les rôles.
// Valeurs possibles = UserStatus (backend/app/enums/user_status_enum.py)
const ADMIN_ROLES = ["Super administrateur", "Administrateur"];

export const routes = [
  { href: "/my_center", label: "Mon tableau de bord", Icon: LayoutDashboard },
  { href: "/equipment", label: "Matériels", Icon: Package },
  { href: "/inventaires", label: "Inventaires", Icon: ClipboardList },
  { href: "/vehicule", label: "Véhicules", Icon: Truck },
  { href: "/all_centers", label: "Centres", Icon: Building2, roles: ADMIN_ROLES },
  { href: "/notifications", label: "Notifications", Icon: Bell, badge: true },
  { href: "/profil", label: "Mon profil", Icon: User },
];
