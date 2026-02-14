"use client";

import { useState, useCallback } from "react";
import { DrawnCard, Category } from "@/lib/types";

export function useReading() {
  const [reading, setReading] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReading = useCallback(
    async (
      question: string,
      category: Category,
      drawnCards: DrawnCard[]
    ) => {
      setIsLoading(true);
      setReading("");
      setError(null);
      try {
        const res = await fetch("/api/reading", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, category, drawnCards }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "占い結果の取得に失敗しました");
        }
        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let result = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          result += decoder.decode(value, { stream: true });
          setReading(result);
        }
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "予期しないエラーが発生しました"
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setReading("");
    setIsLoading(false);
    setError(null);
  }, []);

  return { reading, isLoading, error, fetchReading, reset };
}
