// Google Maps Geocoding 유틸리티
// 주소를 좌표(위경도)로 변환하는 함수와 캐싱 로직 포함

const GEOCODE_CACHE_KEY = 'geocode_cache';
const CACHE_EXPIRY_DAYS = 30;

interface CacheEntry {
    lat: number;
    lng: number;
    timestamp: number;
}

interface GeocodeCacheData {
    [address: string]: CacheEntry;
}

// 캐시에서 좌표 조회
const getFromCache = (address: string): { lat: number; lng: number } | null => {
    try {
        const cacheStr = localStorage.getItem(GEOCODE_CACHE_KEY);
        if (!cacheStr) return null;

        const cache: GeocodeCacheData = JSON.parse(cacheStr);
        const entry = cache[address];

        if (!entry) return null;

        // 만료 체크 (30일)
        const now = Date.now();
        const expiryMs = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
        if (now - entry.timestamp > expiryMs) {
            return null;
        }

        return { lat: entry.lat, lng: entry.lng };
    } catch {
        return null;
    }
};

// 캐시에 좌표 저장
const saveToCache = (address: string, lat: number, lng: number): void => {
    try {
        const cacheStr = localStorage.getItem(GEOCODE_CACHE_KEY);
        const cache: GeocodeCacheData = cacheStr ? JSON.parse(cacheStr) : {};

        cache[address] = {
            lat,
            lng,
            timestamp: Date.now(),
        };

        localStorage.setItem(GEOCODE_CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
        console.warn('[Geocode Cache] Failed to save:', error);
    }
};

// Google Geocoding API를 사용하여 주소를 좌표로 변환
export const geocodeAddress = async (
    address: string,
    geocoder: google.maps.Geocoder
): Promise<{ lat: number; lng: number } | null> => {
    // 캐시 먼저 확인
    const cached = getFromCache(address);
    if (cached) {
        console.log('[Geocode] Cache hit:', address);
        return cached;
    }

    try {
        const result = await geocoder.geocode({ address });

        if (result.results && result.results.length > 0) {
            const location = result.results[0].geometry.location;
            const lat = location.lat();
            const lng = location.lng();

            // 캐시에 저장
            saveToCache(address, lat, lng);

            console.log('[Geocode] API result:', address, { lat, lng });
            return { lat, lng };
        }

        return null;
    } catch (error) {
        console.error('[Geocode] Error:', address, error);
        return null;
    }
};

// 여러 주소를 일괄 변환 (rate limiting 고려)
export const geocodeAddresses = async (
    addresses: string[],
    geocoder: google.maps.Geocoder,
    delayMs = 200
): Promise<Map<string, { lat: number; lng: number }>> => {
    const results = new Map<string, { lat: number; lng: number }>();

    for (const address of addresses) {
        const coords = await geocodeAddress(address, geocoder);
        if (coords) {
            results.set(address, coords);
        }

        // Rate limiting: API 호출 간 딜레이
        if (delayMs > 0) {
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }

    return results;
};

// 한국 중심 기본 좌표 (서울)
export const DEFAULT_CENTER = { lat: 37.5665, lng: 126.9780 };
export const DEFAULT_ZOOM = 11;
