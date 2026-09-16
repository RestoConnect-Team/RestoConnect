import { ListCentersResponse } from "@/types/center";
import { apiFetch } from "@/lib/api/client";

export class CenterService {
  async fetchCentersList(): Promise<ListCentersResponse> {
    return apiFetch<ListCentersResponse>("/api/list_centers");
  }
}
