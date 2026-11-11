import { describe, expect, it } from "vitest";
import { validateContent } from "../../../domain/validate-content";
import { gradeAnswer } from "../../../domain/progress";
import { week01 } from "../week01";
import { week02 } from "../week02";
import { week03 } from "../week03";
import { day22 } from "./day22";
import { day23 } from "./day23";
import { day24 } from "./day24";

const lessons = [day22, day23, day24];
describe("第4週前半", () => {
  it("既存課と参照を検証する", () =>
    expect(validateContent([...week01, ...week02, ...week03, ...lessons], false)).toEqual([]));
  it("縮約と句点を許容し、分かち書きを保持する", () => {
    const q = day23.exercises[1];
    expect(gradeAnswer(q, "물을 마시어야 해요。")).toBe("correct");
    expect(gradeAnswer(q, "물을 마셔야 해요")).toBe("correct");
    expect(gradeAnswer(q, "물을 마셔야해요")).toBe("incorrect");
    expect(gradeAnswer(day24.exercises[4], "듣으면")).toBe("incorrect");
  });
  it("出口の文章を例、会話、演習の音声にそのまま再利用しない", () => {
    for (const lesson of lessons) {
      const previous = new Set([...lesson.examples, ...lesson.dialogue].map((x) => x.korean));
      for (const q of lesson.exercises) if (q.audio) previous.add(q.audio.text);
      for (const q of lesson.exitTest) {
        if (q.audio) expect(previous.has(q.audio.text)).toBe(false);
        for (const sentence of previous) expect(q.prompt).not.toContain(sentence);
      }
    }
  });
});
