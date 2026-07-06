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

export const fetchCentersList = async (): Promise<ListCentersResponse> => {
    const response = await fetch('http://localhost:8000/api/list_centers', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.detail || 'Failed to fetch centers list');
    }
    
    return data as ListCentersResponse;
};