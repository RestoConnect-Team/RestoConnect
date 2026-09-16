import { ListCentersResponse } from "@/types/center";
import { apiFetch } from "@/lib/api/client";

export class CenterService {
  async fetchCentersList(): Promise<ListCentersResponse> {
    return apiFetch<ListCentersResponse>("/api/list_centers");
  }

  async exportCenters(centerIds: number[]): Promise<void> {
    const response = await fetch("http://localhost:8000/api/center/export", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ center_ids: centerIds }),
    });
    if (!response.ok) {
      throw new Error("Export impossible");
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "centres.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
}
