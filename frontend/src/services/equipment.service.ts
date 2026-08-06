import { EquipmentItem } from "@/types/equipment";

export class EquipmentService {
  async deleteEquipment(equipmentId: number): Promise<void> {
    const response = await fetch(
      "http://localhost:8000/api/stock/" + equipmentId,
      {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to delete equipment with id : " + equipmentId);
    }
  }

  async fetchEquipmentList(): Promise<EquipmentItem[]> {
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
  }
}
