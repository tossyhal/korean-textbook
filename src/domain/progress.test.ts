import { productionComplete, summarizeProduction } from "./progress";
import { describe, expect, it } from "vitest";
import {
  dueReviews,
  gradeAnswer,
  newProgress,
  nextStage,
  resumeLesson,
  scheduleReview,
  summarize,
} from "./progress";
import { exportBackup, parseBackup } from "../storage/backup";
import { lessons } from "../content";
import { contentIds } from "./validate-content";
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
  expect(summarize([questions[0]], attempts)).toMatchObject({
    total: 1,
    unavailable: 1,
    attempted: 0,
    unattempted: 1,
    complete: true,
    bySkill: { listening: { total: 1, unavailable: 1, unattempted: 1 } },
  });
  expect(
    summarize([{ ...questions[0], audio: { ...audio, status: "checked" } }], []).complete,
  ).toBe(false);
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
    { ...base, partiallyFinishedLessons: ["missing"] },
  ])
    expect(() => parseBackup(JSON.stringify(invalid), ids)).toThrow();
  const old = JSON.parse(JSON.stringify(base));
  delete old.answerViewedQuestionIds;
  delete old.partiallyFinishedLessons;
  expect(parseBackup(JSON.stringify(old), ids).partiallyFinishedLessons).toEqual([]);
  expect(
    parseBackup(exportBackup({ ...base, partiallyFinishedLessons: ["day-01"] }), ids)
      .partiallyFinishedLessons,
  ).toEqual(["day-01"]);
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

it("バックアップで自己確認と入力練習を復元し、不明なキーを拒否する", () => {
  const p = newProgress();
  p.productionChecks.lesson = [true, false];
  p.drafts["reference-keyboard-letter"] = "ㅎ";
  const ids = {
    ...validIds,
    lessons: new Set(["lesson"]),
    drafts: new Set(["reference-keyboard-letter"]),
  };
  expect(parseBackup(exportBackup(p), ids)).toEqual(p);
  expect(() => parseBackup(exportBackup({ ...p, drafts: { unknown: "x" } }), ids)).toThrow();
  expect(() =>
    parseBackup(exportBackup({ ...p, productionChecks: { unknown: [true] } }), ids),
  ).toThrow();
  const old = JSON.parse(exportBackup(p));
  delete old.productionChecks;
  expect(parseBackup(JSON.stringify(old), ids).productionChecks).toEqual({});
});

it("作文・発話の評価とルーブリック件数を別々に集計する", () => {
  expect(summarizeProduction([true, true, true, true, false], 3)).toEqual({
    rubric: { checked: 3, total: 3 },
    writing: { checked: 1, total: 1 },
    typing: { checked: 0, total: 0 },
    speaking: { checked: 0, total: 1 },
  });
});

it("文字入力や発音を作文に数えず、保存済みのチェック位置を保つ", () => {
  const production = { kind: "typing" as const, prompt: "入力", model: "가", rubric: ["確認"] };
  const checks = [true, true, true];
  expect(summarizeProduction(checks, 1, production.kind)).toEqual({
    rubric: { checked: 1, total: 1 },
    writing: { checked: 0, total: 0 },
    typing: { checked: 1, total: 1 },
    speaking: { checked: 1, total: 1 },
  });
  expect(productionComplete(production, checks, "가")).toBe(true);
  expect(productionComplete(production, checks, " ")).toBe(false);
  expect(productionComplete({ ...production, kind: "speaking" }, [true, false, true])).toBe(true);
  expect(productionComplete({ ...production, kind: "speaking" }, [true, true, false])).toBe(false);
});

it("最後の課と完了状態から再開先を選び、旧データも維持する", () => {
  const lessons = Array.from({ length: 56 }, (_, i) => ({ id: `day-${i + 1}` }));
  const p = {
    ...newProgress(),
    positions: { "day-1": "section-0", "day-10": "exit" },
    lastLessonId: "day-10",
  };
  expect(resumeLesson(lessons, p)?.id).toBe("day-10");
  expect(resumeLesson(lessons, { ...p, completedLessons: ["day-10"] })?.id).toBe("day-11");
  expect(resumeLesson(lessons, { ...p, completedLessons: lessons.map((l) => l.id) })?.id).toBe(
    "day-10",
  );
  const old = JSON.parse(JSON.stringify(p));
  delete old.lastLessonId;
  const restored = parseBackup(JSON.stringify(old), {
    ...validIds,
    lessons: new Set(lessons.map((l) => l.id)),
    positions: new Map([
      ["day-1", new Set(["section-0"])],
      ["day-10", new Set(["exit"])],
    ]),
  });
  expect(restored.lastLessonId).toBeNull();
  expect(restored.positions).toEqual(p.positions);
  expect(resumeLesson(lessons, restored)?.id).toBe("day-1");
  expect(() =>
    parseBackup(JSON.stringify({ ...p, lastLessonId: "missing" }), {
      ...validIds,
      lessons: new Set(lessons.map((l) => l.id)),
      positions: new Map([
        ["day-1", new Set(["section-0"])],
        ["day-10", new Set(["exit"])],
      ]),
    }),
  ).toThrow();
});

it("文字の学習位置を第1〜3課でバックアップ往復し、存在しない位置を拒否する", () => {
  const ids = contentIds(lessons);
  for (const day of [1, 2, 3]) {
    const lesson = lessons.find((item) => item.day === day)!;
    const progress = {
      ...newProgress(),
      lastLessonId: lesson.id,
      positions: { [lesson.id]: "hangul-builder" },
    };
    for (const position of ["hangul-builder", "letter-sound-guide"]) {
      const atPosition = { ...progress, positions: { [lesson.id]: position } };
      expect(parseBackup(exportBackup(atPosition), ids)).toEqual(atPosition);
    }
    expect(() =>
      parseBackup(exportBackup({ ...progress, positions: { [lesson.id]: "unknown" } }), ids),
    ).toThrow();
  }
  const day4 = lessons.find((item) => item.day === 4)!;
  for (const position of ["hangul-builder", "letter-sound-guide"]) {
    expect(() =>
      parseBackup(exportBackup({ ...newProgress(), positions: { [day4.id]: position } }), ids),
    ).toThrow();
  }
});

it("日本語の許容表現と韓国語の分かち書きを個別に判定する", () => {
  const question = (day: number, fragment: string) => {
    const lesson = lessons[day - 1];
    const found = [...lesson.recall, ...lesson.exercises, ...lesson.exitTest].find((item) =>
      item.prompt.includes(fragment),
    );
    if (!found) throw new Error(fragment);
    return found;
  };
  for (const [day, fragment, good, bad] of [
    [2, "濃音に使う修飾キー", "shift", "Ctrl"],
    [3, "代表音の数", "７", "８"],
    [3, "最後にどこを閉じるか", "両唇", "舌"],
    [7, "책이 없어요の意味", "本がない", "本があります"],
    [10, "行かない予定", "가지 않을 거예요", "가지 않을거예요"],
    [17, "忙しいが来ました", "바빴지만 왔어요", "바빴지만왔어요"],
    [23, "水を飲む必要があります", "물을 마셔야 돼요", "물을 마셔야돼요"],
  ] as const) {
    const item = question(day, fragment);
    expect(gradeAnswer(item, good)).toBe("correct");
    expect(gradeAnswer(item, bad)).toBe("incorrect");
  }
});

it("第43・44節は未確認の重要音声を未実施のまま他の問題を完了できる", () => {
  for (const lesson of lessons.slice(42, 44)) {
    const questions = lesson.exitTest;
    expect(
      questions.some((item) => item.requiresVerifiedAudio && item.audio?.status !== "checked"),
    ).toBe(true);
    const attempts = questions
      .filter((item) => !item.requiresVerifiedAudio || item.audio?.status === "checked")
      .map((item) => ({
        questionId: item.id,
        answer: "",
        result: "correct" as const,
        stage: "first" as const,
        at: "now",
      }));
    const result = summarize(questions, attempts);
    expect(result.complete).toBe(true);
    expect(result.unavailable).toBeGreaterThan(0);
    expect(result.unattempted).toBeGreaterThanOrEqual(result.unavailable);
    expect(summarize(questions, attempts.slice(1)).complete).toBe(false);
  }
});

it("キー名の正規化は英数字に限定し、字母とキー位置は区別する", () => {
  const key = lessons[1].exercises.find((item) => item.prompt.includes("濃音に使う修飾キー"))!;
  for (const answer of ["SHIFT", "sHiFt", " ＳＨｉｆｔ "]) {
    expect(gradeAnswer(key, answer)).toBe("correct");
  }
  for (const answer of ["Ctrl", "shift key", "ｓｈｉｆｔᄀ"]) {
    expect(gradeAnswer(key, answer)).toBe("incorrect");
  }
  const latinJamo = { ...key, answers: ["ㄱ"] };
  expect(gradeAnswer(latinJamo, "ᄀ")).toBe("incorrect");
  const letterPosition = { ...key, normalization: "exact" as const, answers: ["q"] };
  expect(gradeAnswer(letterPosition, "Q")).toBe("incorrect");
  const translation = lessons[6].exercises.find((item) =>
    item.prompt.includes("책이 없어요の意味"),
  )!;
  for (const answer of ["本が無い", "本はないです", "本が無いです"]) {
    expect(gradeAnswer(translation, answer)).toBe("correct");
  }
});
