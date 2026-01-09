import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PasswordGateDialogProps {
  open: boolean;
  attemptsLeft: number;
  onSubmit: (password: string) => void;
  onClose: () => void;
}

export function PasswordGateDialog({ open, attemptsLeft, onSubmit, onClose }: PasswordGateDialogProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (open) setValue("");
  }, [open]);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>비밀번호 입력</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            보호된 부고장입니다. 비밀번호를 입력해 주세요.
          </p>
          <Input
            type="password"
            placeholder="비밀번호"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">남은 시도: {attemptsLeft}회</p>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              돌아가기
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                onSubmit(value);
              }}
            >
              확인
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
