export interface PrinterStatus {
  id: number;
  name: string;
  model: string;
  location: string;
  status: "online" | "offline" | "maintenance";
  lastSeen: string;
}
