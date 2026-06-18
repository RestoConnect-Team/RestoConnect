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

export const fetchProfilInfo = async (): Promise<Profile> => {
  const response = await fetch('http://localhost:8000/api/profil', {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'Failed to fetch profil');
  }

  return data as Profile;
};