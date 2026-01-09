import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = import.meta.env.VITE_GEMINI_MODEL ?? "gemini-2.5-flash";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(API_KEY);

export interface QuoteAnalysis {
  totalCostRange: string;
  breakdown: {
    category: string;
    cost: string;
    detail: string;
  }[];
  advice: string[];
  hiddenCosts: string[];
}

export const generateQuoteAnalysis = async (
  region: string,
  peopleCount: number,
  funeralType: string,
  days: string,
  shroud: string[],
  hasHall: boolean,
  cremation: boolean
): Promise<QuoteAnalysis> => {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL });

    const extractJson = (rawText: string) => {
      // Prefer fenced JSON blocks if present.
      const fenced = rawText.match(/```json\s*([\s\S]*?)\s*```/i);
      if (fenced?.[1]) {
        return fenced[1].trim();
      }

      // Fall back to the first JSON object in the text.
      const firstBrace = rawText.indexOf("{");
      const lastBrace = rawText.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        return rawText.slice(firstBrace, lastBrace + 1).trim();
      }

      return rawText.trim();
    };

    const prompt = `
      당신은 20년 경력의 장례지도사입니다. 다음 조건에 맞춰 장례 견적을 상세하게 분석하고 조언해주세요.
      
      [조건]
      1. 지역: ${region}
      2. 예상 조문객: ${peopleCount}명
      3. 장례 형태: ${funeralType} (가족장/일반장/무빈소)
      4. 기간: ${days}
      5. 수의: ${shroud.join(", ") || "기본"}
      6. 빈소 사용: ${hasHall ? "함" : "안함"}
      7. 화장 여부: ${cremation ? "함" : "매장"}

      [요청사항]
      위 조건을 바탕으로 JSON 형식으로 응답해주세요. 
당신은 20년 경력의 베테랑 장례지도사입니다.
다음 조건에 맞는 장례 견적을 상세히 분석해주세요.

[입력 조건]
- 지역: ${region}
- 예상 조문객: ${peopleCount}명
- 장례 형태: ${funeralType}
- 기간: ${days}
- 수의: ${shroud.join(", ") || "선택 안함"}
- 빈소 사용 여부: ${hasHall ? "사용" : "사용 안함"}
- 화장 여부: ${cremation ? "화장" : "매장/기타"}

[요청 사항]
1. 전체 예상 비용 범위 (단위: 만원)
2. 비용 세부 내역 (빈소, 음식, 장례용품, 차량 등 항목별 예상 등급 및 비용)
3. 해당 조건에서 비용을 절감할 수 있는 실질적인 팁
4. 사용자가 놓치기 쉬운 추가 비용(Hidden Cost) 경고

응답은 반드시 다음 JSON 형식으로만 해주세요:
{
  "totalCostRange": "300-500",
  "breakdown": [
    { "category": "항목명", "cost": "예상비용", "detail": "상세설명" }
  ],
  "advice": ["조언1", "조언2"],
  "hiddenCosts": ["주의사항1", "주의사항2"]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Raw Gemini Response:", text); // Debug log

    const jsonStr = extractJson(text);
    const data = JSON.parse(jsonStr) as QuoteAnalysis;

    return data;
  } catch (error) {
    console.error("Gemini API Error Detail:", error);
    return {
      totalCostRange: "0",
      breakdown: [],
      advice: ["일시적인 오류로 AI 분석에 실패했습니다.", "잠시 후 다시 시도해주세요."],
      hiddenCosts: [],
    };
  }
};
