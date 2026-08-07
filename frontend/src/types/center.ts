export interface Center {
  center_id: number;
  name: string;
  city: string;
  status: string;
  materials_count: number;
  contacts_count: number;
}

export interface ListCentersResponse {
  user_center: Center;
  centers_list: Center[];
  warehouses_list: Center[];
}
