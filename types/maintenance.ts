export interface MaintenanceItem {
  id: number;
  name: string;
  category: string;
  supplier: string;
  inStock: number;
  threshold: number;
}

export interface OrderRequest {
  itemId: number;
  quantity: number;
}
