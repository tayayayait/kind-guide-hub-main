import { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export type ReportContext = {
  refType: "service" | "guide" | "price" | "obituary";
  refId: string;
  title?: string;
};

interface ReportIssueSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  context: ReportContext;
}

const categories = [
  { value: "price", label: "가격 정보 상이" },
  { value: "contact", label: "연락처 오류" },
  { value: "typo", label: "오탈자/정보 오류" },
  { value: "other", label: "기타" },
];

export function ReportIssueSheet({ open, onOpenChange, context }: ReportIssueSheetProps) {
  const [category, setCategory] = useState(categories[0].value);
  const [detail, setDetail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!detail.trim()) {
      toast({
        title: "상세 내용을 입력해 주세요",
        description: "구체적인 내용이 있을수록 빠르게 반영됩니다.",
      });
      return;
    }
    toast({
      title: "정정 요청이 접수되었습니다",
      description: "확인 후 반영하겠습니다.",
    });
    setDetail("");
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="px-0 pb-4">
        <DrawerHeader className="px-4 pb-2">
          <div className="flex items-center justify-between">
            <DrawerTitle>정보 오류 신고</DrawerTitle>
            <DrawerClose asChild>
              <button className="p-2 text-muted-foreground hover:text-foreground" aria-label="닫기">
                <X className="h-5 w-5" />
              </button>
            </DrawerClose>
          </div>
          <p className="text-sm text-muted-foreground">
            {context.title ? `${context.title} 관련` : "해당 항목 관련"} 내용을 알려 주세요.
          </p>
        </DrawerHeader>
        <form onSubmit={handleSubmit} className="space-y-4 px-4">
          <div className="space-y-2">
            <Label>카테고리</Label>
            <RadioGroup value={category} onValueChange={setCategory} className="space-y-2">
              {categories.map((item) => (
                <label
                  key={item.value}
                  className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2"
                >
                  <RadioGroupItem value={item.value} />
                  <span className="text-sm">{item.label}</span>
                </label>
              ))}
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="report-detail">상세 내용</Label>
            <Textarea
              id="report-detail"
              placeholder="예: 가격 기준일이 다릅니다. 연락처가 변경되었습니다."
              rows={4}
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
            />
          </div>
          <input type="hidden" name="refType" value={context.refType} />
          <input type="hidden" name="refId" value={context.refId} />
          <Button type="submit" className="w-full">
            신고 제출
          </Button>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
