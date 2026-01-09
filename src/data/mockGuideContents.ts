export type GuideContentSection = {
  heading: string;
  body: string[];
};

export type GuideSource = {
  label: string;
};

export type GuideContent = {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  updatedAt: string;
  nextReviewAt?: string;
  author?: string;
  reviewer?: string;
  sections: GuideContentSection[];
  sources: GuideSource[];
};

export const mockGuideContents: GuideContent[] = [
  {
    slug: "funeral-process",
    title: "장례 절차 완벽 가이드",
    category: "절차",
    readTime: "5분",
    updatedAt: "2025-12-15",
    nextReviewAt: "2026-12-15",
    author: "운영팀",
    reviewer: "전문가 자문",
    sections: [
      {
        heading: "장례 절차의 큰 흐름",
        body: [
          "장례는 임종 후 장례식장 준비, 빈소 운영, 발인, 장지 이동 등으로 이어집니다.",
          "가족 상황에 따라 절차가 달라질 수 있어, 핵심 단계 중심으로 준비하는 것이 중요합니다.",
        ],
      },
      {
        heading: "준비 체크리스트",
        body: [
          "빈소 및 장례식장 예약",
          "장례 형태(가족장/일반장/무빈소) 결정",
          "발인 일시와 장지 결정",
        ],
      },
    ],
    sources: [
      { label: "보건복지부 장례 안내" },
      { label: "소비자원 장례 비용 가이드" },
    ],
  },
  {
    slug: "cost-breakdown",
    title: "장례 비용 항목별 이해하기",
    category: "비용",
    readTime: "7분",
    updatedAt: "2025-12-10",
    nextReviewAt: "2026-12-10",
    author: "운영팀",
    reviewer: "전문가 자문",
    sections: [
      {
        heading: "기본 비용과 옵션 비용",
        body: [
          "기본 비용은 장례식장 사용료, 필수 장례 서비스가 포함됩니다.",
          "옵션 비용은 수의, 제단 꽃장식 등 선택 항목에 따라 달라집니다.",
        ],
      },
      {
        heading: "변동 비용의 특성",
        body: [
          "조문객 수나 식사 메뉴에 따라 변동 폭이 커질 수 있습니다.",
          "범위형 비용은 보수적으로 계획하는 것이 좋습니다.",
        ],
      },
    ],
    sources: [
      { label: "공정위 상조 정보" },
      { label: "장례식장 협회 자료" },
    ],
  },
  {
    slug: "family-funeral",
    title: "가족장이란? 특징과 장단점",
    category: "형태",
    readTime: "4분",
    updatedAt: "2025-12-08",
    nextReviewAt: "2026-12-08",
    author: "운영팀",
    reviewer: "전문가 자문",
    sections: [
      {
        heading: "가족장의 의미",
        body: [
          "가까운 가족 중심으로 조용히 진행하는 장례 형태입니다.",
          "조문객 규모가 작아 비교적 간결하게 진행됩니다.",
        ],
      },
      {
        heading: "장점과 유의점",
        body: [
          "비용과 절차가 간소화되는 장점이 있습니다.",
          "고인을 알리기 위한 별도 안내가 필요할 수 있습니다.",
        ],
      },
    ],
    sources: [
      { label: "장례문화 진흥원 자료" },
      { label: "전문가 자문" },
    ],
  },
  {
    slug: "no-hall-funeral",
    title: "무빈소 장례 안내",
    category: "형태",
    readTime: "4분",
    updatedAt: "2025-12-05",
    nextReviewAt: "2026-12-05",
    author: "운영팀",
    reviewer: "전문가 자문",
    sections: [
      {
        heading: "무빈소란",
        body: [
          "빈소 없이 진행하며 조문을 받지 않는 장례 방식입니다.",
          "가족 부담을 줄이고 간소화할 수 있습니다.",
        ],
      },
      {
        heading: "안내 문구 예시",
        body: [
          "빈소 없이 가족장으로 조용히 진행됩니다.",
          "부고장을 통한 안내가 중요합니다.",
        ],
      },
    ],
    sources: [
      { label: "지자체 장례 지원 안내" },
      { label: "전문가 자문" },
    ],
  },
  {
    slug: "digital-obituary",
    title: "디지털 부고장 작성 팁",
    category: "부고",
    readTime: "3분",
    updatedAt: "2025-11-28",
    nextReviewAt: "2026-11-28",
    author: "운영팀",
    reviewer: "전문가 자문",
    sections: [
      {
        heading: "작성 시 유의할 점",
        body: [
          "고인 정보, 발인 일시, 장소 등 핵심 정보를 명확히 기재합니다.",
          "공개 범위와 비밀번호 설정을 고려합니다.",
        ],
      },
      {
        heading: "공유 방법",
        body: [
          "링크 공유 시 수신자가 빠르게 내용을 확인할 수 있도록 요약을 포함합니다.",
          "비밀번호 보호 시 별도 전달이 필요합니다.",
        ],
      },
    ],
    sources: [
      { label: "디지털 부고 가이드" },
      { label: "전문가 자문" },
    ],
  },
];
