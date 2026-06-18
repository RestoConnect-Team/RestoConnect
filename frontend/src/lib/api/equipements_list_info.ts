export interface EquipementItem {
  id: number;
  reference: string;
  name: string;
  categorie: string;
  quantity: number;
}

export const fetchEquipementList = async (): Promise<EquipementItem[]> => {
  const response = await fetch('http://localhost:8000/api/stock_list', {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'Failed to fetch equipements');
  }

  return data as EquipementItem[];
};