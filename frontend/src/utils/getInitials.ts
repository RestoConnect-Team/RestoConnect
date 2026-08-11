import { ContactInfo } from "@/lib/api/center_detail_info";
import { Profile } from "@/lib/api/my_profil_info";

export function getInitials(p: Profile | ContactInfo | null) {
  if (!p) return "?";
  return `${p.name?.[0] ?? ""}${p.lastname?.[0] ?? ""}`.toUpperCase();
}
