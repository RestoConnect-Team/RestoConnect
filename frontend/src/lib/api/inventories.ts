import { apiFetch } from "./client";

export interface InventoryItem {
  inventory_id: number;
  start_date: string;
  end_date: string | null;
  status_inventory_stock: string;
}

export interface InventoryStockItem {
  inventory_stock_id: number;
  reference: string;
  name: string;
  category: string;
  qr_code: string;
  status_inventory_stock: string;
}

export const fetchInventoriesList = async (): Promise<InventoryItem[]> => {
  return apiFetch<InventoryItem[]>("/api/inventory/list_inventories");
};

export const fetchInventoryStocks = async (
  inventoryId: number,
): Promise<InventoryStockItem[]> => {
  return apiFetch<InventoryStockItem[]>(
    `/api/inventory/list_stocks_inventory/${inventoryId}`,
  );
};

export const createInventory = async (): Promise<InventoryStockItem[]> => {
  return apiFetch<InventoryStockItem[]>("/api/inventory/create_inventory", {
    method: "POST",
  });
};

export const updateInventoryStockStatus = async (
  inventoryStockId: number,
  status: string,
): Promise<InventoryStockItem> => {
  return apiFetch<InventoryStockItem>(
    `/api/inventory/inventory_stock/${inventoryStockId}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    },
  );
};

export const updateInventoryStatus = async (
  inventoryId: number,
  status: string,
): Promise<InventoryItem> => {
  return apiFetch<InventoryItem>(`/api/inventory/${inventoryId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};

export const restartInventory = async (
  inventoryId: number,
): Promise<InventoryItem> => {
  return apiFetch<InventoryItem>(`/api/inventory/${inventoryId}/restart`, {
    method: "POST",
  });
};
