import { ServiceItem } from "@/data/mockServices";
import { getEstimatedPrice } from "@/data/standardPrices";
import { getStreetViewUrl } from "@/lib/image";
import { curatedImages } from "@/data/curatedImages";

const API_KEY = import.meta.env.VITE_PUBLIC_DATA_API_KEY;

// Convert XML to JSON (Simple impl since we don't have a parser dep)
const parseXml = (xmlStr: string) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlStr, "text/xml");
    return xmlDoc;
};

// Helper to safely get XML tag value
const getTagValue = (item: Element, tagName: string): string => {
    const node = item.getElementsByTagName(tagName)[0];
    return node ? node.textContent || "" : "";
};

// ===========================================
// 장례식장 현황 API (ODMS_DATA_04_1)
// Base: /1352000/ODMS_DATA_04_1
// Operation: /callData04_1Api
// 필드: fcltNm(시설명), addr(주소), telno(전화), gubun(공/사설),
//       mtaCnt(빈소수), ehrCnt(안치가능구수), operType(운영종류)
// ===========================================
const mapFuneralHomeToService = (item: Element): ServiceItem => {
    const name = getTagValue(item, "fcltNm");
    const addr = getTagValue(item, "addr");
    const tel = getTagValue(item, "telno");
    const ctpv = getTagValue(item, "ctpv"); // 시도
    const sigungu = getTagValue(item, "sigungu"); // 시군구
    const gubun = getTagValue(item, "gubun"); // 공설/사설
    const mtaCnt = getTagValue(item, "mtaCnt"); // 빈소수
    const ehrCnt = getTagValue(item, "ehrCnt"); // 안치가능구수
    const operType = getTagValue(item, "operType"); // 운영종류

    const location = addr || `${ctpv} ${sigungu}`.trim() || "주소 미상";

    // 태그 구성: 장례식장 + 공설/사설 + 운영종류
    const tags = ["장례식장"];
    if (gubun) tags.push(gubun);
    if (operType) tags.push(operType);

    // 표준 수가 적용
    const priceRange = getEstimatedPrice(location, name + gubun + operType);

    return {
        id: `fh-${Math.random().toString(36).substr(2, 9)}`,
        title: name || "장례식장",
        location: location,
        thumbnail: curatedImages[name] || getStreetViewUrl(location),
        distance: "",
        tags: tags,
        priceMin: priceRange.min,
        priceMax: priceRange.max,
        trustType: "public",
        rating: 0,
        reviewCount: 0,
        description: `빈소: ${mtaCnt || "정보없음"}개 | 안치: ${ehrCnt || "정보없음"}구 | 전화: ${tel || "정보없음"}`,
        serviceType: "funeral",
    };
};

export const fetchFuneralHomes = async (): Promise<ServiceItem[]> => {
    try {
        // 장례식장 현황 API
        // Base URL: apis.data.go.kr/1352000/ODMS_DATA_04_1
        // Operation: callData04_1Api (추정 - 화장시설과 동일 패턴)
        const response = await fetch(
            `/api/public/1352000/ODMS_DATA_04_1/callData04_1Api?serviceKey=${encodeURIComponent(API_KEY)}&numOfRows=20&pageNo=1&apiType=XML`
        );

        const text = await response.text();
        console.log("[장례식장 API] Response:", text.substring(0, 500));

        if (text.startsWith("<")) {
            const xmlDoc = parseXml(text);

            // 에러 체크
            const resultCode = xmlDoc.getElementsByTagName("resultCode")[0]?.textContent;
            if (resultCode && resultCode !== "00") {
                console.error("[장례식장 API] Error:", xmlDoc.getElementsByTagName("resultMsg")[0]?.textContent);
                return [];
            }

            const items = xmlDoc.getElementsByTagName("item");
            const services: ServiceItem[] = [];
            for (let i = 0; i < items.length; i++) {
                services.push(mapFuneralHomeToService(items[i]));
            }
            return services;
        }

        return [];
    } catch (error) {
        console.error("[장례식장 API] Failed:", error);
        return [];
    }
};

// ===========================================
// 화장시설 현황 API (ODMS_DATA_05_1)
// Base: /1352000/ODMS_DATA_05_1
// Operation: /callData05_1Api
// ===========================================
const mapCremationToService = (item: Element): ServiceItem => {
    const name = getTagValue(item, "fcltNm");
    const addr = getTagValue(item, "addr");
    const tel = getTagValue(item, "telno");
    const ctpv = getTagValue(item, "ctpv");
    const gubun = getTagValue(item, "gubun"); // 공/사설
    const brzCnt = getTagValue(item, "brzCnt"); // 화장로수

    const location = addr || ctpv || "주소 미상";

    // 표준 수가 적용 (화장시설은 대부분 공설이므로 Public 요금 적용)
    const priceRange = getEstimatedPrice(location, "public");

    return {
        id: `cr-${Math.random().toString(36).substr(2, 9)}`,
        title: name || "화장시설",
        location: location,
        thumbnail: curatedImages[name] || getStreetViewUrl(location),
        distance: "",
        tags: ["화장시설", gubun || "공공"].filter(Boolean),
        priceMin: priceRange.min, // 보통 화장비용은 훨씬 저렴하지만 로직 일관성을 위해 매핑
        priceMax: priceRange.max,
        trustType: "public",
        rating: 0,
        reviewCount: 0,
        description: `화장로: ${brzCnt || "정보없음"}개 | 전화: ${tel || "정보없음"}`,
        serviceType: "cremation",
    };
};

export const fetchCremationFacilities = async (): Promise<ServiceItem[]> => {
    try {
        // 화장시설 현황 API (사용자 제공 명세 기준)
        // Base URL: apis.data.go.kr/1352000/ODMS_DATA_05_1
        // Operation: callData05_1Api
        const response = await fetch(
            `/api/public/1352000/ODMS_DATA_05_1/callData05_1Api?serviceKey=${encodeURIComponent(API_KEY)}&numOfRows=20&pageNo=1&apiType=XML`
        );

        const text = await response.text();
        console.log("[화장시설 API] Response:", text.substring(0, 500));

        if (text.startsWith("<")) {
            const xmlDoc = parseXml(text);

            // 에러 체크
            const resultCode = xmlDoc.getElementsByTagName("resultCode")[0]?.textContent;
            if (resultCode && resultCode !== "00") {
                console.error("[화장시설 API] Error:", xmlDoc.getElementsByTagName("resultMsg")[0]?.textContent);
                return [];
            }

            const items = xmlDoc.getElementsByTagName("item");
            const services: ServiceItem[] = [];
            for (let i = 0; i < items.length; i++) {
                services.push(mapCremationToService(items[i]));
            }
            return services;
        }

        return [];
    } catch (error) {
        console.error("[화장시설 API] Failed:", error);
        return [];
    }
};

// ===========================================
// 상조 업체 API (공정거래위원회)
// Base: /1130000/InstallplanBsIf_2Service (주의: BsIf, Bslf 아님!)
// Operation: /getInstallplanBsIfInfo_2
// ===========================================
const mapSangjoToService = (item: any): ServiceItem => {
    // API 응답 필드 매핑 (명세서 기준)
    // conmNm: 상호명, rprsvNm: 대표자명, bzmnAddr: 사업자주소
    // bsnSttusNm: 영업상태, telno: 전화번호
    const location = item.bzmnAddr || item.rnAddr || "주소 미상";

    return {
        id: `sj-${item.brno || item.opnSn || Math.random().toString(36).substr(2, 9)}`,
        title: item.conmNm || "상조업체",
        location: location,
        thumbnail: curatedImages[item.conmNm] || getStreetViewUrl(location),
        distance: "전국",
        tags: ["상조업체", item.bsnSttusNm || "공정위등록"].filter(Boolean),
        priceMin: 0,
        priceMax: 0,
        trustType: "partner",
        rating: 0,
        reviewCount: 0,
        description: `대표자: ${item.rprsvNm || "정보없음"} | 전화: ${item.telno || "정보없음"}`,
        serviceType: "sangjo",
    };
};

export const fetchSangjoCompanies = async (): Promise<ServiceItem[]> => {
    try {
        // 공정거래위원회 선불식할부거래업사업자 정보 제공 서비스
        // Base: InstallplanBsIf_2Service (주의: BsIf!)
        // Operation: getInstallplanBsIfInfo_2 (전체 조회, 필수 파라미터 없음)
        const response = await fetch(
            `/api/public/1130000/InstallplanBsIf_2Service/getInstallplanBsIfInfo_2?serviceKey=${encodeURIComponent(API_KEY)}&numOfRows=20&pageNo=1&resultType=json`
        );

        const text = await response.text();
        console.log("[상조업체 API] Response:", text.substring(0, 500));

        // JSON 파싱 시도
        try {
            const data = JSON.parse(text);
            const items = data?.items || data?.body?.items || data?.response?.body?.items?.item || [];

            if (Array.isArray(items)) {
                return items.map(mapSangjoToService);
            }
            return [];
        } catch {
            // XML일 수도 있음
            if (text.startsWith("<")) {
                const xmlDoc = parseXml(text);
                const items = xmlDoc.getElementsByTagName("item");
                const services: ServiceItem[] = [];
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    services.push({
                        id: `sj-${getTagValue(item, "brno") || Math.random().toString(36).substr(2, 9)}`,
                        title: getTagValue(item, "conmNm") || "상조업체",
                        location: getTagValue(item, "bzmnAddr") || getTagValue(item, "rnAddr") || "주소 미상",
                        distance: "전국",
                        tags: ["상조업체", getTagValue(item, "bsnSttusNm") || "공정위등록"].filter(Boolean),
                        priceMin: 0,
                        priceMax: 0,
                        trustType: "partner",
                        rating: 0,
                        reviewCount: 0,
                        description: `대표자: ${getTagValue(item, "rprsvNm") || "정보없음"} | 전화: ${getTagValue(item, "telno") || "정보없음"}`,
                    });
                }
                return services;
            }
            return [];
        }
    } catch (error) {
        console.error("[상조업체 API] Failed:", error);
        return [];
    }
};

