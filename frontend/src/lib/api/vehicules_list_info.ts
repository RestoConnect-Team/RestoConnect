export interface VehiculeItem {
  id: number;
  name: string;
  immatriculation: string | null;
  center_name: string | null;
  category: string | null;
  status: string | null;
}

export interface VehiculeData {
  vehicules_center: VehiculeItem[];
  vehicules_other: VehiculeItem[];
}

export const fetchVehiculeList = async (): Promise<VehiculeData> => {
  const response = await fetch("http://localhost:8000/api/list_vehicules", {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to fetch vehicules");
  }

  return data as VehiculeData;
};