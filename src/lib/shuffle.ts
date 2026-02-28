import { TAROT_DECK } from "@/data/tarot-deck";
import { DrawnCard, TarotCard } from "./types";

function mulberry32(seed: number) {
  return function (): number {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createSeed(question: string): number {
  const now = Date.now();
  let hash = 0;
  for (let i = 0; i < question.length; i++) {
    hash = (hash << 5) - hash + question.charCodeAt(i);
    hash |= 0;
  }
  return now ^ hash;
}

export function shuffleDeck(seed: number): TarotCard[] {
  const deck = [...TAROT_DECK];
  const rng = mulberry32(seed);
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

const POSITIONS = ["past", "present", "future"] as const;

export function assignPositions(
  selectedCards: TarotCard[],
  seed: number,
): DrawnCard[] {
  const rng = mulberry32(seed);
  return selectedCards.map((card, i) => ({
    card,
    isReversed: rng() > 0.5,
    position: POSITIONS[i],
  }));
}
