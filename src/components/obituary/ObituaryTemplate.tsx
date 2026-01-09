import { Obituary } from "@/data/mockObituaries";
import { cn } from "@/lib/utils";

interface ObituaryTemplateProps {
  obituary: Obituary;
}

export function ObituaryTemplate({ obituary }: ObituaryTemplateProps) {
  const templateClass =
    obituary.template === "traditional"
      ? "bg-muted/30 border border-border"
      : obituary.template === "nohall"
      ? "bg-card border border-border"
      : "bg-card border border-border";

  return (
    <div className={cn("rounded-xl p-6 text-center", templateClass)}>
      <div className="text-sm text-muted-foreground mb-2">訃 告</div>
      <h1 className="text-2xl font-bold mb-4">{obituary.deceasedName}</h1>
      <div className="space-y-2 text-sm text-muted-foreground">
        <p>상주: {obituary.bereaved}</p>
        <p>발인: {new Date(obituary.datetime).toLocaleString("ko-KR")}</p>
        {obituary.template !== "nohall" ? (
          <p>장소: {obituary.location}</p>
        ) : (
          <p>빈소 없이 가족장으로 진행됩니다.</p>
        )}
        {obituary.contact && <p>연락처: {obituary.contact}</p>}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          30일 후 자동 삭제됩니다 ({obituary.expiresAt})
        </p>
      </div>
    </div>
  );
}
