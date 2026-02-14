export type Suit = "wands" | "cups" | "swords" | "pentacles";
export type ArcanaType = "major" | "minor";

export interface TarotCard {
  id: string;
  number: number;
  arcana: ArcanaType;
  suit?: Suit;
  nameJa: string;
  nameEn: string;
  uprightKeywords: string[];
  reversedKeywords: string[];
}

export interface DrawnCard {
  card: TarotCard;
  isReversed: boolean;
  position: "past" | "present" | "future";
}

export type Category = "恋愛" | "仕事" | "今日の運勢" | "人間関係" | "健康" | "金運";

export interface ReadingRequest {
  question: string;
  category: Category;
  drawnCards: DrawnCard[];
}

export type ReadingStep = "input" | "select" | "spread" | "reading" | "result";
