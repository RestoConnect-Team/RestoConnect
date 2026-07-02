import { FormEvent, useState } from 'react';
import { Search } from 'lucide-react';

interface ManualSearchProps {
  onSearch: (reference: string) => void;
}

export function ManualSearch({ onSearch }: ManualSearchProps) {
  const [manualReference, setManualReference] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (manualReference.trim()) {
      onSearch(manualReference.trim());
    }
  };

  if (!showInput) {
    return (
      <button onClick={() => setShowInput(true)} className="mt-4 text-sm text-center text-gray-400 hover:text-white transition-colors">
        Étiquette illisible ? Rechercher par référence
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex gap-2 w-full max-w-sm px-4">
      <input
        type="text"
        value={manualReference}
        onChange={(e) => setManualReference(e.target.value)}
        placeholder="Rechercher par référence"
        className="flex-grow bg-gray-800 border border-gray-600 rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[rgb(230,0,126)]"
        autoFocus
      />
      <button type="submit" className="flex items-center justify-center gap-2 px-6 py-3 bg-[rgb(230,0,126)] text-white font-semibold rounded-2xl hover:opacity-90 transition-opacity">
        <Search size={20} />
      </button>
    </form>
  );
}