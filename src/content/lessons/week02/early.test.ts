import { describe, expect, it } from "vitest";
import { validateContent } from "../../../domain/validate-content";
import { gradeAnswer } from "../../../domain/progress";
import { week01 } from "../week01";
import { day08 } from "./day08";
import { day09 } from "./day09";
import { day10 } from "./day10";
const lessons = [day08, day09, day10];
describe("第2週前半の教材", () => {
  it("既習課と合わせて参照・評価区分を検証する", () => {
    expect(validateContent([...week01, ...lessons], false)).toEqual([]);
  });
  it("縮約形と句点を許容し、分かち書きと誤った時制を区別する", () => {
    const q = day09.exercises.find((item) => item.id === "day-09-ex-03")!;
    expect(gradeAnswer(q, "봤어요。")).toBe("correct");
    expect(gradeAnswer(q, "보았어요.")).toBe("correct");
    expect(gradeAnswer(q, "봐요")).toBe("incorrect");
    const negative = day08.exitTest.find((item) => item.id === "day-08-exit-02")!;
    expect(gradeAnswer(negative, "책을 안 읽어요.")).toBe("correct");
    expect(gradeAnswer(negative, "책을안읽어요")).toBe("incorrect");
  });
  it("出口の韓国語本文と音声は同課の例文・会話・練習音声と重複しない", () => {
    for (const lesson of lessons) {
      const prior = new Set([...lesson.examples, ...lesson.dialogue].map((e) => e.korean));
      for (const q of lesson.exercises) if (q.audio) prior.add(q.audio.text);
      for (const q of lesson.exitTest) if (q.audio) expect(prior.has(q.audio.text)).toBe(false);
    }
  });
});
