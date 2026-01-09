import { useEffect, useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

import { Users, Truck, Sparkles, Building2, Flame, Flower2, Package } from "lucide-react";

// Types
interface QuoteForm {
  region: string;
  funeralType: string;
  hasHall: boolean;
  cremation: boolean;
  peopleCount: number;
  days: string;
  vehicles: string;
  shroud: string[];
  altarFlowers: boolean;
  suppliesPackage: boolean;
}

const stepLabels = ["기본 정보", "규모/기간", "옵션"];

export default function QuotePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<QuoteForm>({
    region: "",
    funeralType: "",
    hasHall: true,
    cremation: true,
    peopleCount: 50,
    days: "3일",
    vehicles: "1",
    shroud: [],
    altarFlowers: false,
    suppliesPackage: false,
  });


  const updateForm = <K extends keyof QuoteForm>(key: K, value: QuoteForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const regions = ["서울", "경기", "인천", "부산", "대구", "광주", "대전", "기타"];

  // 실시간 예상 비용 계산
  const calculateEstimate = () => {
    let base = 250;
    if (form.funeralType === "general") base += 50;
    if (form.hasHall) base += 80;
    if (form.cremation) base += 50;
    base += Math.floor(form.peopleCount / 50) * 20;
    if (form.days === "3일") base += 30;
    if (form.days === "4일") base += 60;
    if (form.shroud.length > 0) base += form.shroud.length * 30;
    if (form.altarFlowers) base += 40;
    if (form.suppliesPackage) base += 25;

    const min = base;
    const max = Math.round(base * 1.3);
    return { min, max };
  };

  const estimate = calculateEstimate();

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    } else {
      navigate("/quote/result", { state: { form, estimate } });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  const isStepValid = () => {
    if (step === 1) return form.region && form.funeralType;
    if (step === 2) return true;
    return true;
  };

  return (
    <PageLayout title="장례 비용 산출">
      <div className="px-6 py-6">
        <StepIndicator
          currentStep={step}
          totalSteps={3}
          labels={stepLabels}
        />
      </div>

      <div className="px-6 pb-32 space-y-8 animate-fade-in">
        {/* Step 1: 기본 정보 */}
        {step === 1 && (
          <>
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm">1</span>
                어느 지역에서 진행하시나요?
              </h2>
              <div className="grid grid-cols-4 gap-3">
                {regions.map((region) => (
                  <button
                    key={region}
                    onClick={() => updateForm("region", region)}
                    className={cn(
                      "py-3 rounded-xl border text-sm font-medium transition-all duration-200",
                      form.region === region
                        ? "border-primary bg-primary text-primary-foreground shadow-md transform scale-105"
                        : "border-border bg-card hover:bg-muted"
                    )}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm">2</span>
                장례 형태를 선택해주세요
              </h2>
              <div className="space-y-3">
                {[
                  { value: "family", label: "가족장", desc: "가까운 가족만 소규모로 진행" },
                  { value: "general", label: "일반장", desc: "친지, 지인 등 조문객을 맞이함" },
                  { value: "nohall", label: "무빈소", desc: "빈소를 차리지 않고 진행" },
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() => updateForm("funeralType", type.value)}
                    className={cn(
                      "w-full p-5 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between group",
                      form.funeralType === type.value
                        ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary"
                        : "border-border bg-card hover:bg-muted/50"
                    )}
                  >
                    <div>
                      <div className={cn("font-bold text-lg", form.funeralType === type.value ? "text-primary" : "text-foreground")}>
                        {type.label}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">{type.desc}</div>
                    </div>
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                      form.funeralType === type.value ? "border-primary bg-primary" : "border-muted-foreground/30"
                    )}>
                      {form.funeralType === type.value && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-4 pt-2">
              <div className="bg-card p-5 rounded-2xl border border-border shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">빈소 사용</h3>
                    <p className="text-xs text-muted-foreground">장례식장 시설 이용</p>
                  </div>
                </div>
                <Switch checked={form.hasHall} onCheckedChange={(v) => updateForm("hasHall", v)} />
              </div>

              <div className="bg-card p-5 rounded-2xl border border-border shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">화장 진행</h3>
                    <p className="text-xs text-muted-foreground">화장장 이용 비용 포함</p>
                  </div>
                </div>
                <Switch checked={form.cremation} onCheckedChange={(v) => updateForm("cremation", v)} />
              </div>
            </section>
          </>
        )}

        {/* Step 2: 규모/기간 */}
        {step === 2 && (
          <>
            <section className="bg-card p-6 rounded-2xl border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold">예상 조문객 수</h2>
              </div>

              <div className="mb-8 text-center">
                <span className="text-5xl font-bold text-primary tracking-tight">{form.peopleCount}</span>
                <span className="text-xl text-muted-foreground ml-2">명</span>
              </div>

              <Slider
                value={[form.peopleCount]}
                onValueChange={([v]) => updateForm("peopleCount", v)}
                min={0}
                max={500}
                step={10}
                className="py-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>가족장 (0명)</span>
                <span>대규모 (500명)</span>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-4">장례 기간</h2>
              <div className="flex gap-3">
                {["2일", "3일", "4일"].map((day) => (
                  <button
                    key={day}
                    onClick={() => updateForm("days", day)}
                    className={cn(
                      "flex-1 py-4 rounded-xl border-2 text-lg font-bold transition-all",
                      form.days === day
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border bg-card text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <Truck className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold">장의 버스 필요 대수</h2>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {["0", "1", "2", "3"].map((num) => (
                  <button
                    key={num}
                    onClick={() => updateForm("vehicles", num)}
                    className={cn(
                      "py-3 rounded-xl border-2 font-bold transition-all",
                      form.vehicles === num
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border bg-card text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {num}대
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Step 3: 옵션 */}
        {step === 3 && (
          <>
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h2 className="text-xl font-bold">수의 선택 (중복 가능)</h2>
              </div>
              <div className="grid gap-3">
                {[
                  { value: "기본 수의", price: "+30만" },
                  { value: "고급 수의", price: "+80만" },
                  { value: "전통 수의", price: "+150만" }
                ].map((item) => (
                  <label
                    key={item.value}
                    className={cn(
                      "flex items-center p-4 rounded-xl border cursor-pointer transition-all",
                      form.shroud.includes(item.value)
                        ? "border-amber-500 bg-amber-50 dark:bg-amber-900/10"
                        : "border-border bg-card hover:bg-muted"
                    )}
                  >
                    <Checkbox
                      checked={form.shroud.includes(item.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateForm("shroud", [...form.shroud, item.value]);
                        } else {
                          updateForm("shroud", form.shroud.filter((s) => s !== item.value));
                        }
                      }}
                      className="mr-4 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                    />
                    <div className="flex-1 font-medium">{item.value}</div>
                    <div className="text-sm font-semibold text-amber-600">{item.price}</div>
                  </label>
                ))}
              </div>
            </section>

            <div className="space-y-4">
              <div className="bg-card p-5 rounded-2xl border border-border shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-50 text-pink-600 rounded-lg">
                    <Flower2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">제단 꽃 장식</h3>
                    <p className="text-xs text-muted-foreground">풍성한 생화장식 추가</p>
                  </div>
                </div>
                <Switch checked={form.altarFlowers} onCheckedChange={(v) => updateForm("altarFlowers", v)} />
              </div>

              <div className="bg-card p-5 rounded-2xl border border-border shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">장례용품 패키지</h3>
                    <p className="text-xs text-muted-foreground">빈소용품 일체 포함</p>
                  </div>
                </div>
                <Switch checked={form.suppliesPackage} onCheckedChange={(v) => updateForm("suppliesPackage", v)} />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Floating Estimate Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border p-4 pb-8 z-30">
        <div className="max-w-[430px] mx-auto space-y-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-sm font-medium text-muted-foreground">예상 장례 비용</span>
            <div className="text-xl font-bold text-primary">
              {estimate.min} ~ {estimate.max} <span className="text-sm font-normal text-muted-foreground">만원</span>
            </div>
          </div>
          <div className="flex gap-3">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1 h-12 rounded-xl text-base border-border bg-background hover:bg-muted"
              >
                이전 단계
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="flex-[2] h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20"
            >
              {step === 3 ? "상세 견적 보기" : "다음 단계"}
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

