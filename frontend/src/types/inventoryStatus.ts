export interface Inventory {
  reference: string;
  start_date: string;
  end_date: string;
  status: InventoryStatus;
  center: string;
  anomalies: number;
  comments: number;
}

export enum InventoryStatus {
  ONGOING = "En cours",
  FINISHED = "Terminé",
}
