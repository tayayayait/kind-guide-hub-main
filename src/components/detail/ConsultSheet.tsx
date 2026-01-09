import { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ConsultSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemTitle?: string;
}

export function ConsultSheet({ open, onOpenChange, itemTitle }: ConsultSheetProps) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) {
      toast({
        title: "연락처를 입력해 주세요",
        description: "상담 진행을 위해 연락처가 필요합니다.",
      });
      return;
    }
    toast({
      title: "상담 요청이 접수되었습니다",
      description: "확인 후 빠르게 연락드리겠습니다.",
    });
    setName("");
    setContact("");
    setMessage("");
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="px-0 pb-4">
        <DrawerHeader className="px-4 pb-2">
          <div className="flex items-center justify-between">
            <DrawerTitle>상담 요청</DrawerTitle>
            <DrawerClose asChild>
              <button className="p-2 text-muted-foreground hover:text-foreground" aria-label="닫기">
                <X className="h-5 w-5" />
              </button>
            </DrawerClose>
          </div>
          {itemTitle && <p className="text-sm text-muted-foreground">{itemTitle}</p>}
        </DrawerHeader>
        <form onSubmit={handleSubmit} className="space-y-4 px-4">
          <div className="space-y-2">
            <Label htmlFor="consult-name">이름</Label>
            <Input
              id="consult-name"
              placeholder="예: 홍길동"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="consult-contact">연락처 *</Label>
            <Input
              id="consult-contact"
              type="tel"
              placeholder="예: 010-1234-5678"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="consult-message">요청 사항</Label>
            <Textarea
              id="consult-message"
              placeholder="상담 시 참고할 내용을 적어 주세요"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>
          <Button type="submit" className="w-full">
            상담 요청 보내기
          </Button>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
