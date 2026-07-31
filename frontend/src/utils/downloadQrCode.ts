export const downloadQrCode = (
  qrCodeDataUrl: string | null,
  reference: string,
) => {
  if (qrCodeDataUrl) {
    // This downloads the 160px version
    const link = document.createElement("a");
    link.href = qrCodeDataUrl;
    link.download = `qrcode-${reference}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
