import { XCircle } from 'lucide-react';
import Loading from '@/components/loading/loading';

interface ScanFeedbackProps {
  isLoading: boolean;
  error: string;
  onRetry: () => void;
}

export function ScanFeedback({ isLoading, error, onRetry }: ScanFeedbackProps) {
  return (
    <>
      {/* Loading Overlay */}
      <div className={`absolute inset-0 z-30 bg-black/70 flex items-center justify-center p-4 transition-opacity ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <Loading loading_sentence="Lecture de l'étiquette..." />
      </div>

      {/* Error Overlay */}
      <div className={`absolute inset-0 z-30 bg-black/70 flex items-center justify-center p-4 transition-opacity ${error ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {error && (
          <div className="bg-red-900/80 border border-red-600 text-white p-6 rounded-2xl text-center max-w-sm w-full">
            <XCircle className="mx-auto mb-3 text-red-400" size={48} />
            <h3 className="text-xl font-bold mb-2">Erreur</h3>
            <p className="text-red-200 mb-6">{error}</p>
            <button onClick={onRetry} className="w-full bg-red-600/80 py-3 rounded-xl font-semibold hover:bg-red-500/80 transition-colors">
              Réessayer
            </button>
          </div>
        )}
      </div>
    </>
  );
}