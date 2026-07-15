"use client";

import { useRef, useEffect, useState } from "react";
import { Download, Printer, Maximize } from "lucide-react"; // Removed X import as DialogContent handles its own close button
import { Button } from "@/components/ui/button";
import { QRCodeCanvas } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // Import Dialog components

interface ProductDetailQrCodeProps {
  productReference: string;
  productName: string;
}

export function ProductDetailQrCode({
  productReference,
  productName,
}: ProductDetailQrCodeProps) {
  const qrCodeRef = useRef<HTMLDivElement>(null); // Ref for the main view's QR code
  const enlargedQrCodeRef = useRef<HTMLDivElement>(null); // Ref for the modal's QR code
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null); // Data URL for the main view's QR code

  // Effect to get the data URL of the generated QR code
  useEffect(() => {
    if (qrCodeRef.current) {
      const canvas = qrCodeRef.current.querySelector("canvas");
      if (canvas) {
        setQrCodeDataUrl(canvas.toDataURL("image/png"));
      }
    }
  }, [productReference]); // Dependency array ensures effect runs when productReference changes

  const [isEnlargeModalOpen, setIsEnlargeModalOpen] = useState(false); // State to control modal visibility

  const handleDownloadQrCode = () => {
    if (qrCodeDataUrl) {
      // This downloads the 160px version
      const link = document.createElement("a");
      link.href = qrCodeDataUrl;
      link.download = `qrcode-${productReference}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePrintQrCode = () => {
    // This will print the 160px version, as it uses qrCodeDataUrl
    if (qrCodeDataUrl) {
      const link = document.createElement("a");
      link.href = qrCodeDataUrl;
      link.download = `qrcode-${productReference}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Imprimer QR Code - ${productReference}</title>
              <style>
                body { font-family: sans-serif; text-align: center; margin: 20px; }
                img { max-width: 100%; height: auto; display: block; margin: 0 auto; border: 1px solid #ccc; padding: 10px; }
                h1 { margin-top: 20px; }
              </style>
            </head>
            <body>
              <h1>QR Code pour ${productName} (${productReference})</h1>
              <img src="${qrCodeDataUrl}" alt="QR Code" />
              <script>
                window.onload = function() {
                  window.print();
                  window.onafterprint = function() {
                    window.close();
                  };
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  const handleEnlargeQrCode = () => {
    setIsEnlargeModalOpen(true); // Open the modal instead of a new tab
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
      <h2 className="text-[15px] font-semibold text-gray-900 mb-3">
        Étiquette QR
      </h2>
      <div className="flex items-start gap-5 flex-wrap">
        {productReference ? ( // Check if productReference exists to render QR code
          <>
            <div
              ref={qrCodeRef}
              className="border border-gray-200 rounded-xl p-3 bg-gray-50 cursor-pointer hover:border-[#cb006b]/40 transition-colors"
            >
              <QRCodeCanvas
                value={productReference}
                size={160}
                level="H"
                imageSettings={{
                  src: "",
                  x: undefined,
                  y: undefined,
                  height: 0,
                  width: 0,
                  excavate: false,
                }} // No logo in the middle
              />
            </div>
            <div className="space-y-2 pt-1">
              <p className="text-[12px] text-gray-400 font-mono">
                {productName.substring(0, 4)} · {productReference}
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
      {/* Enlarge QR Code Modal */}
      <Dialog open={isEnlargeModalOpen} onOpenChange={setIsEnlargeModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>QR Code pour {productName}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center p-4" ref={enlargedQrCodeRef}>
            {productReference && (
              <QRCodeCanvas
                value={productReference}
                size={256} // Larger size for the modal
                level="H"
                imageSettings={{
                  src: "",
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
            <Button onClick={() => setIsEnlargeModalOpen(false)}>Fermer</Button>
            {productReference && ( // Only show download if reference exists
              <Button onClick={handleDownloadQrCode}>
                <Download size={14} className="mr-2" /> Télécharger
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
