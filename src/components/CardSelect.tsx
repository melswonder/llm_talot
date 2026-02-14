"use client";

import { motion } from "framer-motion";
import { TarotCard } from "@/lib/types";

interface Props {
  deck: TarotCard[];
  selectedCards: TarotCard[];
  onSelect: (card: TarotCard) => void;
}

export default function CardSelect({ deck, selectedCards, onSelect }: Props) {
  const remaining = 3 - selectedCards.length;
  const selectedIds = new Set(selectedCards.map((c) => c.id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex w-full max-w-2xl flex-col items-center gap-6"
    >
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm text-foreground/50">
          心を落ち着けて、直感で{remaining}枚のカードを選んでください
        </p>
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs ${
                i < selectedCards.length
                  ? "border-accent bg-accent/20 text-accent"
                  : "border-foreground/20 text-foreground/30"
              }`}
            >
              {i < selectedCards.length ? "\u2713" : i + 1}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {deck.map((card, i) => {
          const isSelected = selectedIds.has(card.id);
          return (
            <motion.button
              key={card.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: isSelected ? 0.3 : 1,
                scale: isSelected ? 0.9 : 1,
              }}
              whileHover={!isSelected ? { scale: 1.1, y: -4 } : undefined}
              whileTap={!isSelected ? { scale: 0.95 } : undefined}
              transition={{ delay: i * 0.008 }}
              disabled={isSelected}
              onClick={() => onSelect(card)}
              className={`relative h-16 w-10 rounded-lg border-2 transition-colors ${
                isSelected
                  ? "cursor-default border-accent/40 bg-accent/10"
                  : "cursor-pointer border-accent/30 bg-gradient-to-br from-accent/15 to-card-bg hover:border-accent/60 hover:shadow-[0_0_12px_rgba(139,92,246,0.3)]"
              }`}
            >
              <div className="flex h-full flex-col items-center justify-center">
                <div className="text-lg opacity-50">{"\u2728"}</div>
              </div>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center rounded-lg bg-accent/20"
                >
                  <span className="text-sm text-accent">{"\u2713"}</span>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
