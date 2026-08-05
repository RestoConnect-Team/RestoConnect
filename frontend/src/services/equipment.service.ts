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
}
