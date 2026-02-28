"use client";

import { motion } from "framer-motion";
import { DrawnCard } from "@/lib/types";
import TarotCard from "./TarotCard";

const POSITION_LABELS = {
  past: "過去",
  present: "現在",
  future: "未来",
} as const;

interface Props {
  drawnCards: DrawnCard[];
  revealedCount: number;
  isAnimating: boolean;
  onReveal: (index: number) => void;
  onAnimationComplete: () => void;
}

export default function CardSpread({ drawnCards, revealedCount, isAnimating, onReveal, onAnimationComplete }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-6"
    >
      <p className="text-sm text-foreground/50">
        {revealedCount < 3
          ? "カードをタップしてめくってください"
          : "すべてのカードがめくられました"}
      </p>
      <div className="flex flex-wrap justify-center gap-6">
        {drawnCards.map((drawnCard, i) => (
          <div key={drawnCard.card.id} className="flex flex-col items-center gap-2">
            <span className="text-xs font-medium text-accent/70">
              {POSITION_LABELS[drawnCard.position]}
            </span>
            <TarotCard
              drawnCard={drawnCard}
              isRevealed={i < revealedCount}
              isClickable={i === revealedCount && !isAnimating}
              onClick={() => {
                if (i === revealedCount && !isAnimating) {
                  onReveal(i);
                }
              }}
              onAnimationComplete={onAnimationComplete}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
