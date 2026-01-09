import { cn } from "@/lib/utils";

export type BadgeType = "public" | "partner" | "report" | "estimate";

interface TrustBadgeProps {
  type: BadgeType;
  className?: string;
}

const badgeConfig: Record<BadgeType, { label: string; intent: string; className: string }> = {
  public: {
    label: "공공",
    intent: "공공데이터 기반",
    className: "bg-info/15 text-info",
  },
  partner: {
    label: "제휴",
    intent: "파트너 제공",
    className: "bg-accent/15 text-accent",
  },
  report: {
    label: "제보",
    intent: "사용자/업계 제보",
    className: "bg-warning/15 text-warning",
  },
  estimate: {
    label: "추정",
    intent: "알고리즘 추산",
    className: "bg-muted text-muted-foreground",
  },
};

export function TrustBadge({ type, className }: TrustBadgeProps) {
  const config = badgeConfig[type];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        config.className,
        className
      )}
      aria-label={`${config.label}: ${config.intent}`}
    >
      {config.label}
    </span>
  );
}
