import { describe, expect, it } from "vitest";
import { gradeAnswer, newProgress, nextStage, scheduleReview, summarize } from "./progress";
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
