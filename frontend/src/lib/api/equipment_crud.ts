import { apiFetch } from "./client";
import { EquipmentItem } from "@/types/equipment";

export interface EquipmentPayload {
  name: string;
  category: string;
  reference: string;
  description?: string;
}

export const createEquipment = async (
  payload: EquipmentPayload,
): Promise<EquipmentItem> => {
  return apiFetch<EquipmentItem>("/api/stock", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updateEquipment = async (
  id: number,
  payload: Partial<EquipmentPayload>,
): Promise<EquipmentItem> => {
  return apiFetch<EquipmentItem>(`/api/stock/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};
