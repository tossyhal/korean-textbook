import { describe, expect, it } from "vitest";
import {
  dueReviews,
  gradeAnswer,
  newProgress,
  nextStage,
  scheduleReview,
  summarize,
} from "./progress";
import { exportBackup, parseBackup } from "../storage/backup";
import type { Question } from "./content";
const validIds = {
  lessons: new Set<string>(),
  questions: new Set<string>(),
  reviews: new Set<string>(),
};
const q: Question = {
  id: "q",
  type: "input",
  prompt: "入力",
  answers: ["한 글"],
  explanation: "説明",
  tags: [],
};
describe("学習の記録", () => {
  it("NFC正規化し、意味のある空白は維持する", () => {
    expect(gradeAnswer(q, "한 글")).toBe("correct");
    expect(gradeAnswer(q, "한글")).toBe("incorrect");
  });
  it("初回を保持し、再挑戦と答え閲覧後を区別する", () => {
    const a = [
      {
        questionId: "q",
        answer: "x",
        result: "incorrect" as const,
        stage: "first" as const,
        at: "now",
      },
    ];
    expect(nextStage(a, "q", false)).toBe("retry");
    expect(nextStage(a, "q", true)).toBe("after-answer");
    expect(summarize([q], a).correct).toBe(0);
  });
  it("音声不可は未実施で完了にしない", () => {
    const a = [
      {
        questionId: "q",
        answer: "",
        result: "unavailable" as const,
        stage: "first" as const,
        at: "now",
      },
    ];
    expect(summarize([q], a)).toMatchObject({ attempted: 0, unattempted: 1, complete: false });
  });
  it("復習日を月をまたいで設定する", () => {
    expect(
      scheduleReview({ id: "q", due: "2026-01-31", interval: 1 }, "recalled", "2026-01-31").due,
    ).toBe("2026-02-03");
  });
  it("バックアップを往復し、不正なデータを拒否する", () => {
    const p = newProgress();
    expect(parseBackup(exportBackup(p), validIds)).toEqual(p);
    expect(() => parseBackup("{", validIds)).toThrow();
    expect(() => parseBackup('{"version":2}', validIds)).toThrow();
  });
});

it("存在しない教材を参照するバックアップを拒否する", () => {
  const p = newProgress();
  p.completedLessons.push("missing");
  expect(() =>
    parseBackup(exportBackup(p), { lessons: new Set(), questions: new Set(), reviews: new Set() }),
  ).toThrow();
});

it("閲覧状態を保存し、閲覧後の回答は実施済みだが初回得点にしない", () => {
  const progress = newProgress();
  progress.answerViewedQuestionIds.push("q");
  const restored = parseBackup(exportBackup(progress), { ...validIds, questions: new Set(["q"]) });
  const stage = nextStage(restored.attempts, "q", restored.answerViewedQuestionIds.includes("q"));
  const attempts = [
    { questionId: "q", answer: "한 글", result: "correct" as const, stage, at: "now" },
  ];
  expect(summarize([{ ...q, skill: "writing" }], attempts)).toMatchObject({
    firstCorrect: 0,
    firstAttempted: 0,
    attempted: 1,
    afterAnswer: 1,
    unattempted: 0,
    complete: true,
    bySkill: { writing: { attempted: 1, firstCorrect: 0 } },
  });
});

it("重要な未確認音声と未実施の自己評価を完了扱いにしない", () => {
  const audio = {
    text: "가",
    source: "TTS",
    license: "端末",
    voice: "端末",
    status: "unverified" as const,
  };
  const questions: Question[] = [
    { ...q, type: "listening", skill: "listening", audio, requiresVerifiedAudio: true },
    { ...q, id: "self", type: "self", skill: "speaking", answers: [], rubric: ["確認"] },
  ];
  const attempts = [
    {
      questionId: "q",
      answer: "한 글",
      result: "correct" as const,
      stage: "first" as const,
      at: "now",
    },
  ];
  expect(summarize(questions, attempts)).toMatchObject({
    attempted: 0,
    unattempted: 1,
    complete: false,
    self: { total: 1, unattempted: 1 },
  });
  expect(summarize([{ ...questions[0], requiresVerifiedAudio: false }], attempts).attempted).toBe(
    1,
  );
});

it("存在しない日付、参照、位置を拒否し、旧データの閲覧履歴を補完する", () => {
  const ids = {
    lessons: new Set(["day-01"]),
    questions: new Set(["q"]),
    reviews: new Set(["q"]),
    positions: new Map([["day-01", new Set(["section-0"])]]),
  };
  const base = newProgress();
  for (const invalid of [
    { ...base, reviews: [{ id: "q", due: "2026-02-30", interval: 1 }] },
    { ...base, drafts: { missing: "x" } },
    { ...base, notes: { q: "x" } },
    { ...base, positions: { "day-01": "section-1" } },
    { ...base, answerViewedQuestionIds: ["missing"] },
  ])
    expect(() => parseBackup(JSON.stringify(invalid), ids)).toThrow();
  const old = JSON.parse(JSON.stringify(base));
  delete old.answerViewedQuestionIds;
  expect(parseBackup(JSON.stringify(old), ids).answerViewedQuestionIds).toEqual([]);
});

it("再挑戦正答は初回誤答を書き換えず、日付変更で復習対象になる", () => {
  const attempts = [
    {
      questionId: "q",
      answer: "違う",
      result: "incorrect" as const,
      stage: "first" as const,
      at: "1",
    },
    {
      questionId: "q",
      answer: "한 글",
      result: "correct" as const,
      stage: "retry" as const,
      at: "2",
    },
  ];
  expect(summarize([q], attempts)).toMatchObject({
    firstAttempted: 1,
    firstCorrect: 0,
    attempted: 1,
    complete: true,
  });
  expect(dueReviews([{ id: "q", due: "2026-02-01", interval: 1 }], "2026-01-31")).toHaveLength(0);
  expect(dueReviews([{ id: "q", due: "2026-02-01", interval: 1 }], "2026-02-01")).toHaveLength(1);
});
