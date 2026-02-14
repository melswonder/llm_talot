"use client";

import { motion } from "framer-motion";
import { DrawnCard, Suit } from "@/lib/types";

const SUIT_COLORS: Record<Suit | "major", string> = {
  wands: "border-red-500/60 bg-suit-wands-bg",
  cups: "border-blue-500/60 bg-suit-cups-bg",
  swords: "border-slate-400/60 bg-suit-swords-bg",
  pentacles: "border-emerald-500/60 bg-suit-pentacles-bg",
  major: "border-amber-500/60 bg-suit-major-bg",
};

const SUIT_ICONS: Record<Suit | "major", string> = {
  wands: "\u{1F525}",
  cups: "\u{1F4A7}",
  swords: "\u{2694}\u{FE0F}",
  pentacles: "\u{1FA99}",
  major: "\u{2B50}",
};

interface Props {
  drawnCard: DrawnCard;
  isRevealed: boolean;
  onClick: () => void;
}

export default function TarotCard({ drawnCard, isRevealed, onClick }: Props) {
  const { card, isReversed } = drawnCard;
  const suitKey = card.suit ?? "major";
  const keywords = isReversed
    ? card.reversedKeywords
    : card.uprightKeywords;

  return (
    <div className="perspective-[1000px]">
      <motion.div
        className="relative h-64 w-44 cursor-pointer"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isRevealed ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        onClick={!isRevealed ? onClick : undefined}
        whileHover={!isRevealed ? { scale: 1.05 } : undefined}
        whileTap={!isRevealed ? { scale: 0.95 } : undefined}
      >
        {/* Card Back */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-xl border-2 border-accent/40 bg-gradient-to-br from-accent/20 to-card-bg"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="text-4xl opacity-60">{"\u{2728}"}</div>
            <div className="text-xs tracking-widest text-foreground/40">
              TAROT
            </div>
          </div>
        </div>

        {/* Card Front */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center rounded-xl border-2 ${SUIT_COLORS[suitKey]} p-3`}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <span className="text-3xl">{SUIT_ICONS[suitKey]}</span>
          <span
            className={`mt-2 text-center text-base font-bold ${
              isReversed ? "rotate-180" : ""
            }`}
          >
            {card.nameJa}
          </span>
          <span className="mt-1 text-xs text-foreground/50">
            {card.nameEn}
          </span>
          {isReversed && (
            <span className="mt-2 rounded-full bg-badge-bg px-2 py-0.5 text-xs text-badge-text">
              逆位置
            </span>
          )}
          <div className="mt-3 flex flex-wrap justify-center gap-1">
            {keywords.map((kw) => (
              <span
                key={kw}
                className="rounded-full bg-tag-bg px-2 py-0.5 text-[10px] text-foreground/70"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
