import { Trash2, Edit2 } from "lucide-react";
import { MotionButton } from "./button";

export interface IncomingItem {
  id: string;
  timestamp: string;
  product: string;
  qty: number;
}

interface IncomingCardProps {
  item: IncomingItem;
  onDelete: (id: string) => void;
  onEdit: (it: IncomingItem) => void;
}

export function IncomingCard({ item, onDelete, onEdit }: IncomingCardProps) {
  return (
    <div className="bg-muted/50 p-4 rounded-2xl flex items-center justify-between shadow-soft">
      <div>
        <div className="font-medium">{item.product}</div>
        <div className="text-sm text-muted-foreground">
          {new Date(item.timestamp).toLocaleString()}
        </div>
        <div className="mt-1 text-lg font-bold">×{item.qty}</div>
      </div>
      <div className="flex space-x-2">
        <MotionButton
          onClick={() => onEdit(item)}
          className="p-2 bg-background hover:bg-muted/80 rounded-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Edit2 size={16} />
        </MotionButton>
        <MotionButton
          onClick={() => onDelete(item.id)}
          className="p-2 bg-background hover:bg-muted/80 rounded-lg text-rose-500"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Trash2 size={16} />
        </MotionButton>
      </div>
    </div>
  );
}
