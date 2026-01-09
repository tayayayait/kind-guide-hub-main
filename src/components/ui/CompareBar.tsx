import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface CompareItem {
  id: string;
  title: string;
}

interface CompareBarProps {
  items: CompareItem[];
  onRemove: (id: string) => void;
  onCompare: () => void;
  maxItems?: number;
}

export function CompareBar({
  items,
  onRemove,
  onCompare,
  maxItems = 3,
}: CompareBarProps) {
  if (items.length < 2) return null;

  return (
    <div
      className={cn(
        "fixed bottom-14 left-0 right-0 z-40",
        "bg-card/95 backdrop-blur border-t border-border",
        "animate-slide-up safe-bottom"
      )}
      role="region"
      aria-live="polite"
      aria-label="비교 선택 바"
    >
      <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
        <div className="flex items-center gap-2 flex-1 overflow-x-auto hide-scrollbar">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm whitespace-nowrap"
            >
              <span className="max-w-[80px] truncate">{item.title}</span>
              <button
                onClick={() => onRemove(item.id)}
                aria-label={`${item.title} 비교 목록에서 제거`}
                className="p-0.5 hover:bg-primary/20 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <Button
          onClick={onCompare}
          size="sm"
          className="ml-3 flex-shrink-0"
          aria-label={`선택한 ${items.length}개 항목 비교하기`}
        >
          비교하기 ({items.length})
        </Button>
      </div>
    </div>
  );
}
