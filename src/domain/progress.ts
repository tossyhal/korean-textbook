import { z } from "zod";
import type { Question } from "./content";

export const attemptSchema = z.object({
  questionId: z.string().min(1),
  answer: z.string(),
  result: z.enum(["correct", "incorrect", "self", "unavailable"]),
  stage: z.enum(["first", "retry", "after-answer"]),
  at: z.string().min(1),
});
export const reviewSchema = z.object({
  id: z.string().min(1),
  due: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  interval: z.number().int().min(0),
  outcome: z.enum(["recalled", "understood", "missed"]).optional(),
});
export const progressSchema = z.object({
  version: z.literal(1),
  completedLessons: z.array(z.string()),
  positions: z.record(z.string(), z.string()),
  drafts: z.record(z.string(), z.string()),
  attempts: z.array(attemptSchema),
  reviews: z.array(reviewSchema),
  notes: z.record(z.string(), z.string()),
  settings: z.object({
    mode: z.union([z.literal(60), z.literal(90), z.literal(120)]),
    voice: z.string().optional(),
  }),
});
export type Progress = z.infer<typeof progressSchema>;
export type Attempt = z.infer<typeof attemptSchema>;
export type Review = z.infer<typeof reviewSchema>;
export const newProgress = (): Progress => ({
  version: 1,
  completedLessons: [],
  positions: {},
  drafts: {},
  attempts: [],
  reviews: [],
  notes: {},
  settings: { mode: 90 },
});

export function normalizeAnswer(value: string, mode: Question["normalization"] = "exact"): string {
  const normalized = value.normalize("NFC").trim();
  if (mode === "spacing") return normalized.replace(/\s+/gu, " ");
  if (mode === "standard") return normalized.replace(/\s+/gu, " ").replace(/[.!?。！？]+$/u, "");
  return normalized;
}
export function gradeAnswer(question: Question, answer: string): "correct" | "incorrect" | "self" {
  if (question.type === "self") return "self";
  return question.answers.some(
    (expected) =>
      normalizeAnswer(expected, question.normalization) ===
      normalizeAnswer(answer, question.normalization),
  )
    ? "correct"
    : "incorrect";
}
export function nextStage(
  attempts: Attempt[],
  questionId: string,
  answerViewed: boolean,
): Attempt["stage"] {
  if (
    answerViewed ||
    attempts.some((a) => a.questionId === questionId && a.stage === "after-answer")
  )
    return "after-answer";
  return attempts.some((a) => a.questionId === questionId && a.result !== "unavailable")
    ? "retry"
    : "first";
}
export function summarize(questions: Question[], attempts: Attempt[]) {
  const results = questions.map((q) => ({
    question: q,
    attempt: attempts.find(
      (a) => a.questionId === q.id && a.stage === "first" && a.result !== "unavailable",
    ),
  }));
  const automatic = results.filter(({ question }) => question.type !== "self");
  const done = automatic.filter(({ attempt }) => attempt);
  return {
    correct: done.filter(({ attempt }) => attempt?.result === "correct").length,
    attempted: done.length,
    total: automatic.length,
    unattempted: automatic.length - done.length,
    complete: results.every(({ attempt }) => !!attempt),
  };
}
export function scheduleReview(
  review: Review,
  outcome: "recalled" | "understood" | "missed",
  today: string,
): Review {
  const interval =
    outcome === "recalled" ? (review.interval < 1 ? 1 : review.interval < 3 ? 3 : 7) : 1;
  const date = new Date(`${today}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + interval);
  return { ...review, interval, due: date.toISOString().slice(0, 10), outcome };
}
export function dueReviews(reviews: Review[], today: string): Review[] {
  return reviews.filter((r) => r.due <= today);
}
