import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Share2 } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Obituary, mockObituaries } from "@/data/mockObituaries";
import { ObituaryTemplate } from "@/components/obituary/ObituaryTemplate";
import { PasswordGateDialog } from "@/components/obituary/PasswordGateDialog";
import { ShareSheet } from "@/components/obituary/ShareSheet";
import { toast } from "@/hooks/use-toast";
import { tryWebShare } from "@/lib/share";

type LocationState = {
  obituary?: Obituary;
};

export default function ObituaryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const obituary = useMemo(() => {
    if (state?.obituary) return state.obituary;
    return mockObituaries.find((item) => item.id === id);
  }, [id, state]);

  const [unlocked, setUnlocked] = useState(() => !obituary?.hasPassword);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [shareOpen, setShareOpen] = useState(false);

  const shareUrl = useMemo(() => {
    if (!obituary) return "";
    if (typeof window === "undefined") return `/obituary/${obituary.id}`;
    return `${window.location.origin}/obituary/${obituary.id}`;
  }, [obituary]);

  const handlePasswordSubmit = (value: string) => {
    if (!obituary) return;
    const expected = obituary.password ?? "";
    if (!expected) {
      if (!value.trim()) {
        toast({
          title: "비밀번호를 입력해 주세요",
        });
        return;
      }
      setUnlocked(true);
      return;
    }

    if (value === expected) {
      setUnlocked(true);
      return;
    }

    setAttemptsLeft((prev) => {
      const next = prev - 1;
      if (next <= 0) {
        toast({
          title: "비밀번호 입력 횟수를 초과했습니다",
          description: "잠시 후 다시 시도해 주세요.",
        });
        navigate(-1);
      } else {
        toast({
          title: "비밀번호가 올바르지 않습니다",
          description: `남은 시도 ${next}회`,
        });
      }
      return next;
    });
  };

  const handleShare = async () => {
    if (!obituary) return;
    const shared = await tryWebShare({
      title: `${obituary.deceasedName} 부고`,
      text: `${obituary.deceasedName}님의 부고장입니다.`,
      url: shareUrl,
    });
    if (!shared) {
      setShareOpen(true);
    }
  };

  if (!obituary) {
    return (
      <PageLayout title="부고 상세">
        <div className="px-4 py-12 text-center text-muted-foreground">
          부고장을 찾을 수 없습니다.
        </div>
        <div className="px-4 pb-24">
          <Button className="w-full" onClick={() => navigate("/obituary")}>
            부고 목록으로
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="부고 상세"
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
      <div className="px-4 py-6 space-y-4 pb-24">
        <ObituaryTemplate obituary={obituary} />
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          {obituary.isPrivate && <span>링크만 공개</span>}
          {obituary.hasPassword && <span>비밀번호 보호</span>}
        </div>
      </div>

      <div className="fixed bottom-14 left-0 right-0 bg-card border-t border-border p-4 safe-bottom">
        <div className="max-w-lg mx-auto">
          <Button className="w-full gap-2" onClick={handleShare}>
            <Share2 className="w-4 h-4" />
            공유하기
          </Button>
        </div>
      </div>

      <PasswordGateDialog
        open={!unlocked && obituary.hasPassword}
        attemptsLeft={attemptsLeft}
        onClose={() => navigate(-1)}
        onSubmit={handlePasswordSubmit}
      />
      <ShareSheet
        open={shareOpen}
        onOpenChange={setShareOpen}
        shareUrl={shareUrl}
        hasPassword={obituary.hasPassword}
      />
    </PageLayout>
  );
}
