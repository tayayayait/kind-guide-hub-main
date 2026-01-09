import { BadgeType } from "@/components/ui/TrustBadge";

export interface ServiceItem {
  id: string;
  title: string;
  location: string;
  distance?: string;
  tags: string[];
  priceMin: number;
  priceMax: number;
  trustType: BadgeType;
  thumbnail?: string;
  description?: string;
  rating?: number;
  reviewCount?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
  serviceType?: "funeral" | "cremation" | "sangjo";
}

export const mockServices: ServiceItem[] = [
  {
    id: "1",
    title: "프리드라이프 가족장",
    location: "서울 강남구",
    distance: "15km",
    tags: ["화장 포함", "버스 지원", "24시간"],
    priceMin: 350,
    priceMax: 420,
    trustType: "public",
    rating: 4.8,
    reviewCount: 127,
  },
  {
    id: "2",
    title: "보람상조 프리미엄",
    location: "서울 송파구",
    distance: "12km",
    tags: ["장지 안내", "가족장"],
    priceMin: 380,
    priceMax: 480,
    trustType: "partner",
    rating: 4.6,
    reviewCount: 89,
  },
  {
    id: "3",
    title: "좋은상조 표준",
    location: "경기 성남시",
    distance: "22km",
    tags: ["화장 포함", "무빈소"],
    priceMin: 280,
    priceMax: 350,
    trustType: "public",
    rating: 4.4,
    reviewCount: 56,
  },
  {
    id: "4",
    title: "대명상조 가족케어",
    location: "인천 남동구",
    distance: "35km",
    tags: ["버스 지원", "24시간", "가족장"],
    priceMin: 400,
    priceMax: 520,
    trustType: "partner",
    rating: 4.7,
    reviewCount: 203,
  },
  {
    id: "5",
    title: "효도상조 베이직",
    location: "서울 마포구",
    distance: "8km",
    tags: ["화장 포함"],
    priceMin: 250,
    priceMax: 300,
    trustType: "report",
    rating: 4.2,
    reviewCount: 34,
  },
  {
    id: "6",
    title: "서울장례식장 직영",
    location: "서울 서초구",
    distance: "18km",
    tags: ["일반장", "장지 안내", "24시간"],
    priceMin: 450,
    priceMax: 600,
    trustType: "public",
    rating: 4.9,
    reviewCount: 312,
  },
];

export const guideArticles = [
  {
    id: "1",
    slug: "funeral-process",
    title: "장례 절차 완벽 가이드",
    summary: "처음 겪는 장례, 무엇부터 해야 할까요? 단계별로 알려드립니다.",
    category: "절차",
    readTime: "5분",
    updatedAt: "2025-12-15",
  },
  {
    id: "2",
    slug: "cost-breakdown",
    title: "장례 비용 항목별 이해하기",
    summary: "기본 비용, 옵션 비용, 변동 비용의 차이를 알아봅니다.",
    category: "비용",
    readTime: "7분",
    updatedAt: "2025-12-10",
  },
  {
    id: "3",
    slug: "family-funeral",
    title: "가족장이란? 특징과 장단점",
    summary: "가족장의 의미와 일반장과의 차이점을 설명합니다.",
    category: "형태",
    readTime: "4분",
    updatedAt: "2025-12-08",
  },
  {
    id: "4",
    slug: "no-hall-funeral",
    title: "무빈소 장례 안내",
    summary: "빈소 없이 진행하는 장례, 어떤 경우에 선택할까요?",
    category: "형태",
    readTime: "4분",
    updatedAt: "2025-12-05",
  },
  {
    id: "5",
    slug: "digital-obituary",
    title: "디지털 부고장 작성 팁",
    summary: "온라인 부고장 작성 시 주의할 점과 예절을 알려드립니다.",
    category: "부고",
    readTime: "3분",
    updatedAt: "2025-11-28",
  },
];
