export class InventoryService {
  async getInventoriesList(): Promise<any[]> {
    const response = await fetch("http://localhost:8000/api/list_inventories", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Failed to fetch inventories");
    }

    return data as any[]; //TODO : type
  }
}
