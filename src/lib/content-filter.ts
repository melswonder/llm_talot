const BLOCKED_PATTERNS = [
  /死ね|殺す|自殺|暴力/,
  /\b(kill|suicide|violence)\b/i,
];

const MAX_LENGTH = 200;
const MIN_LENGTH = 2;

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateQuestion(input: string): ValidationResult {
  const trimmed = input.trim();
  if (trimmed.length < MIN_LENGTH) {
    return { valid: false, error: "質問を入力してください" };
  }
  if (trimmed.length > MAX_LENGTH) {
    return { valid: false, error: `質問は${MAX_LENGTH}文字以内で入力してください` };
  }
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        valid: false,
        error: "不適切な内容が含まれています。別の質問をお試しください。",
      };
    }
  }
  return { valid: true };
}
