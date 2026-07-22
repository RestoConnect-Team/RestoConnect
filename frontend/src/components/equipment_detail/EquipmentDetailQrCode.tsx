"use client";

import { useRef, useEffect, useState } from "react";
import { Download, Printer, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QRCodeCanvas } from "qrcode.react";
import { useReactToPrint } from "react-to-print";
import QrCodeModal from "@/components/equipment_detail/QrCodeModal";

interface EquipmentDetailQrCodeProps {
  equipmentReference: string;
  equipmentName: string;
}

export function EquipmentDetailQrCode({
  equipmentReference,
  equipmentName,
}: EquipmentDetailQrCodeProps) {
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  // Effect to get the data URL of the generated QR code
  useEffect(() => {
    if (qrCodeRef.current) {
      const canvas = qrCodeRef.current.querySelector("canvas");
      if (canvas) {
        setQrCodeDataUrl(canvas.toDataURL("image/png"));
      }
    }
  }, [equipmentReference]);

  const [isEnlargeModalOpen, setIsEnlargeModalOpen] = useState(false);

  const handleDownloadQrCode = () => {
    if (qrCodeDataUrl) {
      // This downloads the 160px version
      const link = document.createElement("a");
      link.href = qrCodeDataUrl;
      link.download = `qrcode-${equipmentReference}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

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
        {equipmentReference ? (
          <>
            <div
              ref={qrCodeRef}
              className="border border-gray-200 rounded-xl p-3 bg-gray-50 cursor-pointer hover:border-[#cb006b]/40 transition-colors"
            >
              <QRCodeCanvas
                value={equipmentReference}
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
                {equipmentName.substring(0, 4)} · {equipmentReference}
              </p>
              <Button
                onClick={handleEnlargeQrCode}
                variant="outline"
                className="flex items-center gap-2 h-9 px-3 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 w-full justify-start"
              >
                <Maximize size={14} /> Agrandir
              </Button>
              <Button
                onClick={handleDownloadQrCode}
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
        equipmentName={equipmentName}
        equipmentReference={equipmentReference}
        isOpen={isEnlargeModalOpen}
        setIsOpen={setIsEnlargeModalOpen}
        handleDownloadQrCode={handleDownloadQrCode}
      />

      {/* QrCode for printing */}
      <div className="hidden">
        <div
          className="flex items-center justify-center flex-col gap-10 mt-10"
          ref={contentRef}
        >
          <h1 className="text-3xl">
            QR Code pour {equipmentName} ({equipmentReference})
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
