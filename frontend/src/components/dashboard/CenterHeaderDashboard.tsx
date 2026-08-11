import { CenterDetails } from "@/types/center";
import { Home, MapPin } from "lucide-react";

interface CenterHeaderDashboardProps {
  center: CenterDetails;
}

export function CenterHeaderDashboard({ center }: CenterHeaderDashboardProps) {
  return (
    <div className="rounded-t-xl bg-gradient-to-r from-[rgb(230,0,126)] to-[rgb(200,0,100)] p-5 overflow-hidden">
      <p className="text-[10px] font-bold text-white/80 tracking-widest uppercase mb-1">
        Mon centre
      </p>
      <h1 className="text-[22px] font-bold text-white leading-tight">
        {center.name}
      </h1>
      <div className="flex items-center gap-1 mt-1 text-white/80 text-[13px]">
        <MapPin size={12} />
        <span>{center.city}</span>
      </div>
      <div className="absolute top-4 right-4 w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
        <Home size={18} className="text-white" />
      </div>
    </div>
  );
}
