import type { Lesson, Question } from "../../domain/content";
import { summarize, summarizeProduction, type Progress } from "../../domain/progress";

export const skillLabels = {
  reading: "読解",
  listening: "聴解",
  typing: "入力",
  writing: "作文",
  speaking: "発話",
} as const;
type Skill = keyof typeof skillLabels;
export type RecommendationState = "unattempted" | "more" | "review" | "transfer";

export function recommendationState(result: {
  firstAttempted: number;
  firstCorrect: number;
  total: number;
}): RecommendationState {
  if (!result.firstAttempted) return "unattempted";
  if (result.firstAttempted < 5 && result.firstAttempted < result.total) return "more";
  return result.firstCorrect / result.firstAttempted < 0.8 ? "review" : "transfer";
}

export function makeRecommendations(lessons: Lesson[], progress: Progress) {
  const result = summarize(
    lessons.flatMap((lesson) => lesson.exitTest),
    progress.attempts,
  );
  const production = { writing: 0, speaking: 0 };
  for (const lesson of lessons) {
    const checks = summarizeProduction(
      progress.productionChecks[lesson.id] ?? [],
      lesson.production.rubric.length,
    );
    production.writing += checks.writing.checked;
    production.speaking += checks.speaking.checked;
  }
  const skills = (Object.keys(skillLabels) as Skill[]).map((skill) => {
    const summary = result.bySkill[skill];
    const related = lessons
      .filter((lesson) => lesson.exitTest.some((q: Question) => q.skill === skill))
      .sort((a, b) => a.day - b.day);
    const missed = related.filter((lesson) =>
      lesson.exitTest.some(
        (q) =>
          q.skill === skill &&
          progress.attempts.some(
            (a) => a.questionId === q.id && a.stage === "first" && a.result === "incorrect",
          ),
      ),
    );
    const state = recommendationState(summary);
    const unanswered = related.filter((lesson) =>
      lesson.exitTest.some(
        (q) =>
          q.skill === skill &&
          (!q.requiresVerifiedAudio || q.audio?.status === "checked") &&
          !progress.attempts.some(
            (a) => a.questionId === q.id && a.stage === "first" && a.result !== "unavailable",
          ),
      ),
    );
    const weakTags = new Set(
      missed.flatMap((lesson) =>
        lesson.exitTest
          .filter(
            (q) =>
              q.skill === skill &&
              progress.attempts.some(
                (a) => a.questionId === q.id && a.stage === "first" && a.result === "incorrect",
              ),
          )
          .flatMap((q) => q.tags),
      ),
    );
    const weakSources = lessons.filter((lesson) =>
      [...lesson.vocabulary, ...lesson.grammar].some(
        (item) => item.firstDay === lesson.day && weakTags.has(item.id),
      ),
    );
    const fallback = related.length
      ? related
      : skill === "speaking" || skill === "writing"
        ? lessons
        : [];
    const preferred =
      state === "unattempted" || state === "more"
        ? [...unanswered, ...fallback]
        : state === "review"
          ? [...missed, ...weakSources, ...fallback]
          : [...unanswered].reverse().concat([...fallback].reverse());
    const recommended = Array.from(
      new Map(preferred.map((lesson) => [lesson.id, lesson])).values(),
    ).slice(0, 3);
    return { skill, state, related, missed, recommended };
  });
  return { result, production, skills };
}
