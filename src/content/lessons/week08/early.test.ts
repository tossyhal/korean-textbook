import { describe, expect, it } from "vitest";
import { gradeAnswer } from "../../../domain/progress";
import { validateContent } from "../../../domain/validate-content";
import { week01 } from "../week01";
import { week02 } from "../week02";
import { week03 } from "../week03";
import { week04 } from "../week04";
import { week05 } from "../week05";
import { week06 } from "../week06";
import { week07 } from "../week07";
import { day50 } from "./day50";
import { day51 } from "./day51";
import { day52 } from "./day52";
const lessons = [day50, day51, day52];
describe("第8週前半", () => {
  it("第52課まで参照を検証する", () => {
    expect(
      validateContent(
        [...week01, ...week02, ...week03, ...week04, ...week05, ...week06, ...week07, ...lessons],
        false,
      ),
    ).toEqual([]);
  });
  it("出口音声は練習や例と別で、原文を問題文に先出ししない", () => {
    for (const lesson of lessons) {
      const seen = new Set([
        ...lesson.examples.map((x) => x.korean),
        ...lesson.dialogue.map((x) => x.korean),
        ...lesson.exercises.map((x) => x.audio?.text),
      ]);
      for (const q of lesson.exitTest.filter((x) => x.audio)) {
        expect(seen.has(q.audio?.text)).toBe(false);
        expect(q.prompt).not.toContain(q.audio!.text);
        expect(q.audio?.status).toBe("unverified");
      }
    }
  });
  it("自由作文は自己評価、入力は空白と句点を区別する", () => {
    for (const lesson of lessons) {
      const self = lesson.exercises.find((q) => q.type === "self")!;
      expect(self.answers).toEqual([]);
      expect(self.rubric?.length).toBeGreaterThanOrEqual(3);
    }
    const input = day50.exercises.find((q) => q.type === "input")!;
    expect(gradeAnswer(input, "책을 읽어요.")).toBe("correct");
    expect(gradeAnswer(input, "책을읽어요")).toBe("incorrect");
  });
});
