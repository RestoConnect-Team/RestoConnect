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

export interface CenterDetail {
  center_id: number;
  name: string;
  street_number: number | null;
  street: string | null;
  city: string | null;
  postal_code: string | null;
  telephone: string | null;
  email: string | null;
  status: string;
  description: string | null;
  activities: string | null;
  center_headmaster_name: string;
  center_headmaster_lastname: string;
  center_headmaster_email: string;
  center_headmaster_telephone: string;
  center_schedule: WeeklySchedule;
  closing_periods: ClosingPeriod[];
  materials_count: number;
  missing_count: number;
  days_since_last_inventory: number | null;
  contacts: ContactInfo[];
  alerts: CenterAlert[];
  is_user_center: boolean;
}

export const fetchCenterDetail = (id: number) => async (): Promise<CenterDetail> => {
  const response = await fetch(`http://localhost:8000/api/center/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to fetch center details');
  return data as CenterDetail;
};

export const fetchMyCenterDetail = async (): Promise<CenterDetail> => {
  const response = await fetch('http://localhost:8000/api/my_center', {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to fetch my center details');
  return data as CenterDetail;
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

export const updateCenter = async (id: number, payload: UpdateCenterPayload): Promise<void> => {
  const response = await fetch(`http://localhost:8000/api/center/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to update center');
};

