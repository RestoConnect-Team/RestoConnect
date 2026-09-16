import { apiFetch } from "./client";

export type VehiculeAlertLevel = "expired" | "will_expire_soon";

export interface VehiculeAlert {
  level: VehiculeAlertLevel;
  name: string;
  description: string | null;
  expire_date: string;
  expired_since: number | null;
  will_expire_in: number | null;
}

export interface VehiculeDocument {
  id: number;
  file_name: string;
  description: string | null;
  upload_date: string | null;
  file_date: string | null;
  expiration_date: string | null;
  file_url: string | null;
}

export interface VehiculeInfos {
  id: number;
  name: string;
  immatriculation: string;
  category: string;
  status: string;
  nb_km: number;
  last_technical_inspection_date: string | null;
  next_technical_inspection_date: string | null;
  last_service_date: string | null;
  next_service_date: string | null;
  center_name: string;
  responsable_name: string | null;
  responsable_lastname: string | null;
  responsable_email: string | null;
  responsable_phone: string | null;
}

export interface VehiculeDetailResponse {
  vehicule: VehiculeInfos;
  documents: VehiculeDocument[];
  document_alertes: VehiculeAlert[];
  technical_inspection_alerte: VehiculeAlert | null;
}

export const fetchVehiculeInfos = async (
  vehiculeId: number
): Promise<VehiculeDetailResponse> => {
  if (Number.isNaN(vehiculeId)) {
    throw new Error("Véhicule invalide");
  }

  return apiFetch<VehiculeDetailResponse>(`/api/vehicule/${vehiculeId}`);
};
