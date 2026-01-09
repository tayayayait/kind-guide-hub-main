import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Eye, Lock, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { ObituaryTemplate } from "@/data/mockObituaries";

const templates: Array<{ id: ObituaryTemplate; name: string; desc: string }> = [
  { id: "minimal", name: "미니멀", desc: "깔끔하고 간결한 디자인" },
  { id: "traditional", name: "전통", desc: "격식있는 전통 양식" },
  { id: "nohall", name: "무빈소", desc: "빈소 없는 장례용" },
];

export default function ObituaryCreatePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"form" | "template" | "preview">("form");
  const [form, setForm] = useState({
    deceasedName: "",
    bereaved: "",
    datetime: new Date().toISOString().slice(0, 16),
    location: "",
    contact: "",
    template: "traditional",
    isPrivate: true,
    hasPassword: false,
    password: "",
  });

  const updateForm = (key: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const canProceed = () => {
    if (step === "form") {
      // Basic validation
      return (
        form.deceasedName.trim().length > 0 &&
        form.bereaved.trim().length > 0 &&
        form.location.trim().length > 0
      );
    }
    return true;
  };


  const handleCreate = () => {
    toast({
      title: "부고장이 생성되었습니다",
      description: "링크를 통해 공유할 수 있습니다.",
    });
    navigate("/obituary/1");
  };

  return (
    <PageLayout
      title="부고장 작성"
      headerRight={
        <button
          onClick={() => {
            if (step === "form") {
              navigate("/obituary");
            } else if (step === "template") {
              setStep("form");
            } else {
              setStep("template");
            }
          }}
          className="p-2 hover:bg-muted rounded-lg"
          aria-label="뒤로 가기"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      }
    >
      <div className="px-4 py-4 pb-32">
        {/* Step 1: 정보 입력 */}
        {step === "form" && (
          <div className="space-y-5 animate-fade-in">
            <div className="space-y-2">
              <Label htmlFor="deceasedName">고인 성함 *</Label>
              <Input
                id="deceasedName"
                placeholder="예: 고 홍길동"
                value={form.deceasedName}
                onChange={(e) => updateForm("deceasedName", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bereaved">상주 성함 *</Label>
              <Input
                id="bereaved"
                placeholder="예: 아들 홍길순"
                value={form.bereaved}
                onChange={(e) => updateForm("bereaved", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="datetime">발인 일시 *</Label>
              <Input
                id="datetime"
                type="datetime-local"
                value={form.datetime}
                onChange={(e) => updateForm("datetime", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">장례식장 *</Label>
              <Input
                id="location"
                placeholder="예: 서울성모병원 장례식장 1호실"
                value={form.location}
                onChange={(e) => updateForm("location", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">연락처 (선택)</Label>
              <Input
                id="contact"
                type="tel"
                placeholder="예: 010-1234-5678"
                value={form.contact}
                onChange={(e) => updateForm("contact", e.target.value)}
              />
            </div>

            {/* 공개 설정 */}
            <div className="pt-4 border-t border-border space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Lock className="w-4 h-4" />
                공개 설정
              </h3>

              <div className="flex items-center justify-between p-4 bg-card rounded-lg border border-border">
                <div>
                  <div className="font-medium">링크만 공개</div>
                  <div className="text-sm text-muted-foreground">링크를 아는 사람만 볼 수 있습니다</div>
                </div>
                <Switch
                  checked={form.isPrivate}
                  onCheckedChange={(v) => updateForm("isPrivate", v)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-card rounded-lg border border-border">
                <div>
                  <div className="font-medium">비밀번호 보호</div>
                  <div className="text-sm text-muted-foreground">추가 비밀번호가 필요합니다</div>
                </div>
                <Switch
                  checked={form.hasPassword}
                  onCheckedChange={(v) => updateForm("hasPassword", v)}
                />
              </div>

              {form.hasPassword && (
                <Input
                  type="password"
                  placeholder="비밀번호 입력"
                  value={form.password}
                  onChange={(e) => updateForm("password", e.target.value)}
                />
              )}
            </div>
          </div>
        )}

        {/* Step 2: 템플릿 선택 */}
        {step === "template" && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-semibold">템플릿 선택</h2>
            <RadioGroup
              value={form.template}
              onValueChange={(v) => updateForm("template", v)}
              className="space-y-3"
            >
              {templates.map((template) => (
                <label
                  key={template.id}
                  className={cn(
                    "flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors",
                    form.template === template.id
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/50"
                  )}
                >
                  <RadioGroupItem value={template.id} className="mr-3" />
                  <div className="flex-grow">
                    <div className="font-medium">{template.name}</div>
                    <div className="text-sm text-muted-foreground">{template.desc}</div>
                  </div>
                </label>
              ))}
            </RadioGroup>
          </div>
        )}

        {/* Step 3: 미리보기 */}
        {step === "preview" && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-semibold">미리보기</h2>

            <div className="bg-card rounded-xl border border-border p-6 text-center">
              <div className="text-sm text-muted-foreground mb-2">訃 告</div>
              <h3 className="text-2xl font-bold mb-4">{form.deceasedName}</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>상주: {form.bereaved}</p>
                <p>발인: {new Date(form.datetime).toLocaleString("ko-KR")}</p>
                <p>장소: {form.location}</p>
                {form.contact && <p>연락처: {form.contact}</p>}
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  30일 후 자동 삭제됩니다
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
              {form.isPrivate && (
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  링크만 공개
                </span>
              )}
              {form.hasPassword && (
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  비밀번호 보호
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-14 left-0 right-0 bg-card border-t border-border p-4 safe-bottom">
        <div className="max-w-lg mx-auto flex gap-3">
          {step === "form" && (
            <Button
              onClick={() => setStep("template")}
              disabled={!canProceed()}
              className="flex-1"
            >
              다음: 템플릿 선택
            </Button>
          )}

          {step === "template" && (
            <>
              <Button variant="outline" onClick={() => setStep("form")} className="flex-1">
                이전
              </Button>
              <Button onClick={() => setStep("preview")} className="flex-1 gap-2">
                <Eye className="w-4 h-4" />
                미리보기
              </Button>
            </>
          )}

          {step === "preview" && (
            <>
              <Button variant="outline" onClick={() => setStep("template")} className="flex-1">
                이전
              </Button>
              <Button onClick={handleCreate} className="flex-1 gap-2">
                <Share2 className="w-4 h-4" />
                생성 및 공유
              </Button>
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
