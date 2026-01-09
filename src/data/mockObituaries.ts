export type ObituaryTemplate = "minimal" | "traditional" | "nohall";

export type Obituary = {
  id: string;
  deceasedName: string;
  bereaved: string;
  datetime: string;
  location: string;
  contact?: string;
  template: ObituaryTemplate;
  isPrivate: boolean;
  hasPassword: boolean;
  password?: string;
  expiresAt: string;
  createdAt: string;
};

export const mockObituaries: Obituary[] = [
  {
    id: "1",
    deceasedName: "고 김영수",
    bereaved: "아들 김준호",
    datetime: "2025-12-20 14:00",
    location: "서울성모병원 장례식장 1호실",
    contact: "010-1234-5678",
    template: "traditional",
    isPrivate: true,
    hasPassword: true,
    password: "1234",
    expiresAt: "2026-01-19",
    createdAt: "2025-12-20",
  },
];
