export function ScannerOverlay() {
  return (
    <div className="pointer-events-none transition-opacity duration-300">
      <div className="w-60 h-60 relative mb-6">
        <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
        <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-white rounded-br-lg"></div>
        <div className="absolute top-1/2 left-0 right-0 h-px bg-[#cb006b]/80" style={{boxShadow: 'rgb(203, 0, 107) 0px 0px 8px'}}></div>
      </div>
      <p className="text-white/70 text-center text-sm">Pointez la caméra vers l'étiquette QR</p>
    </div>
  );
}