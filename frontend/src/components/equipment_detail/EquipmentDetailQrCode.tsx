"use client";

import { useRef, useEffect, useState } from "react";
import { Download, Printer, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QRCodeCanvas } from "qrcode.react";
import { useReactToPrint } from "react-to-print";
import QrCodeModal from "@/components/equipment_detail/QrCodeModal";
import { downloadQrCode } from "@/utils/downloadQrCode";
import { getQrCodeUrl } from "@/utils/getQrCodeUrl";
import { EquipmentItem } from "@/lib/api/equipements_list_info";

interface EquipmentDetailQrCodeProps {
  equipment: EquipmentItem;
}

export function EquipmentDetailQrCode({
  equipment,
}: EquipmentDetailQrCodeProps) {
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  // Effect to get the data URL of the generated QR code
  useEffect(() => {
    const url = getQrCodeUrl(qrCodeRef) ?? null;
    setQrCodeDataUrl(url);
  }, [equipment.reference]);

  const [isEnlargeModalOpen, setIsEnlargeModalOpen] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const handlePrintQrCode = () => {
    if (qrCodeDataUrl) {
      reactToPrintFn();
    }
  };

  const handleEnlargeQrCode = () => {
    setIsEnlargeModalOpen(true);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
      <h2 className="text-[15px] font-semibold text-gray-900 mb-3">
        Étiquette QR
      </h2>
      <div className="flex items-start gap-5 flex-wrap">
        {equipment.reference ? (
          <>
            <div
              ref={qrCodeRef}
              className="border border-gray-200 rounded-xl p-3 bg-gray-50 cursor-pointer hover:border-[#cb006b]/40 transition-colors"
            >
              <QRCodeCanvas
                value={equipment.reference}
                size={160}
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
            </div>
            <div className="space-y-2 pt-1">
              <p className="text-[12px] text-gray-400 font-mono">
                {equipment.name.substring(0, 4)} · {equipment.reference}
              </p>
              <Button
                onClick={handleEnlargeQrCode}
                variant="outline"
                className="flex items-center gap-2 h-9 px-3 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 w-full justify-start"
              >
                <Maximize size={14} /> Agrandir
              </Button>
              <Button
                onClick={() =>
                  downloadQrCode(qrCodeDataUrl, equipment.reference)
                }
                variant="outline"
                className="flex items-center gap-2 h-9 px-3 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 w-full justify-start"
              >
                <Download size={14} /> Télécharger
              </Button>
              <Button
                onClick={handlePrintQrCode}
                variant="outline"
                className="flex items-center gap-2 h-9 px-3 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 w-full justify-start"
              >
                <Printer size={14} /> Imprimer
              </Button>
            </div>
          </>
        ) : (
          <p className="text-gray-500">QR Code non disponible.</p>
        )}
      </div>
      <QrCodeModal
        equipment={equipment}
        isOpen={isEnlargeModalOpen}
        setIsOpen={setIsEnlargeModalOpen}
        handleDownloadQrCode={() =>
          downloadQrCode(qrCodeDataUrl, equipment.reference)
        }
      />

      {/* QrCode for printing */}
      <div className="hidden">
        <div
          className="flex items-center justify-center flex-col gap-10 mt-10"
          ref={contentRef}
        >
          <h1 className="text-3xl">
            QR Code pour {equipment.name} ({equipment.reference})
          </h1>
          {qrCodeDataUrl ? (
            <img src={qrCodeDataUrl} alt="QR Code" />
          ) : (
            <p className="text-gray-500">QR Code non disponible.</p>
          )}
        </div>
      </div>
    </div>
  );
}
