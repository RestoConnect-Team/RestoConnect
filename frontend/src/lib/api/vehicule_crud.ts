import { apiFetch } from "./client";

export interface VehiculePayload {
  name: string;
  immatriculation: string;
  category: string;
  status: string;
  nb_km?: number;
}

export const createVehicule = async (
  payload: VehiculePayload,
): Promise<unknown> => {
  return apiFetch("/api/vehicule", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updateVehicule = async (
  id: number,
  payload: Partial<VehiculePayload>,
): Promise<unknown> => {
  return apiFetch(`/api/vehicule/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};
