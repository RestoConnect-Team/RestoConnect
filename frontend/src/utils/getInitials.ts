import { Profile } from "@/lib/api/my_profil_info";

export function getInitials(p: Profile | null) {
  if (!p) return "?";
  return `${p.name?.[0] ?? ""}${p.lastname?.[0] ?? ""}`.toUpperCase();
}
