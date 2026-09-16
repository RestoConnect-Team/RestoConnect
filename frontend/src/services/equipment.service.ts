import { EquipmentItem } from "@/types/equipment";
import { apiFetch } from "@/lib/api/client";

export class EquipmentService {
  async deleteEquipment(equipmentId: number): Promise<void> {
    await apiFetch(`/api/stock/${equipmentId}`, { method: "DELETE" });
  }

  async fetchEquipmentList(): Promise<EquipmentItem[]> {
    return apiFetch<EquipmentItem[]>("/api/stock_list");
  }
}
