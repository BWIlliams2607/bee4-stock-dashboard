// data/products.ts
export type Product = {
  barcode: string;
  name: string;
  sku: string;
};

export const defaultProducts: Product[] = [
  { barcode: "1234567890123", name: "Vinyl Roll", sku: "VR-001" },
  { barcode: "9876543210987", name: "Label Sheet", sku: "LS-002" },
  { barcode: "5678901234567", name: "PVC Board", sku: "PVC-003" },
];
