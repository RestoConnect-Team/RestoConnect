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

import { apiFetch } from "./client";

export const fetchVehiculeList = async (): Promise<VehiculeData> => {
  return apiFetch<VehiculeData>("/api/list_vehicules");
};