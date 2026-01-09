// 2026년 기준 표준 장례식장 비용 추정 데이터 (단위: 만원)
// 이 데이터는 실제 API 데이터가 없을 때 사용하는 '추정치'입니다.

type PriceRange = {
    min: number;
    max: number;
};

type FacilityType = "hospital" | "professional" | "public"; // 대학병원/종합병원, 전문장례식장, 공설

interface RegionPricing {
    hospital: PriceRange;
    professional: PriceRange;
    public: PriceRange;
}

// 기본값 (일반적인 평균)
const DEFAULT_PRICING: RegionPricing = {
    hospital: { min: 250, max: 500 },
    professional: { min: 150, max: 350 },
    public: { min: 50, max: 150 },
};

export const STANDARD_PRICES: Record<string, RegionPricing> = {
    "서울": {
        hospital: { min: 350, max: 800 },
        professional: { min: 250, max: 500 },
        public: { min: 60, max: 150 },
    },
    "경기": {
        hospital: { min: 300, max: 600 },
        professional: { min: 200, max: 400 },
        public: { min: 50, max: 120 },
    },
    "인천": {
        hospital: { min: 300, max: 600 },
        professional: { min: 200, max: 400 },
        public: { min: 50, max: 120 },
    },
    "부산": {
        hospital: { min: 280, max: 550 },
        professional: { min: 180, max: 350 },
        public: { min: 40, max: 100 },
    },
    "대구": {
        hospital: { min: 250, max: 500 },
        professional: { min: 150, max: 300 },
        public: { min: 40, max: 100 },
    },
    // 기타 지역은 DEFAULT_PRICING 사용
};

/**
 * 시설 정보에 따른 예상 가격 범위를 반환합니다.
 * @param region 지역명 (예: "서울", "경기")
 * @param typeStr 시설 유형 문자열 (API 데이터)
 * @returns {min, max} 가격 범위 (단위: 만원)
 */
export const getEstimatedPrice = (location: string, typeStr: string = ""): PriceRange => {
    // 1. 지역 추출 (주소 앞 두 글자)
    const regionKey = Object.keys(STANDARD_PRICES).find(r => location.includes(r));
    const pricing = regionKey ? STANDARD_PRICES[regionKey] : DEFAULT_PRICING;

    // 2. 시설 유형 분석
    let type: FacilityType = "professional"; // 기본값: 전문장례식장

    if (typeStr.includes("대학") || typeStr.includes("병원") || typeStr.includes("의료원")) {
        type = "hospital";
    } else if (typeStr.includes("공설") || typeStr.includes("시립") || typeStr.includes("구립")) {
        type = "public";
    }

    return pricing[type];
};
