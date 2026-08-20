import { Info, Truck, MapPin } from "lucide-react";

export interface EquipmentHistoryItem {
  event_type: string;
  details: string;
  stock_date: string;
  user_name: string;
}

interface EquipmentDetailHistoryProps {
  history: EquipmentHistoryItem[];
  lastScanDate?: string;
}

export function EquipmentDetailHistory({
  history,
  lastScanDate,
}: EquipmentDetailHistoryProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 ">
      <h2 className="text-[15px] font-semibold text-gray-900 mb-3">
        Historique
      </h2>
      {lastScanDate && (
        <div className="text-[13px] text-gray-500 bg-[#EAF5FA] border border-[#75BDD5] rounded-lg p-3 mb-3 flex items-center gap-2">
          <Info size={14} className="text-[#1A6A82] shrink-0" />
          Vu pour la dernière fois lors de l'inventaire du{" "}
          {new Date(lastScanDate).toLocaleDateString()}
        </div>
      )}
      <div className="space-y-3">
        {history.length > 0 ? (
          history.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-[#fce4f0]">
                {/* Icon based on event_type, using a default for now */}
                {item.event_type === "TRANSFER_RECEIVED" ? (
                  <Truck size={13} className="text-[#cb006b]" />
                ) : (
                  <MapPin size={13} className="text-gray-400" />
                )}
              </div>
              <div>
                <div className="text-[13px] font-medium text-gray-800">
                  {item.event_type}
                </div>
                <div className="text-[12px] text-gray-400">
                  {item.details} ·{" "}
                  {new Date(item.stock_date).toLocaleDateString()} · par{" "}
                  {item.user_name}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">
            Aucun historique disponible pour ce produit.
          </p>
        )}
      </div>
    </div>
  );
}
