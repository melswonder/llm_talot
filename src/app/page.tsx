"use client";

import { useReducer, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Category, DrawnCard, ReadingStep, TarotCard } from "@/lib/types";
import { createSeed, shuffleDeck, assignPositions } from "@/lib/shuffle";
import { useReading } from "@/hooks/useReading";
import StepIndicator from "@/components/StepIndicator";
import QuestionInput from "@/components/QuestionInput";
import CardSelect from "@/components/CardSelect";
import CardSpread from "@/components/CardSpread";
import LoadingOracle from "@/components/LoadingOracle";
import ReadingResult from "@/components/ReadingResult";

interface State {
  step: ReadingStep;
  question: string;
  category: Category | null;
  shuffledDeck: TarotCard[];
  selectedCards: TarotCard[];
  drawnCards: DrawnCard[];
  revealedCount: number;
  seed: number;
}

type Action =
  | { type: "SUBMIT_QUESTION"; question: string; category: Category }
  | { type: "SELECT_CARD"; card: TarotCard }
  | { type: "REVEAL_CARD" }
  | { type: "START_READING" }
  | { type: "READING_COMPLETE" }
  | { type: "RESET" };

const initialState: State = {
  step: "input",
  question: "",
  category: null,
  shuffledDeck: [],
  selectedCards: [],
  drawnCards: [],
  revealedCount: 0,
  seed: 0,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SUBMIT_QUESTION": {
      const seed = createSeed(action.question);
      const shuffledDeck = shuffleDeck(seed);
      return {
        ...state,
        step: "select",
        question: action.question,
        category: action.category,
        shuffledDeck,
        selectedCards: [],
        drawnCards: [],
        revealedCount: 0,
        seed,
      };
    }
    case "SELECT_CARD": {
      const newSelected = [...state.selectedCards, action.card];
      if (newSelected.length === 3) {
        const drawnCards = assignPositions(newSelected, state.seed);
        return {
          ...state,
          step: "spread",
          selectedCards: newSelected,
          drawnCards,
          revealedCount: 0,
        };
      }
      return {
        ...state,
        selectedCards: newSelected,
      };
    }
    case "REVEAL_CARD": {
      const newCount = state.revealedCount + 1;
      return {
        ...state,
        revealedCount: newCount,
      };
    }
    case "START_READING":
      return { ...state, step: "reading" };
    case "READING_COMPLETE":
      return { ...state, step: "result" };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { reading, isLoading, error, fetchReading, reset } = useReading();

  useEffect(() => {
    if (state.revealedCount === 3 && state.step === "spread") {
      const timer = setTimeout(() => {
        dispatch({ type: "START_READING" });
        fetchReading(state.question, state.category!, state.drawnCards);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [state.revealedCount, state.step, state.question, state.category, state.drawnCards, fetchReading]);

  useEffect(() => {
    if (!isLoading && reading && state.step === "reading") {
      dispatch({ type: "READING_COMPLETE" });
    }
  }, [isLoading, reading, state.step]);

  const handleReset = () => {
    dispatch({ type: "RESET" });
    reset();
  };

  return (
    <div className="relative z-10 flex min-h-dvh flex-col items-center px-4 py-8">
      <header className="mb-8 flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold tracking-wider text-foreground">
          {"\u2728"} タロット占い {"\u2728"}
        </h1>
        <StepIndicator currentStep={state.step} />
      </header>

      <main className="flex w-full flex-1 flex-col items-center">
        <AnimatePresence mode="wait">
          {state.step === "input" && (
            <QuestionInput
              key="input"
              onSubmit={(question, category) =>
                dispatch({ type: "SUBMIT_QUESTION", question, category })
              }
            />
          )}

          {state.step === "select" && (
            <CardSelect
              key="select"
              deck={state.shuffledDeck}
              selectedCards={state.selectedCards}
              onSelect={(card) => dispatch({ type: "SELECT_CARD", card })}
            />
          )}

          {state.step === "spread" && (
            <CardSpread
              key="spread"
              drawnCards={state.drawnCards}
              revealedCount={state.revealedCount}
              onReveal={() => dispatch({ type: "REVEAL_CARD" })}
            />
          )}

          {state.step === "reading" && (
            <div key="reading" className="flex w-full max-w-lg flex-col items-center gap-6">
              <LoadingOracle />
              {reading && (
                <div className="w-full rounded-xl border border-card-border bg-card-bg p-6">
                  <div className="whitespace-pre-wrap text-sm text-foreground/90">
                    {reading}
                  </div>
                </div>
              )}
            </div>
          )}

          {state.step === "result" && (
            <ReadingResult
              key="result"
              reading={reading}
              drawnCards={state.drawnCards}
              onReset={handleReset}
            />
          )}
        </AnimatePresence>

        {error && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-950/20 px-4 py-3">
            <p className="text-sm text-red-400">{error}</p>
            <button
              onClick={handleReset}
              className="mt-2 text-xs text-foreground/50 underline"
            >
              最初からやり直す
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
