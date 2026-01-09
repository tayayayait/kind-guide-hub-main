import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ReportIssueSheet } from "@/components/common/ReportIssueSheet";
import { guideArticles } from "@/data/mockServices";
import { mockGuideContents } from "@/data/mockGuideContents";

export default function GuideDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [showReport, setShowReport] = useState(false);

  const content = useMemo(
    () => mockGuideContents.find((item) => item.slug === slug),
    [slug],
  );

  const related = useMemo(() => {
    if (!content) return [];
    return guideArticles
      .filter((article) => article.category === content.category && article.slug !== content.slug)
      .slice(0, 3);
  }, [content]);

  if (!content) {
    return (
      <PageLayout title="가이드 상세">
        <div className="px-4 py-12 text-center text-muted-foreground">
          해당 가이드를 찾을 수 없습니다.
        </div>
        <div className="px-4 pb-24">
          <Button className="w-full" onClick={() => navigate("/guide")}>
            가이드 목록으로
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="가이드"
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
      <div className="px-4 py-4 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{content.category}</Badge>
            <span className="text-xs text-muted-foreground">{content.readTime}</span>
          </div>
          <h1 className="text-2xl font-bold">{content.title}</h1>
          <p className="text-xs text-muted-foreground">
            업데이트: {content.updatedAt}
            {content.nextReviewAt && ` · 다음 검토: ${content.nextReviewAt}`}
          </p>
          {(content.author || content.reviewer) && (
            <p className="text-xs text-muted-foreground">
              {content.author && `작성: ${content.author}`}
              {content.author && content.reviewer && " · "}
              {content.reviewer && `검수: ${content.reviewer}`}
            </p>
          )}
        </div>

        <Separator />

        <div className="space-y-6">
          {content.sections.map((section) => (
            <section key={section.heading} className="space-y-2">
              <h2 className="text-lg font-semibold">{section.heading}</h2>
              <div className="space-y-2 text-sm text-muted-foreground">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <Card className="p-4">
          <h2 className="font-semibold mb-2">출처</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {content.sources.map((source) => (
              <li key={source.label}>• {source.label}</li>
            ))}
          </ul>
        </Card>

        {related.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-semibold">관련 글</h2>
            {related.map((article) => (
              <button
                key={article.slug}
                onClick={() => navigate(`/guide/${article.slug}`)}
                className="w-full text-left"
              >
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary">{article.category}</Badge>
                    <span className="text-xs text-muted-foreground">{article.readTime}</span>
                  </div>
                  <div className="font-semibold text-foreground">{article.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">{article.summary}</div>
                </Card>
              </button>
            ))}
          </div>
        )}

        <Button variant="outline" onClick={() => setShowReport(true)}>
          정보 오류 신고
        </Button>
      </div>

      <ReportIssueSheet
        open={showReport}
        onOpenChange={setShowReport}
        context={{ refType: "guide", refId: content.slug, title: content.title }}
      />
    </PageLayout>
  );
}
