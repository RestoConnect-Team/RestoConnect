import { useState, useEffect } from 'react';

interface UseFetchDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: string;
}

export const useFetchData = <T,>(
  fetchFn: () => Promise<T>
): UseFetchDataReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchFn();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, loading, error };
};