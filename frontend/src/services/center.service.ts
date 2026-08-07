import { ListCentersResponse } from "@/types/center";

export class CenterService {
  async fetchCentersList(): Promise<ListCentersResponse> {
    const response = await fetch("http://localhost:8000/api/list_centers", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Failed to fetch centers list");
    }

    return data as ListCentersResponse;
  }
}
