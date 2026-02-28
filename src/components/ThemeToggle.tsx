"use client";

import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="rounded-full border border-card-border bg-card-bg p-2 text-lg transition-all hover:border-accent/50"
      aria-label={theme === "dark" ? "ライトモードに切り替え" : "ダークモードに切り替え"}
    >
      {theme === "dark" ? "\u2600\uFE0F" : "\u{1F319}"}
    </button>
  );
}
