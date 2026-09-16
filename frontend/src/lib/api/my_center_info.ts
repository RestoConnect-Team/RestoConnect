export interface Center {
    id: number;
    name: string;
    location: string;
    alerte: string;
    schedule: string;
    responsable_name: string;
    responsable_email: string;
    responsable_number: string;
  }

  import { apiFetch } from "./client";

  export const fetchCenterInfo = async () => {
    return apiFetch<Center>('/api/my_center');
  };