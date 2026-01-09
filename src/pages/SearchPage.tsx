import { useMemo, useState, useEffect } from "react";
import { Search, Loader2, List, Map } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { CompareBar } from "@/components/ui/CompareBar";
import { FilterBar } from "@/components/compare/FilterBar";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useCompare } from "@/state/compare";
import { usePreferences } from "@/state/preferences";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { GoogleMapView, MapMarkerData } from "@/components/map/GoogleMapView";
import { useJsApiLoader } from "@react-google-maps/api";
import { geocodeAddress, DEFAULT_CENTER } from "@/lib/geocode";
import { ServiceItem } from "@/data/mockServices";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

export default function ComparePage() {
  const navigate = useNavigate();
  const compare = useCompare();
  const { prefs, skip } = usePreferences();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const [showNudge, setShowNudge] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [mapMarkers, setMapMarkers] = useState<MapMarkerData[]>([]);
  const [geocodingInProgress, setGeocodingInProgress] = useState(false);
  const [filters, setFilters] = useState({
    region: [] as string[],
    type: [] as string[],
    features: [] as string[],
  });

  // Google Maps API 로딩
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    language: "ko",
    region: "KR",
  });

  const handleFilterChange = (category: string, value: string) => {
    setFilters((prev) => {
      const current = prev[category as keyof typeof prev];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };


  const handleToggleCompare = (service: ServiceItem) => {
    const result = compare.toggle(service);
    if (!result.ok) {
      if (result.reason === "max") {
        toast({
          title: "최대 3개까지 비교할 수 있어요",
          description: "기존 선택을 해제한 뒤 다시 선택해 주세요.",
        });
      }
    }
  };

  const handleRemoveFromCompare = (id: string) => {
    compare.remove(id);
  };

  const handleCompare = () => {
    navigate(`/compare/table?ids=${compare.items.map((i) => i.id).join(",")}`);
  };

  // API Data State
  const [apiServices, setApiServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch API Data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const { fetchFuneralHomes, fetchSangjoCompanies, fetchCremationFacilities } = await import("@/lib/api");
        const [funeralHomes, sangjoCompanies, cremationFacilities] = await Promise.all([
          fetchFuneralHomes(),
          fetchSangjoCompanies(),
          fetchCremationFacilities()
        ]);
        setApiServices([...funeralHomes, ...sangjoCompanies, ...cremationFacilities]);
      } catch (error) {
        console.error("Failed to load API data", error);
        toast({
          title: "데이터 불러오기 실패",
          description: "공공데이터를 불러오는 중 오류가 발생했습니다.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);


  // 지도 모드 활성화 시 Geocoding 수행
  useEffect(() => {
    if (viewMode !== "map" || !isLoaded || apiServices.length === 0 || geocodingInProgress) {
      return;
    }

    const performGeocoding = async () => {
      setGeocodingInProgress(true);
      const geocoder = new google.maps.Geocoder();
      const markers: MapMarkerData[] = [];

      // 처음 20개만 Geocoding (API 비용 절감)
      const servicesToGeocode = apiServices.slice(0, 20);

      for (const service of servicesToGeocode) {
        // 이미 좌표가 있으면 스킵
        if (service.coordinates) {
          markers.push({
            id: service.id,
            position: service.coordinates,
            title: service.title,
            type: service.serviceType || "funeral",
            description: service.location,
          });
          continue;
        }

        // 주소로 Geocoding
        if (service.location && service.location !== "주소 미상") {
          const coords = await geocodeAddress(service.location, geocoder);
          if (coords) {
            markers.push({
              id: service.id,
              position: coords,
              title: service.title,
              type: service.serviceType || "funeral",
              description: service.location,
            });
          }
        }

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setMapMarkers(markers);
      setGeocodingInProgress(false);
    };

    performGeocoding();
  }, [viewMode, isLoaded, apiServices]);

  const filteredServices = useMemo(() => {
    // API 데이터만 사용
    let result = [...apiServices];

    // 검색 필터
    if (searchQuery) {
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 지역 필터
    if (filters.region.length > 0) {
      result = result.filter((s) =>
        filters.region.some((r) => s.location.includes(r))
      );
    }

    const parseDistance = (distance?: string) => {
      if (!distance) return Number.POSITIVE_INFINITY;
      const normalized = distance.replace(/[^0-9.]/g, "");
      const value = Number.parseFloat(normalized);
      return Number.isFinite(value) ? value : Number.POSITIVE_INFINITY;
    };

    // 정렬
    switch (sortBy) {
      case "price_low":
        result.sort((a, b) => a.priceMin - b.priceMin);
        break;
      case "price_high":
        result.sort((a, b) => b.priceMax - a.priceMax);
        break;
      case "distance":
        result.sort((a, b) => parseDistance(a.distance) - parseDistance(b.distance));
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }

    return result;
  }, [searchQuery, filters, sortBy, apiServices]);

  const compareItems = compare.items.map((s) => ({ id: s.id, title: s.title }));



  return (
    <PageLayout title="검색">
      {/* 검색 바 */}
      <div className="px-4 py-3 bg-card border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="상조 상품 또는 지역 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* 온보딩 유도 배너 */}
      {showNudge && !prefs.completed && (
        <div className="px-4 pt-4">
          <div className="rounded-lg border border-border bg-primary/5 p-4">
            <div className="font-semibold text-foreground">
              맞춤 설정을 완료하면 더 정확한 비교가 가능해요
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              지역과 장례 형태를 선택하면 추천 결과가 개인화됩니다.
            </p>
            <div className="mt-3 flex gap-2">
              <Button
                size="sm"
                onClick={() => navigate("/onboarding?mode=nudge&next=/")}
              >
                맞춤 설정
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowNudge(false);
                  skip();
                }}
              >
                나중에
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 필터 바 */}
      <FilterBar
        selectedFilters={filters}
        onFilterChange={handleFilterChange}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* 결과 수 및 뷰 토글 */}
      <div className="px-4 py-3 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          총 <span className="font-medium text-foreground">{filteredServices.length}</span>개 상품
        </p>
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            className="h-7 px-2"
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4 mr-1" />
            목록
          </Button>
          <Button
            variant={viewMode === "map" ? "default" : "ghost"}
            size="sm"
            className="h-7 px-2"
            onClick={() => setViewMode("map")}
          >
            <Map className="w-4 h-4 mr-1" />
            지도
          </Button>
        </div>
      </div>

      {/* 지도 뷰 */}
      {viewMode === "map" && (
        <div className="px-4 pb-4">
          {geocodingInProgress ? (
            <div className="h-[300px] flex flex-col items-center justify-center bg-muted/50 rounded-lg animate-pulse">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
              <p className="text-sm text-muted-foreground font-medium">지도 데이터를 불러오고 있습니다...</p>
            </div>

          ) : (
            <div className="relative">
              <GoogleMapView
                markers={mapMarkers}
                onMarkerClick={(id) => navigate(`/detail/${id}`)}
                center={DEFAULT_CENTER}
                zoom={11}
                height="350px"
              />
            </div>
          )}
        </div>
      )}

      {/* 서비스 목록 (목록 뷰일 때만) */}
      {viewMode === "list" && (
        <div className="px-4 space-y-3 pb-4">
          {/* 로딩 상태 */}
          {loading && (
            <div className="py-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
              <p className="mt-3 text-muted-foreground">공공데이터를 불러오는 중...</p>
            </div>
          )}

          {/* 데이터 목록 */}
          {!loading && filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              {...service}
              isSelected={compare.isSelected(service.id)}
              onToggleCompare={() => handleToggleCompare(service)}
              onClick={() => navigate(`/detail/${service.id}`, { state: { service } })}
            />
          ))}

          {/* 빈 상태 */}
          {!loading && filteredServices.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">데이터를 불러올 수 없습니다.</p>
              <p className="text-sm text-muted-foreground mt-1">
                API 서비스 활성화 대기 중이거나 네트워크 문제일 수 있습니다.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                새로고침
              </Button>
            </div>
          )}
        </div>
      )}

      {/* 비교 바 */}
      <CompareBar
        items={compareItems}
        onRemove={handleRemoveFromCompare}
        onCompare={handleCompare}
      />
    </PageLayout>
  );
}
