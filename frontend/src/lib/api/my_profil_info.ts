export interface Profile {
  id: number;
  name: string;
  lastname: string;
  email: string;
  telephone: string;
  street: string;
  city: string;
  postal_code: string;
  status: string;
  created_at: string;
  updated_at: string;
  center: string;
  photo_url?: string | null;
}

import { apiFetch } from "./client";

export const fetchProfilInfo = async (): Promise<Profile> => {
  return apiFetch<Profile>("/api/profil");
};