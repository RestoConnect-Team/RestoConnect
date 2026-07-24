import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "../ui/button";
import { Download } from "lucide-react";
import { EquipmentItem } from "@/lib/api/equipements_list_info";

type QrCodeModalsProps = {
  equipment: EquipmentItem;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handleDownloadQrCode: () => void;
};

export default function QrCodeModal({
  equipment,
  isOpen,
  setIsOpen,
  handleDownloadQrCode,
}: QrCodeModalsProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>QR Code pour {equipment.name}</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center p-4">
          {equipment.reference && (
            <QRCodeCanvas
              value={equipment.reference}
              size={256}
              level="H"
              imageSettings={{
                src: "null",
                x: undefined,
                y: undefined,
                height: 0,
                width: 0,
                excavate: false,
              }}
            />
          )}
        </div>
        <div className="flex justify-center gap-2">
          {equipment.reference && (
            <Button onClick={handleDownloadQrCode}>
              <Download size={16} /> Télécharger
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
