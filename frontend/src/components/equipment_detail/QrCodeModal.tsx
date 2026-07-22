import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "../ui/button";
import { Download } from "lucide-react";

type QrCodeModalsProps = {
  equipmentName: string;
  equipmentReference: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handleDownloadQrCode: () => void;
};

export default function QrCodeModal({
  equipmentName,
  equipmentReference,
  isOpen,
  setIsOpen,
  handleDownloadQrCode,
}: QrCodeModalsProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>QR Code pour {equipmentName}</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center p-4">
          {equipmentReference && (
            <QRCodeCanvas
              value={equipmentReference}
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
        <div className="flex justify-end gap-2">
          {equipmentReference && (
            <Button onClick={handleDownloadQrCode}>
              <Download size={16} /> Télécharger
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
