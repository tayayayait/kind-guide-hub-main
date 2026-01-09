import { Check, Plus, MapPin, Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { TrustBadge, BadgeType } from "./TrustBadge";

interface ServiceCardProps {
  id: string;
  thumbnail?: string;
  title: string;
  location: string;
  distance?: string;
  tags: string[];
  priceMin: number;
  priceMax: number;
  trustType: BadgeType;
  description?: string;

  isSelected?: boolean;
  onToggleCompare?: (id: string) => void;
  onClick?: () => void;
  serviceType?: string;
}

export function ServiceCard({
  id,
  thumbnail,
  title,
  location,
  distance,
  tags,
  priceMin,
  priceMax,
  trustType,
  description,
  isSelected = false,
  onToggleCompare,
  onClick,
  serviceType,
}: ServiceCardProps) {
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  return (
    <article
      className={cn(
        "group relative bg-card rounded-2xl p-4 transition-all duration-300",
        "border border-border/50",
        isSelected
          ? "ring-2 ring-primary shadow-lg bg-primary/2"
          : "hover:shadow-lg hover:border-primary/20",
      )}
    >
      <button
        onClick={onClick}
        className="flex items-start w-full text-left focus:outline-none"
        aria-label={`${title} 상세 보기`}
      >
        <div className="w-20 h-20 rounded-xl bg-muted flex-shrink-0 overflow-hidden relative">
          {thumbnail && !imageError ? (
            <img
              src={thumbnail}
              alt={`${title} 이미지`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center text-muted-foreground bg-muted/50 ${imageError ? 'bg-gradient-to-br from-gray-100 to-gray-200' : ''
              }`}>
              {serviceType === 'funeral' ? (
                <span className="text-2xl">🏢</span>
              ) : serviceType === 'cremation' ? (
                <span className="text-2xl">⚱️</span>
              ) : (
                <span className="text-2xl">🤝</span>
              )}
            </div>
          )}
        </div>

        <div className="flex-grow ml-4 min-w-0 flex flex-col justify-between min-h-[5rem]">
          <div>
            <div className="flex items-start justify-between pr-8">
              <h3 className="text-base font-bold text-foreground truncate leading-tight">
                {title}
              </h3>
            </div>

            <p className="text-sm text-muted-foreground mt-1 flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1" />
              <span className="truncate">{location}</span>
              {distance && <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded-full">{distance}</span>}
            </p>

            <div className="flex flex-wrap gap-1 mt-2">
              {tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center bg-secondary/10 text-secondary-foreground text-[10px] px-2 py-1 rounded-md font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-end justify-between mt-3 pt-3 border-t border-border/40 border-dashed">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-primary">
                {formatPrice(priceMin)} ~ {formatPrice(priceMax)}만원
              </span>
            </div>
            <TrustBadge type={trustType} />
          </div>
        </div>
      </button>

      {onToggleCompare && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleCompare(id);
          }}
          aria-pressed={isSelected}
          aria-label={isSelected ? "비교 목록에서 제거" : "비교 목록에 추가"}
          className={cn(
            "absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-10",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            isSelected
              ? "bg-primary text-primary-foreground shadow-md scale-110"
              : "bg-background/80 backdrop-blur-sm border border-border text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/50 shadow-sm"
          )}
        >
          {isSelected ? (
            <Check className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </button>
      )}
    </article>
  );
}

