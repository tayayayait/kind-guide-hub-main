import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { copyToClipboard } from "@/lib/share";

interface ShareSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareUrl: string;
  hasPassword: boolean;
}

export function ShareSheet({ open, onOpenChange, shareUrl, hasPassword }: ShareSheetProps) {
  const handleCopy = async () => {
    const ok = await copyToClipboard(shareUrl);
    toast({
      title: ok ? "링크가 복사되었습니다" : "링크 복사에 실패했습니다",
      description: ok ? "공유 대상에게 링크를 전달해 주세요." : "다시 시도해 주세요.",
    });
    if (ok) onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="px-0 pb-4">
        <DrawerHeader className="px-4 pb-2">
          <DrawerTitle>부고장 공유</DrawerTitle>
        </DrawerHeader>
        <div className="space-y-3 px-4">
          <Input value={shareUrl} readOnly />
          {hasPassword && (
            <p className="text-xs text-muted-foreground">
              비밀번호 보호가 설정되어 있습니다. 비밀번호는 별도로 전달해 주세요.
            </p>
          )}
          <div className="flex gap-2">
            <DrawerClose asChild>
              <Button variant="outline" className="flex-1">
                닫기
              </Button>
            </DrawerClose>
            <Button className="flex-1" onClick={handleCopy}>
              링크 복사
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
