import { CenterDetails } from "@/types/center";

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
    const response = await fetch(`http://localhost:8000/api/center/${id}`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.detail || "Failed to fetch center details");
    return data as CenterDetails;
  };

export const fetchMyCenterDetail = async (): Promise<CenterDetails> => {
  const response = await fetch("http://localhost:8000/api/my_center", {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.detail || "Failed to fetch my center details");
  return data as CenterDetails;
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
  const response = await fetch(`http://localhost:8000/api/center/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to update center");
};
