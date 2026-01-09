import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { TrustBadge } from "@/components/ui/TrustBadge";
import { Phone, MessageCircle, Info, ArrowLeft, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRequireCorePrefs } from "@/hooks/useRequireCorePrefs";
import { generateQuoteAnalysis, QuoteAnalysis } from "@/lib/gemini";
import { toast } from "@/components/ui/use-toast";

export default function QuoteResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { ensureCore } = useRequireCorePrefs();
  const { form, estimate } = location.state || {};

  const [aiData, setAiData] = useState<QuoteAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!form) return;

    const fetchAnalysis = async () => {
      try {
        const data = await generateQuoteAnalysis(
          form.region,
          form.peopleCount,
          form.funeralType,
          form.days,
          form.shroud,
          form.hasHall,
          form.cremation
        );
        setAiData(data);
      } catch (error) {
        console.error("Failed to generate AI analysis", error);
        toast({
          title: "AI 분석 실패",
          description: "기본 견적만 표시됩니다.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [form]);

  if (!form || !estimate) {
    return (
      <PageLayout title="견적 결과">
        <div className="p-4 text-center">
          <p className="text-muted-foreground">견적 정보가 없습니다.</p>
          <Button onClick={() => navigate("/quote")} className="mt-4">
            견적 다시 시작
          </Button>
        </div>
      </PageLayout>
    );
  }

  const formatFuneralType = (type: string) => {
    switch (type) {
      case "family": return "가족장";
      case "general": return "일반장";
      case "nohall": return "무빈소";
      default: return type;
    }
  };

  return (
    <PageLayout
      title="견적 결과"
      headerRight={
        <button
          onClick={() => navigate("/quote")}
          className="p-2 hover:bg-muted rounded-lg"
          aria-label="뒤로 가기"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      }
    >
      <div className="px-4 py-4 space-y-6 pb-32">
        {/* 총 예상 비용 (AI 결과 우선, 없으면 기본 계산) */}
        <div className="bg-primary/10 rounded-2xl p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <Sparkles className="w-24 h-24 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground mb-1 font-medium">AI 예상 총 비용</p>

          {loading ? (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <span className="ml-2 text-sm text-primary">정밀 분석 중...</span>
            </div>
          ) : (
            <>
              <p className="text-4xl font-bold text-primary tracking-tight">
                {aiData ? aiData.totalCostRange : `${estimate.min}~${estimate.max}`}
                <span className="text-xl font-normal ml-1">만원</span>
              </p>
              <div className="flex items-center justify-center gap-2 mt-3">
                <TrustBadge type="estimate" />
                <span className="text-xs text-muted-foreground">
                  지역 물가와 옵션을 반영한 AI 추정치입니다
                </span>
              </div>
            </>
          )}
        </div>

        {/* 선택 조건 요약 (생략 가능, 위와 동일) */}
        <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" />
            선택 조건
          </h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-muted-foreground">지역:</span> <span className="font-medium">{form.region}</span></div>
            <div><span className="text-muted-foreground">형태:</span> <span className="font-medium">{formatFuneralType(form.funeralType)}</span></div>
            <div><span className="text-muted-foreground">기간:</span> <span className="font-medium">{form.days}</span></div>
            <div><span className="text-muted-foreground">조문객:</span> <span className="font-medium">{form.peopleCount}명</span></div>
          </div>
        </div>

        {/* AI 분석 리포트 */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : aiData ? (
          <div className="space-y-6 fade-in">
            {/* 상세 항목 */}
            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
              <div className="px-5 py-4 bg-muted/30 border-b border-border">
                <h3 className="font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-secondary" />
                  상세 비용 분석
                </h3>
              </div>
              <div className="divide-y divide-border/50">
                {aiData.breakdown.map((item, idx) => (
                  <div key={idx} className="p-4 hover:bg-muted/20 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-foreground">{item.category}</span>
                      <span className="font-bold text-primary">{item.cost}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {item.detail}
                    </div>
                  </div>
                ))}
              </div>
            </div>


            {/* AI 조언 */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-100 dark:border-blue-800">
              <h3 className="font-bold text-blue-700 dark:text-blue-300 mb-3 flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                전문가 조언
              </h3>
              <ul className="space-y-2">
                {aiData.advice.map((tip, idx) => (
                  <li key={idx} className="text-sm text-blue-800 dark:text-blue-200 flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* 숨은 비용 경고 */}
            {aiData.hiddenCosts.length > 0 && (
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-5 border border-orange-100 dark:border-orange-800">
                <h3 className="font-bold text-orange-700 dark:text-orange-300 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  놓치기 쉬운 추가 비용
                </h3>
                <ul className="space-y-2">
                  {aiData.hiddenCosts.map((cost, idx) => (
                    <li key={idx} className="text-sm text-orange-800 dark:text-orange-200 flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 bg-orange-400 rounded-full flex-shrink-0" />
                      {cost}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            AI 분석을 불러올 수 없습니다.
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center mt-8">
          * 위 견적은 AI 분석 기반의 예상치이며, 실제 비용은 장례식장 사정에 따라 달라질 수 있습니다.
        </p>
      </div>

      {/* 하단 상담 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border p-4 safe-bottom z-10">
        <div className="max-w-[430px] mx-auto flex gap-3">
          <Button
            variant="outline"
            className="flex-1 h-12 rounded-xl border-primary/20 text-primary hover:bg-primary/5"
            onClick={() => {
              if (!ensureCore()) return;
            }}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            무료 견적서 받기
          </Button>
          <Button
            className="flex-1 h-12 rounded-xl shadow-lg shadow-primary/20"
            onClick={() => {
              if (!ensureCore()) return;
            }}
          >
            <Phone className="w-4 h-4 mr-2" />
            전문가 전화 상담
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
