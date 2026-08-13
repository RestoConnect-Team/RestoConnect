import {
  CenterAlert,
  ClosingPeriod,
  ContactInfo,
  WeeklySchedule,
} from "@/lib/api/center_detail_info";

export interface Center {
  center_id: number;
  name: string;
  city: string;
  status: string;
  materials_count: number;
  contacts_count: number;
}

export interface CenterDetails {
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

export interface ListCentersResponse {
  user_center: Center;
  centers_list: Center[];
  warehouses_list: Center[];
}
