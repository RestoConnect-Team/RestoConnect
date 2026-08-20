import { CenterDetails } from "@/types/center";
import { apiFetch } from "./client";

export interface TimeSlot {
  opening_time: string;
  closing_time: string;
}

export interface WeeklySchedule {
  schedule: Record<string, TimeSlot[]>;
}

export interface ContactInfo {
  id: number;
  name: string;
  lastname: string;
  email: string | null;
  telephone: string | null;
  status: string;
  photo_url: string | null;
}

export interface CenterAlert {
  alert_type: string;
  message: string;
  time_ago: string;
}

export interface ClosingPeriod {
  id?: number;
  start_date: string;
  end_date: string;
}

export const fetchCenterDetail =
  (id: number) => async (): Promise<CenterDetails> => {
    return apiFetch<CenterDetails>(`/api/center/${id}`);
  };

export const fetchMyCenterDetail = async (): Promise<CenterDetails> => {
  return apiFetch<CenterDetails>("/api/my_center");
};

export interface UpdateCenterPayload {
  telephone?: string;
  email?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  description?: string;
  activities?: string;
  schedule?: Record<string, { opening_time: string; closing_time: string }[]>;
  closing_periods?: ClosingPeriod[];
  headmaster_firstname?: string;
  headmaster_lastname?: string;
  headmaster_telephone?: string;
  headmaster_email?: string;
}

export const updateCenter = async (
  id: number,
  payload: UpdateCenterPayload,
): Promise<void> => {
  await apiFetch(`/api/center/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};
