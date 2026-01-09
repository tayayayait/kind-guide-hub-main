import { useState } from "react";
import { Clock, ChevronRight } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { guideArticles } from "@/data/mockServices";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function GuidePage() {
  const navigate = useNavigate();

  const categories = ["전체", "절차", "비용", "형태", "부고"];
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const filteredArticles = selectedCategory === "전체"
    ? guideArticles
    : guideArticles.filter((a) => a.category === selectedCategory);

  return (
    <PageLayout title="장례 가이드">
      {/* 카테고리 탭 */}
      <div className="sticky top-14 z-30 bg-background border-b border-border">
        <div className="flex overflow-x-auto hide-scrollbar px-4 py-2 gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        {filteredArticles.map((article) => (
          <button
            key={article.id}
            onClick={() => navigate(`/guide/${article.slug}`)}
            className={cn(
              "w-full text-left bg-card rounded-lg border border-border p-4",
              "hover:shadow-md transition-all",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "flex items-center justify-between gap-4"
            )}
          >
            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">
                  {article.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {article.readTime}
                </span>
              </div>
              <h3 className="font-semibold text-foreground mb-1 truncate">
                {article.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {article.summary}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          </button>
        ))}

        {filteredArticles.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">해당 카테고리의 글이 없습니다.</p>
          </div>
        )}

        {/* 출처 안내 */}
        <p className="text-xs text-center text-muted-foreground pt-4">
          콘텐츠 출처: 보건복지부, 소비자원, 전문가 자문
        </p>
      </div>
    </PageLayout>
  );
}
