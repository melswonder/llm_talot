"use client";

import { motion } from "framer-motion";
import { DrawnCard } from "@/lib/types";

const POSITION_LABELS = {
  past: "過去",
  present: "現在",
  future: "未来",
} as const;

interface Props {
  reading: string;
  drawnCards: DrawnCard[];
  onReset: () => void;
}

export default function ReadingResult({ reading, drawnCards, onReset }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex w-full max-w-lg flex-col gap-6"
    >
      {/* Card summary */}
      <div className="flex justify-center gap-4">
        {drawnCards.map((dc) => (
          <div
            key={dc.card.id}
            className="flex flex-col items-center gap-1 rounded-lg border border-card-border bg-card-bg px-3 py-2"
          >
            <span className="text-[10px] text-accent/70">
              {POSITION_LABELS[dc.position]}
            </span>
            <span className="text-sm font-medium">{dc.card.nameJa}</span>
            <span className="text-[10px] text-foreground/50">
              {dc.isReversed ? "逆位置" : "正位置"}
            </span>
          </div>
        ))}
      </div>

      {/* AI Reading */}
      <div className="rounded-xl border border-card-border bg-card-bg p-6">
        <div className="max-w-none whitespace-pre-wrap text-sm text-foreground/90">
          {reading}
        </div>
      </div>

      <button
        onClick={onReset}
        className="mx-auto rounded-xl border border-card-border bg-card-bg px-6 py-3 text-sm text-foreground/70 transition-all hover:border-accent/50 hover:text-foreground"
      >
        もう一度占う
      </button>
    </motion.div>
  );
}
