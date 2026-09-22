import { Center } from "@/types/center";
import { Building2, MapPin, Package, Users } from "lucide-react";
import Link from "next/link";

export function CenterCard({
  center,
  user_center,
}: {
  center: Center;
  user_center?: Center;
}) {
  const isUserCenter = center.center_id === user_center?.center_id;

  return (
    <Link
      href={`/all_centers/${center.center_id}`}
      className="block bg-white rounded-xl border border-gray-200 p-4 relative hover:shadow-md hover:border-[#cb006b] transition-all"
    >
      {isUserCenter && (
        <span className="absolute top-3 right-3 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-pink-100 text-[#cb006b]">
          Mon centre
        </span>
      )}
      <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center mb-3">
        <Building2 size={20} className="text-[#cb006b]" />
      </div>
      <p className="text-[14px] font-semibold text-gray-900 leading-snug mb-1 pr-16">
        {center.name}
      </p>
      <div className="flex items-center gap-1 text-[12px] text-gray-500 mb-3">
        <MapPin size={11} className="shrink-0" />
        <span>{center.city}</span>
      </div>
      <div className="flex items-center gap-4 "></div>
    </Link>
  );
}
