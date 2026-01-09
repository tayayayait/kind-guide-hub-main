import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { FilterChip } from "@/components/ui/FilterChip";
import { useState } from "react";
import { cn } from "@/lib/utils";

const regions = ["서울", "경기", "인천", "부산", "대구", "광주", "대전"];
const funeralTypes = ["가족장", "일반장", "무빈소"];
const features = ["화장 포함", "버스 지원", "장지 안내", "24시간"];

interface FilterBarProps {
  selectedFilters: {
    region: string[];
    type: string[];
    features: string[];
  };
  onFilterChange: (category: string, value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

export function FilterBar({
  selectedFilters,
  onFilterChange,
  sortBy,
  onSortChange,
}: FilterBarProps) {
  const [showSort, setShowSort] = useState(false);

  const sortOptions = [
    { value: "recommended", label: "추천순" },
    { value: "price_low", label: "가격 낮은순" },
    { value: "price_high", label: "가격 높은순" },
    { value: "distance", label: "거리순" },
    { value: "rating", label: "평점순" },
  ];

  return (
    <div className="sticky top-14 z-30 bg-background border-b border-border">
      <div className="px-4 py-3">
        {/* 정렬 버튼 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">필터</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowSort(!showSort)}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              aria-haspopup="listbox"
              aria-expanded={showSort}
            >
              {sortOptions.find((s) => s.value === sortBy)?.label || "추천순"}
              <ChevronDown className={cn("w-4 h-4 transition-transform", showSort && "rotate-180")} />
            </button>

            {showSort && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowSort(false)}
                />
                <div
                  role="listbox"
                  className="absolute right-0 top-full mt-1 bg-card rounded-lg shadow-lg border border-border py-1 min-w-[140px] z-50"
                >
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      role="option"
                      aria-selected={sortBy === option.value}
                      onClick={() => {
                        onSortChange(option.value);
                        setShowSort(false);
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm transition-colors",
                        sortBy === option.value
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-muted"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* 필터 칩 - 지역 */}
        <div className="overflow-x-auto hide-scrollbar -mx-4 px-4 pb-2">
          <div className="flex gap-2">
            {regions.map((region) => (
              <FilterChip
                key={region}
                label={region}
                isSelected={selectedFilters.region.includes(region)}
                onClick={() => onFilterChange("region", region)}
              />
            ))}
          </div>
        </div>

        {/* 필터 칩 - 장례 형태 */}
        <div className="overflow-x-auto hide-scrollbar -mx-4 px-4 pb-2">
          <div className="flex gap-2">
            {funeralTypes.map((type) => (
              <FilterChip
                key={type}
                label={type}
                isSelected={selectedFilters.type.includes(type)}
                onClick={() => onFilterChange("type", type)}
              />
            ))}
            <span className="w-px h-6 bg-border mx-1" />
            {features.map((feature) => (
              <FilterChip
                key={feature}
                label={feature}
                isSelected={selectedFilters.features.includes(feature)}
                onClick={() => onFilterChange("features", feature)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
