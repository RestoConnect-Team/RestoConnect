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

export const fetchCentersList = async (): Promise<Center[]> => {
    const response = await fetch('http://localhost:8000/api/list_centers', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.detail || 'Failed to fetch center info');
    }
    
    return data as Center[];
};