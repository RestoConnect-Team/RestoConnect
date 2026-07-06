import { X } from 'lucide-react';

interface ScanHeaderProps {
  onClose: () => void;
}

export function ScanHeader({ onClose }: ScanHeaderProps) {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
      <button onClick={onClose} className="p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors">
        <X size={24} />
      </button>
      <h1 className="text-lg font-bold">Scanner une étiquette</h1>
      <div className="w-10"></div> {/* Spacer */}
    </header>
  );
}