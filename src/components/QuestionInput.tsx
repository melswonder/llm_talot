"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Category } from "@/lib/types";
import { validateQuestion } from "@/lib/content-filter";

const CATEGORIES: Category[] = [
  "恋愛",
  "仕事",
  "今日の運勢",
  "人間関係",
  "健康",
  "金運",
];

interface Props {
  onSubmit: (question: string, category: Category) => void;
}

export default function QuestionInput({ onSubmit }: Props) {
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!category) {
      setError("カテゴリーを選択してください");
      return;
    }
    const validation = validateQuestion(question);
    if (!validation.valid) {
      setError(validation.error!);
      return;
    }
    setError(null);
    onSubmit(question.trim(), category);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex w-full max-w-lg flex-col gap-6"
    >
      <div>
        <h2 className="mb-3 text-lg font-medium text-foreground/80">
          カテゴリーを選択
        </h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setError(null);
              }}
              className={`rounded-full border px-4 py-2 text-sm transition-all ${
                category === cat
                  ? "border-accent bg-accent/20 text-accent"
                  : "border-card-border bg-card-bg text-foreground/60 hover:border-accent/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-medium text-foreground/80">
          何について占いたいですか？
        </h2>
        <textarea
          value={question}
          onChange={(e) => {
            setQuestion(e.target.value);
            setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="例: 今の仕事を続けるべきか悩んでいます..."
          className="h-28 w-full resize-none rounded-xl border border-card-border bg-card-bg p-4 text-foreground placeholder:text-foreground/30 focus:border-accent focus:outline-none"
          maxLength={200}
        />
        <div className="mt-1 text-right text-xs text-foreground/40">
          {question.length}/200
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      <button
        onClick={handleSubmit}
        className="rounded-xl bg-accent px-6 py-3 font-medium text-white transition-all hover:bg-accent-dim active:scale-[0.98]"
      >
        カードを引く
      </button>
    </motion.div>
  );
}
