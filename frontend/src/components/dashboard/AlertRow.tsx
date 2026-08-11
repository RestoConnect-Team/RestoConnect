import { CenterAlert } from "@/lib/api/center_detail_info";
import { Package, ClipboardList, AlertTriangle } from "lucide-react";

export function AlertRow({ alert, idx }: { alert: CenterAlert; idx: number }) {
  const icons: Record<string, React.ReactNode> = {
    missing_stock: <Package size={16} className="text-[rgb(230,0,126)]" />,
    inventory: <ClipboardList size={16} className="text-[rgb(230,0,126)]" />,
    info: <AlertTriangle size={16} className="text-amber-500" />,
  };
  const icon = icons[alert.alert_type] ?? icons.info;
  return (
    <div
      className={`flex items-start gap-3 py-3 ${idx > 0 ? "border-t border-gray-100" : ""}`}
    >
      <div className="w-7 h-7 rounded-full bg-pink-50 flex items-center justify-center shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] text-gray-800 leading-snug">
          {alert.message}
        </p>
        <p className="text-[11px] text-gray-400 mt-0.5">{alert.time_ago}</p>
      </div>
      <span className="w-2 h-2 rounded-full bg-[rgb(230,0,126)] shrink-0 mt-1.5" />
    </div>
  );
}
