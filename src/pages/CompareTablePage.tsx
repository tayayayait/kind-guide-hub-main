import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, MessageCircle, Phone, X } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CompareSpecsTable } from "@/components/compare/CompareSpecsTable";
import { mockServices, ServiceItem } from "@/data/mockServices";
import { useCompare } from "@/state/compare";
import { useRequireCorePrefs } from "@/hooks/useRequireCorePrefs";

export default function CompareTablePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { ids, setIds, remove, clear } = useCompare();
  const { ensureCore } = useRequireCorePrefs();

  useEffect(() => {
    const idsParam = searchParams.get("ids");
    if (!idsParam) return;
    const ids = idsParam.split(",").map((id) => id.trim()).filter(Boolean);
    if (ids.length > 0) {
      setIds(ids);
    }
  }, [searchParams, setIds]);

  const items = useMemo(
    () =>
      ids
        .map((id) => mockServices.find((service) => service.id === id))
        .filter((item): item is ServiceItem => Boolean(item)),
    [ids],
  );

  if (items.length < 2) {
    return (
      <PageLayout title="비교표">
        <div className="px-4 py-12 text-center text-muted-foreground">
          비교할 항목을 2개 이상 선택해 주세요.
        </div>
        <div className="px-4 pb-24">
          <Button className="w-full" onClick={() => navigate("/")}>
            비교로 돌아가기
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="비교표"
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
      <div className="px-4 py-4 space-y-4 pb-32">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <span
                key={item.id}
                className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-3 py-1 text-sm"
              >
                {item.title}
                <button
                  onClick={() => remove(item.id)}
                  className="p-0.5 hover:bg-primary/20 rounded-full"
                  aria-label={`${item.title} 비교 목록에서 제거`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={clear}>
            초기화
          </Button>
        </div>

        <ScrollArea className="w-full rounded-lg border border-border bg-card">
          <CompareSpecsTable items={items} />
        </ScrollArea>
      </div>

      <div className="fixed bottom-14 left-0 right-0 bg-card border-t border-border p-4 safe-bottom">
        <div className="max-w-lg mx-auto flex gap-3">
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={() => {
              if (!ensureCore()) return;
            }}
          >
            <MessageCircle className="w-4 h-4" />
            상담 요청
          </Button>
          <Button
            className="flex-1 gap-2"
            onClick={() => {
              if (!ensureCore()) return;
            }}
          >
            <Phone className="w-4 h-4" />
            전화 상담
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
