import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Info, MessageCircle, Phone, Plus } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TrustBadge } from "@/components/ui/TrustBadge";
import { ConsultSheet } from "@/components/detail/ConsultSheet";
import { ReportIssueSheet } from "@/components/common/ReportIssueSheet";
import { useCompare } from "@/state/compare";
import { toast } from "@/hooks/use-toast";
import { useRequireCorePrefs } from "@/hooks/useRequireCorePrefs";
import { ServiceItem } from "@/data/mockServices";

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { ensureCore } = useRequireCorePrefs();
  const compare = useCompare();

  const [showConsult, setShowConsult] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showLegend, setShowLegend] = useState(false);

  // 1. Navigation State에서 데이터 확인
  // 2. 없으면 Compare Context에서 확인 (마이페이지에서 진입 시)
  // 3. 없으면 Mock Data에서 확인 (최후의 수단, 하지만 API 데이터는 Mock에 없음)
  // NOTE: 새로고침 시 state가 사라질 수 있으므로, 실제로는 API로 단건 조회하는 로직이 필요하나
  // 현재 ODMS API는 상세 조회 키가 따로 없고 전체 리스트에서 필터링해야 하므로
  // MVP 단계에서는 '뒤로가기'를 안내하거나 목록으로 리다이렉트하는 것이 현실적임.
  const service = useMemo(() => {
    if (location.state?.service) {
      return location.state.service as ServiceItem;
    }
    const fromCompare = compare.items.find((i) => i.id === id);
    if (fromCompare) return fromCompare;

    return null;
  }, [id, location.state, compare.items]);

  const formatPrice = (value: number) => new Intl.NumberFormat("ko-KR").format(value);

  const isSelected = service ? compare.isSelected(service.id) : false;

  const handleToggleCompare = () => {
    if (!service) return;
    const result = compare.toggle(service);
    if (!result.ok) {
      toast({
        title: "최대 3개까지 비교할 수 있어요",
        description: "기존 선택을 해제한 뒤 다시 선택해 주세요.",
      });
    }
  };

  const handleConsult = () => {
    // Unblocking consultation for guest users
    setShowConsult(true);
  };


  if (!service) {
    return (
      <PageLayout title="상세">
        <div className="px-4 py-12 text-center text-muted-foreground">
          <p>정보를 불러올 수 없습니다.</p>
          <p className="text-sm mt-2">목록에서 다시 선택해주세요.</p>
        </div>
        <div className="px-4 pb-24">
          <Button className="w-full" onClick={() => navigate("/")}>
            목록으로 돌아가기
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="상세 보기"
      headerRight={
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-muted rounded-lg"
          aria-label="뒤로 가기"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      }
    >
      <div className="px-4 py-4 space-y-4">
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-20 h-20 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground overflow-hidden">
              {service.serviceType === "funeral" && <span className="text-2xl">🏥</span>}
              {service.serviceType === "sangjo" && <span className="text-2xl">💼</span>}
              {service.serviceType === "cremation" && <span className="text-2xl">⚱️</span>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h1 className="text-lg font-bold truncate leading-tight">{service.title}</h1>
                <Button
                  size="sm"
                  variant={isSelected ? "default" : "outline"}
                  onClick={handleToggleCompare}
                  className="shrink-0 h-8 px-2"
                >
                  {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{service.location}</p>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-primary font-bold">
                  {service.priceMin === 0 ? "가격 정보 없음" : `₩${formatPrice(service.priceMin)}만 ~`}
                </span>
                <TrustBadge type={service.trustType} />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {service.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">기본  정보</h2>
            <Button variant="ghost" size="sm" onClick={() => setShowLegend(true)}>
              <Info className="w-4 h-4 mr-1" />
              배지 설명
            </Button>
          </div>

          <div className="text-sm space-y-2 mb-4">
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="mb-1 text-muted-foreground font-medium">상세 설명</p>
              <p>{service.description || "상세 정보가 없습니다."}</p>
            </div>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="location">
              <AccordionTrigger>위치 안내</AccordionTrigger>
              <AccordionContent>
                {service.location}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="policy">
              <AccordionTrigger>이용 안내</AccordionTrigger>
              <AccordionContent>
                본 정보는 공공데이터포털 및 관계 기관의 자료를 기반으로 제공되며, 실제 운영 상황과 다를 수 있습니다. 정확한 내용은 전화 상담을 통해 확인해주세요.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <p className="mt-4 text-xs text-muted-foreground">
            데이터 기준일: 2025-12-15
          </p>
        </Card>

        <Button variant="outline" onClick={() => setShowReport(true)} className="w-full text-muted-foreground">
          정보 오류 신고
        </Button>
      </div>

      <div className="fixed bottom-14 left-0 right-0 bg-card border-t border-border p-4 safe-bottom">
        <div className="max-w-lg mx-auto flex gap-3">
          <Button variant="outline" className="flex-1 gap-2" onClick={handleConsult}>
            <MessageCircle className="w-4 h-4" />
            상담 요청
          </Button>
          <Button
            className="flex-1 gap-2"
            onClick={() => {
              if (!ensureCore()) return;
              window.location.href = "tel:1577-0000"; // 임시 번호
            }}
          >
            <Phone className="w-4 h-4" />
            전화 상담
          </Button>
        </div>
      </div>

      <ConsultSheet
        open={showConsult}
        onOpenChange={setShowConsult}
        itemTitle={service.title}
      />
      <ReportIssueSheet
        open={showReport}
        onOpenChange={setShowReport}
        context={{ refType: "service", refId: service.id, title: service.title }}
      />
      <Dialog open={showLegend} onOpenChange={setShowLegend}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>신뢰 배지 안내</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <TrustBadge type="public" />
              <span>공공데이터 기반</span>
            </div>
            <div className="flex items-center gap-2">
              <TrustBadge type="partner" />
              <span>제휴사 제공</span>
            </div>
            <div className="flex items-center gap-2">
              <TrustBadge type="report" />
              <span>사용자/업계 제보</span>
            </div>
            <div className="flex items-center gap-2">
              <TrustBadge type="estimate" />
              <span>알고리즘 추산</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
