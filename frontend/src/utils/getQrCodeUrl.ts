import { RefObject } from "react";

export const getQrCodeUrl = (qrCodeRef: RefObject<HTMLDivElement | null>) => {
  if (qrCodeRef.current) {
    const canvas = qrCodeRef.current.querySelector("canvas");
    if (canvas) {
      return canvas.toDataURL("image/png");
    }
  }
};
