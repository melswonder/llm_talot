import { Category, DrawnCard } from "./types";

export function buildReadingPrompt(
  question: string,
  category: Category,
  cards: DrawnCard[]
): string {
  const cardDescriptions = cards
    .map(({ card, isReversed, position }) => {
      const orientation = isReversed ? "逆位置" : "正位置";
      const keywords = isReversed
        ? card.reversedKeywords
        : card.uprightKeywords;
      const positionLabel = {
        past: "過去",
        present: "現在",
        future: "未来",
      }[position];
      return `【${positionLabel}】${card.nameJa}（${orientation}）- キーワード: ${keywords.join("、")}`;
    })
    .join("\n");

  return `あなたは経験豊富なタロット占い師です。温かく、共感的で、希望を持たせる語り口で占い結果を伝えてください。

## 相談内容
カテゴリー: ${category}
質問: ${question}

## 引いたカード
${cardDescriptions}

## 指示
- 各カードの意味を質問に関連付けて解釈してください
- 過去→現在→未来の流れを物語のように語ってください
- カテゴリーに合った具体的なアドバイスを含めてください
- 全体を400〜600文字程度にまとめてください
- 最後に一言の励ましのメッセージを添えてください
- マークダウン形式で見出し（##）を使って構成してください`;
}
