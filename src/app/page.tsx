"use client";

import { useReducer, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Category, DrawnCard, ReadingStep } from "@/lib/types";
import { createSeed, drawThreeCardSpread } from "@/lib/shuffle";
import { useReading } from "@/hooks/useReading";
import StepIndicator from "@/components/StepIndicator";
import QuestionInput from "@/components/QuestionInput";
import CardSpread from "@/components/CardSpread";
import LoadingOracle from "@/components/LoadingOracle";
import ReadingResult from "@/components/ReadingResult";

interface State {
  step: ReadingStep;
  question: string;
  category: Category | null;
  drawnCards: DrawnCard[];
  revealedCount: number;
  isAnimating: boolean;
}

type Action =
  | { type: "SUBMIT_QUESTION"; question: string; category: Category }
  | { type: "REVEAL_CARD" }
  | { type: "ANIMATION_COMPLETE" }
  | { type: "START_READING" }
  | { type: "READING_COMPLETE" }
  | { type: "RESET" };

const initialState: State = {
  step: "input",
  question: "",
  category: null,
  drawnCards: [],
  revealedCount: 0,
  isAnimating: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SUBMIT_QUESTION": {
      const seed = createSeed(action.question);
      const drawnCards = drawThreeCardSpread(seed);
      return {
        ...state,
        step: "spread",
        question: action.question,
        category: action.category,
        drawnCards,
        revealedCount: 0,
      };
    }
    case "REVEAL_CARD": {
      const newCount = state.revealedCount + 1;
      return {
        ...state,
        revealedCount: newCount,
        isAnimating: true,
      };
    }
    case "ANIMATION_COMPLETE":
      return {
        ...state,
        isAnimating: false,
      };
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
  const { data: session, status } = useSession();
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { reading, isLoading, error, fetchReading, reset } = useReading();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session && state.revealedCount === 3 && state.step === "spread") {
      const timer = setTimeout(() => {
        dispatch({ type: "START_READING" });
        fetchReading(state.question, state.category!, state.drawnCards);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [session, state.revealedCount, state.step, state.question, state.category, state.drawnCards, fetchReading]);

  useEffect(() => {
    if (session && !isLoading && reading && state.step === "reading") {
      dispatch({ type: "READING_COMPLETE" });
    }
  }, [session, isLoading, reading, state.step]);

  const handleReset = () => {
    dispatch({ type: "RESET" });
    reset();
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <p className="text-foreground/50">読み込み中...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="relative z-10 flex min-h-dvh flex-col items-center px-4 py-8">
      <header className="mb-8 flex w-full max-w-lg flex-col items-center gap-4">
        <div className="flex w-full items-center justify-between">
          <span className="text-xs text-foreground/40">
            {session.user?.name}
          </span>
          <button
            onClick={() => signOut()}
            className="text-xs text-foreground/40 underline transition-colors hover:text-foreground/70"
          >
            ログアウト
          </button>
        </div>
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

          {state.step === "spread" && (
            <CardSpread
              key="spread"
              drawnCards={state.drawnCards}
              revealedCount={state.revealedCount}
              isAnimating={state.isAnimating}
              onReveal={() => dispatch({ type: "REVEAL_CARD" })}
              onAnimationComplete={() => dispatch({ type: "ANIMATION_COMPLETE" })}
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
