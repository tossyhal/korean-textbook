import { z } from "zod";
import type { Lesson, Question } from "./content";

export const attemptSchema = z.object({
  questionId: z.string().min(1),
  answer: z.string(),
  result: z.enum(["correct", "incorrect", "self", "unavailable"]),
  stage: z.enum(["first", "retry", "after-answer"]),
  at: z.string().min(1),
});
export const reviewSchema = z.object({
  id: z.string().min(1),
  due: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .refine((value) => {
      const date = new Date(`${value}T00:00:00Z`);
      return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
    }),
  interval: z.number().int().min(0),
  outcome: z.enum(["recalled", "understood", "missed"]).optional(),
});
export const progressSchema = z.object({
  version: z.literal(1),
  completedLessons: z.array(z.string()),
  partiallyFinishedLessons: z.array(z.string()).default([]),
  lastLessonId: z.string().min(1).nullable().default(null),
  positions: z.record(z.string(), z.string()),
  drafts: z.record(z.string(), z.string()),
  attempts: z.array(attemptSchema),
  answerViewedQuestionIds: z.array(z.string()).default([]),
  reviews: z.array(reviewSchema),
  reviewHistory: z
    .array(
      z.object({
        day: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        id: z.string().min(1),
        outcome: z.enum(["viewed", "recalled", "understood", "missed"]),
      }),
    )
    .default([]),
  notes: z.record(z.string(), z.string()),
  productionChecks: z.record(z.string(), z.array(z.boolean())).default({}),
  roleplay: z
    .record(z.string(), z.object({ turn: z.number().int().min(0), drafts: z.array(z.string()) }))
    .default({}),
  voiceTransferRuns: z
    .record(
      z.string(),
      z
        .object({
          modelURI: z.string().min(1),
          alternateURI: z.string().min(1),
          at: z.iso.datetime(),
          selfChecked: z.literal(true),
        })
        .refine((run) => run.modelURI !== run.alternateURI),
    )
    .default({}),
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
  partiallyFinishedLessons: [],
  lastLessonId: null,
  positions: {},
  drafts: {},
  attempts: [],
  answerViewedQuestionIds: [],
  reviews: [],
  reviewHistory: [],
  notes: {},
  productionChecks: {},
  roleplay: {},
  voiceTransferRuns: {},
  settings: { mode: 90 },
});

export function resumeLesson<T extends { id: string }>(
  lessons: T[],
  progress: Progress,
): T | undefined {
  const lastIndex = lessons.findIndex((lesson) => lesson.id === progress.lastLessonId);
  const incomplete = (lesson: T) => !progress.completedLessons.includes(lesson.id);
  if (lastIndex >= 0) {
    const last = lessons[lastIndex];
    if (incomplete(last)) return last;
    return lessons.slice(lastIndex + 1).find(incomplete) ?? lessons.find(incomplete) ?? last;
  }
  return (
    lessons.find((lesson) => progress.positions[lesson.id] && incomplete(lesson)) ??
    lessons.find(incomplete) ??
    lessons[0]
  );
}

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
  const summarizeGroup = (group: Question[]) => {
    const rows = group.map((question) => {
      const available = !question.requiresVerifiedAudio || question.audio?.status === "checked";
      const records = available
        ? attempts.filter((a) => a.questionId === question.id && a.result !== "unavailable")
        : [];
      return {
        question,
        first: records.find((a) => a.stage === "first"),
        done: records.length > 0,
        afterAnswer: records.some((a) => a.stage === "after-answer"),
      };
    });
    const automatic = rows.filter((r) => r.question.type !== "self");
    const selfRows = rows.filter((r) => r.question.type === "self");
    const firstAttempted = automatic.filter((r) => r.first).length;
    const firstCorrect = automatic.filter((r) => r.first?.result === "correct").length;
    const attempted = automatic.filter((r) => r.done).length;
    return {
      correct: firstCorrect,
      attempted,
      total: automatic.length,
      unattempted: automatic.length - attempted,
      firstCorrect,
      firstAttempted,
      afterAnswer: automatic.filter((r) => r.afterAnswer).length,
      self: {
        total: selfRows.length,
        attempted: selfRows.filter((r) => r.done).length,
        unattempted: selfRows.filter((r) => !r.done).length,
      },
      complete: rows.every((r) => r.done),
    };
  };
  const overall = summarizeGroup(questions);
  const skills = ["reading", "listening", "writing", "speaking", "typing"] as const;
  const bySkill = Object.fromEntries(
    skills.map((skill) => [skill, summarizeGroup(questions.filter((q) => q.skill === skill))]),
  ) as Record<(typeof skills)[number], typeof overall>;
  return { ...overall, bySkill };
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

export function summarizeProduction(
  checks: boolean[],
  rubricLength: number,
  kind: Lesson["production"]["kind"] = "writing",
) {
  return {
    rubric: { checked: checks.slice(0, rubricLength).filter(Boolean).length, total: rubricLength },
    writing: {
      checked: kind === "writing" && checks[rubricLength] ? 1 : 0,
      total: kind === "writing" ? 1 : 0,
    },
    typing: {
      checked: kind === "typing" && checks[rubricLength] ? 1 : 0,
      total: kind === "typing" ? 1 : 0,
    },
    speaking: { checked: checks[rubricLength + 1] ? 1 : 0, total: 1 },
  };
}

export function productionComplete(
  production: Lesson["production"],
  checks: boolean[],
  draft = "",
) {
  const { kind = "writing", rubric } = production;
  return (
    rubric.every((_, i) => checks[i]) &&
    (kind === "speaking" || (Boolean(draft.trim()) && Boolean(checks[rubric.length]))) &&
    Boolean(checks[rubric.length + 1])
  );
}
