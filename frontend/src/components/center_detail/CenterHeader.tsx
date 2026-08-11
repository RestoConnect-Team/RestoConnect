import { CenterDetails } from "@/types/center";
import { Building2, Download, Mail, MapPin, PenSquare } from "lucide-react";
import { Button } from "../ui/Button";

interface CenterHeaderProps {
  center: CenterDetails;
}
export function CenterHeader({ center }: CenterHeaderProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3">
      <div className="flex gap-3">
        <div className="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center">
          <Building2 size={25} className="text-[#cb006b]" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-[14px] font-bold text-gray-900">{center.name}</p>
          <p className="text-[12px] text-gray-500 flex gap-1">
            <MapPin className="w-4 h-4" /> {center.city}
          </p>
        </div>
      </div>
      <hr className="w-full" />
      <div className="flex gap-3">
        <Button variant="discreet">
          <Download className="w-4 h-4" />
          Exporter la fiche
        </Button>
        <Button variant="discreet">
          <Mail className="w-4 h-4" />
          Envoyer un mail
        </Button>
        <Button
          variant="discreet"
          className="!border-[#cb006b] !text-[#cb006b] hover:!bg-[#feecf5]"
        >
          <PenSquare className="w-4 h-4" />
          Modifier
        </Button>
      </div>
    </div>
  );
}
