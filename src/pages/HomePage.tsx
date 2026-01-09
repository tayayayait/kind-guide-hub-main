import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Search, Calculator, HeartHandshake, Phone, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HomePage() {
    const navigate = useNavigate();

    return (
        <PageLayout className="pt-0" hideNav={false}>
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-primary text-primary-foreground pb-10 pt-16 px-6 rounded-b-[2rem]">
                <div className="relative z-10 animate-fade-in">
                    <h1 className="text-3xl font-bold leading-tight mb-3">
                        가장 편안한<br />
                        이별의 준비
                    </h1>
                    <p className="text-primary-foreground/80 text-lg mb-8">
                        갑작스러운 순간,<br />
                        투명한 가격 비교로 곁을 지키겠습니다.
                    </p>

                    <div className="flex gap-3">
                        <Button
                            variant="secondary"
                            className="flex-1 h-12 text-base font-semibold shadow-lg hover:bg-secondary/90 transition-all"
                            onClick={() => navigate("/quote")}
                        >
                            <Calculator className="w-5 h-5 mr-2" />
                            예상 비용 산출
                        </Button>
                        <Button
                            className="flex-1 h-12 text-base font-semibold bg-white/10 hover:bg-white/20 border-0 backdrop-blur-sm"
                            onClick={() => navigate("/search")}
                        >
                            <Search className="w-5 h-5 mr-2" />
                            장례식장 찾기
                        </Button>
                    </div>
                </div>

                {/* Background Pattern */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-10 w-48 h-48 bg-secondary/20 rounded-full blur-3xl" />
            </div>

            {/* Quick Services */}
            <div className="px-6 -mt-6 relative z-20">
                <div className="bg-card rounded-2xl p-6 shadow-lg border border-border/50 animate-slide-up">
                    <h2 className="text-lg font-bold mb-4 flex items-center">
                        <HeartHandshake className="w-5 h-5 mr-2 text-accent" />
                        무엇을 도와드릴까요?
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => navigate("/search?type=sangjo")}
                            className="flex flex-col items-center justify-center p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                        >
                            <span className="text-3xl mb-2">🛡️</span>
                            <span className="font-medium">상조 상품 비교</span>
                        </button>
                        <button
                            onClick={() => navigate("/search?type=funeral")}
                            className="flex flex-col items-center justify-center p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                        >
                            <span className="text-3xl mb-2">🏥</span>
                            <span className="font-medium">장례식장 검색</span>
                        </button>
                        <button
                            className="flex flex-col items-center justify-center p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors opacity-60"
                        >
                            <span className="text-3xl mb-2">📚</span>
                            <span className="font-medium text-muted-foreground">장례 절차 (준비중)</span>
                        </button>
                        <button
                            className="flex flex-col items-center justify-center p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors opacity-60"
                        >
                            <span className="text-3xl mb-2">📋</span>
                            <span className="font-medium text-muted-foreground">체크리스트 (준비중)</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Banner / Guide */}
            <div className="px-6 py-8 space-y-4">
                <div className="p-5 bg-secondary/10 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-secondary/20 transition-colors">
                    <div>
                        <h3 className="font-bold text-lg text-secondary-foreground mb-1">긴급 상황이신가요?</h3>
                        <p className="text-sm text-muted-foreground">24시간 상담 센터 연결하기</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shadow-md">
                        <Phone className="w-5 h-5 text-white" />
                    </div>
                </div>

                <div className="p-5 border border-border rounded-2xl flex items-center justify-between cursor-pointer hover:bg-muted transition-colors" onClick={() => navigate("/guide")}>
                    <div>
                        <h3 className="font-medium">처음이라 막막하시죠?</h3>
                        <p className="text-sm text-muted-foreground">장례 절차 A to Z 가이드 보기</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </div>
            </div>
        </PageLayout>
    );
}
