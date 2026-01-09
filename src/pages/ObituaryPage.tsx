import { useState } from "react";
import { Plus, Lock, Calendar, MapPin } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { mockObituaries, Obituary } from "@/data/mockObituaries";

export default function ObituaryPage() {
  const navigate = useNavigate();
  const [obituaries] = useState<Obituary[]>(mockObituaries);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ko-KR", {
      month: "long",
      day: "numeric",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTemplateLabel = (template: string) => {
    switch (template) {
      case "minimal": return "미니멀";
      case "traditional": return "전통";
      case "nohall": return "무빈소";
      default: return template;
    }
  };

  return (
    <PageLayout
      title="부고"
      headerRight={
        <Button size="sm" onClick={() => navigate("/obituary/create")}>
          <Plus className="w-4 h-4 mr-1" />
          새 부고
        </Button>
      }
    >
      <div className="px-4 py-4">
        {obituaries.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold mb-2">부고장이 없습니다</h2>
            <p className="text-sm text-muted-foreground mb-6">
              디지털 부고장을 간편하게 생성하고<br />
              가족, 지인에게 공유하세요.
            </p>
            <Button onClick={() => navigate("/obituary/create")}>
              <Plus className="w-4 h-4 mr-2" />
              부고장 만들기
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {obituaries.map((obituary) => (
              <button
                key={obituary.id}
                onClick={() => navigate(`/obituary/${obituary.id}`)}
                className={cn(
                  "w-full text-left bg-card rounded-lg border border-border p-4",
                  "hover:shadow-md transition-shadow",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold">{obituary.deceasedName}</h3>
                  {obituary.isPrivate && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      <Lock className="w-3 h-3" />
                      비공개
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(obituary.datetime)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{obituary.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded">
                    {getTemplateLabel(obituary.template)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {obituary.expiresAt}까지
                  </span>
                </div>
              </button>
            ))}

            {/* 안내 문구 */}
            <p className="text-xs text-center text-muted-foreground mt-6">
              부고장은 생성 후 30일간 유지됩니다.
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
