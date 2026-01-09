import { useCallback, useState } from "react";
import {
    GoogleMap,
    useJsApiLoader,
    Marker,
    InfoWindow,
} from "@react-google-maps/api";
import { Loader2, MapPin } from "lucide-react";
import { DEFAULT_CENTER, DEFAULT_ZOOM } from "@/lib/geocode";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

export interface MapMarkerData {
    id: string;
    position: { lat: number; lng: number };
    title: string;
    type: "funeral" | "cremation" | "sangjo";
    description?: string;
}

interface GoogleMapViewProps {
    markers: MapMarkerData[];
    onMarkerClick?: (id: string) => void;
    center?: { lat: number; lng: number };
    zoom?: number;
    height?: string;
}

// 마커 타입별 색상
const MARKER_COLORS: Record<MapMarkerData["type"], string> = {
    funeral: "#EF4444", // 빨강 - 장례식장
    cremation: "#F97316", // 주황 - 화장시설
    sangjo: "#8B5CF6", // 보라 - 상조업체
};

// 마커 타입별 라벨
const MARKER_LABELS: Record<MapMarkerData["type"], string> = {
    funeral: "장례식장",
    cremation: "화장시설",
    sangjo: "상조업체",
};

const containerStyle = {
    width: "100%",
    height: "100%",
};

export function GoogleMapView({
    markers,
    onMarkerClick,
    center = DEFAULT_CENTER,
    zoom = DEFAULT_ZOOM,
    height = "300px",
}: GoogleMapViewProps) {
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        language: "ko",
        region: "KR",
    });

    const [selectedMarker, setSelectedMarker] = useState<MapMarkerData | null>(
        null
    );
    const [map, setMap] = useState<google.maps.Map | null>(null);

    const onLoad = useCallback((map: google.maps.Map) => {
        setMap(map);

        // 마커가 있으면 모든 마커가 보이도록 bounds 조정
        if (markers.length > 0) {
            const bounds = new google.maps.LatLngBounds();
            markers.forEach((marker) => {
                bounds.extend(marker.position);
            });
            map.fitBounds(bounds);

            // 줌이 너무 크면 조정
            const listener = google.maps.event.addListener(map, "idle", () => {
                const currentZoom = map.getZoom();
                if (currentZoom && currentZoom > 15) {
                    map.setZoom(15);
                }
                google.maps.event.removeListener(listener);
            });
        }
    }, [markers]);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    const handleMarkerClick = (marker: MapMarkerData) => {
        setSelectedMarker(marker);
        if (onMarkerClick) {
            onMarkerClick(marker.id);
        }
    };

    // 로딩 에러
    if (loadError) {
        return (
            <div
                className="flex flex-col items-center justify-center bg-muted/50 rounded-lg"
                style={{ height }}
            >
                <MapPin className="w-8 h-8 text-destructive mb-2" />
                <p className="text-sm text-destructive">지도를 불러올 수 없습니다</p>
                <p className="text-xs text-muted-foreground mt-1">
                    API 키를 확인해 주세요
                </p>
            </div>
        );
    }

    // 로딩 중
    if (!isLoaded) {
        return (
            <div
                className="flex flex-col items-center justify-center bg-muted/50 rounded-lg"
                style={{ height }}
            >
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                <p className="text-sm text-muted-foreground">지도 로딩 중...</p>
            </div>
        );
    }

    // 마커가 없는 경우
    if (markers.length === 0) {
        return (
            <div
                className="flex flex-col items-center justify-center bg-muted/50 rounded-lg"
                style={{ height }}
            >
                <MapPin className="w-8 h-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                    표시할 위치 정보가 없습니다
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-lg overflow-hidden border border-border" style={{ height }}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={zoom}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={{
                    zoomControl: true,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                    styles: [
                        {
                            featureType: "poi",
                            elementType: "labels",
                            stylers: [{ visibility: "off" }],
                        },
                    ],
                }}
            >
                {markers.map((marker) => (
                    <Marker
                        key={marker.id}
                        position={marker.position}
                        title={marker.title}
                        onClick={() => handleMarkerClick(marker)}
                        icon={{
                            path: google.maps.SymbolPath.CIRCLE,
                            fillColor: MARKER_COLORS[marker.type],
                            fillOpacity: 1,
                            strokeColor: "#ffffff",
                            strokeWeight: 2,
                            scale: 10,
                        }}
                    />
                ))}

                {selectedMarker && (
                    <InfoWindow
                        position={selectedMarker.position}
                        onCloseClick={() => setSelectedMarker(null)}
                    >
                        <div className="p-1 min-w-[150px]">
                            <p className="font-semibold text-sm text-gray-900">
                                {selectedMarker.title}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                                {MARKER_LABELS[selectedMarker.type]}
                            </p>
                            {selectedMarker.description && (
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                    {selectedMarker.description}
                                </p>
                            )}
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>

            {/* 범례 */}
            <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-sm border border-border">
                <div className="flex gap-3 text-xs">
                    {Object.entries(MARKER_LABELS).map(([type, label]) => (
                        <div key={type} className="flex items-center gap-1">
                            <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: MARKER_COLORS[type as MapMarkerData["type"]] }}
                            />
                            <span className="text-muted-foreground">{label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default GoogleMapView;
