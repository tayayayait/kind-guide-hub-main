import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterChipProps {
  label: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export function FilterChip({ label, isSelected = false, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={isSelected}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        "whitespace-nowrap",
        isSelected
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
      )}
    >
      {isSelected && <Check className="w-3.5 h-3.5" />}
      {label}
    </button>
  );
}
