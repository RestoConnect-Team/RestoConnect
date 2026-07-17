export interface EquipmentItem {
  id: number;
  reference: string;
  name: string;
  category: string;
  status: string;
  qr_code: string;
}

export const fetchEquipmentList = async (): Promise<EquipmentItem[]> => {
  const response = await fetch("http://localhost:8000/api/stock_list", {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to fetch equipments");
  }

  return data as EquipmentItem[];
};
