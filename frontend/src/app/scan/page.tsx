'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useZxing } from 'react-zxing';
import { ProductInfoFooter } from '@/components/scan/ProductInfoFooter';
import { StockStatus } from './stock_status_enum';
import { ScanHeader } from '@/components/scan/ScanHeader';
import { ScannerOverlay } from '@/components/scan/ScannerOverlay';
import { ManualSearch } from '@/components/scan/ManualSearch';
import { ScanFeedback } from '@/components/scan/ScanFeedback';

interface Product {
  id: number;
  name: string;
  reference: string;
  status: StockStatus;
  center_name: string;
}

export default function ScanQrPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scanned, setScanned] = useState(false);
  const router = useRouter();

  const handleScanResult = async (reference: string) => {
    if (loading || scanned) return;

    setScanned(true);
    setLoading(true);
    setError('');
    setProduct(null);

    try {
      const response = await fetch(
        `http://localhost:8000/api/stock/scan?reference=${reference}`,
        { credentials: 'include' }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.detail || 'Produit non trouvé';

        // Si l'étiquette n'est pas reconnue, on affiche le footer en mode erreur.
        if (response.status === 404 || errorMessage.includes('non trouvé')) {
          setProduct({
            id: -1, 
            name: 'Étiquette non reconnue',
            reference: `Référence scannée : ${reference}`,
            status: StockStatus.ERROR,
            center_name: '', 
          });
          return;
        }
        throw new Error(errorMessage);
      }

      const data: Product = await response.json();

      // Si le produit est scanné et qu'il était considéré comme "perdu",
      // on met à jour son statut en "disponible" dans la BDD et dans l'état local.
      if (data.status === StockStatus.LOST) {
        await updateStatus(data.id, StockStatus.DISPONIBLE);
        setProduct({ ...data, status: StockStatus.DISPONIBLE });
      } else {
        setProduct(data);
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de la recherche.');
      setTimeout(() => setScanned(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (productId: number, newStatus: Product['status']) => {
    try {
      const response = await fetch(`http://localhost:8000/api/stock/${productId}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('La mise à jour du statut a échoué.');
      }

    } catch (err: any) {
      console.error("Erreur lors de la mise à jour du statut:", err);
      setError(err.message || 'Erreur lors de la mise à jour.');
    }
  };

  const handleNewScan = () => {
    setProduct(null);
    setError('');
    setScanned(false);
  };

  const { ref } = useZxing({
    constraints: {
      video: {
        facingMode: 'environment',
      },
    },
    onDecodeResult(result) {
      handleScanResult(result.rawValue);
    },
    paused: scanned,
  });

  return (
      <div className="fixed inset-0 bg-gray-900 text-white flex flex-col z-50">
        <ScanHeader onClose={() => router.back()} />

        {/* Camera View */}
        <div className="relative flex-1 overflow-hidden">
          <video ref={ref} className="absolute top-0 left-0 w-full h-full object-cover" />
          
          <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-300 ease-in-out ${product ? 'pb-40' : 'pb-0'}`}>
            <ScannerOverlay />
            <ManualSearch onSearch={handleScanResult} />
          </div>
        </div>

        <ScanFeedback isLoading={loading} error={error} onRetry={handleNewScan} />

        {/* Product Info Footer */}
        {product && (
          <div className="absolute bottom-0 left-0 right-0 z-20">
            <ProductInfoFooter 
              product={product}
              onNewScan={handleNewScan}
              onViewDetails={() => router.push(`/details_product/${product.id}`)}
            />
          </div>
        )}
      </div>
  );
}