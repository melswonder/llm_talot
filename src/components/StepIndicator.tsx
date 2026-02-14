"use client";

import { ReadingStep } from "@/lib/types";

const STEPS: { key: ReadingStep; label: string }[] = [
  { key: "input", label: "質問" },
  { key: "spread", label: "カード" },
  { key: "reading", label: "占い" },
  { key: "result", label: "結果" },
];

interface Props {
  currentStep: ReadingStep;
}

export default function StepIndicator({ currentStep }: Props) {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className="flex items-center gap-2">
      {STEPS.map((step, i) => (
        <div key={step.key} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`h-2 w-2 rounded-full transition-all ${
                i <= currentIndex
                  ? "bg-accent scale-125"
                  : "bg-foreground/20"
              }`}
            />
            <span
              className={`text-[10px] ${
                i <= currentIndex
                  ? "text-accent"
                  : "text-foreground/30"
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`mb-4 h-px w-8 ${
                i < currentIndex ? "bg-accent/50" : "bg-foreground/10"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
