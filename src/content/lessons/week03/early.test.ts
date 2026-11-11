import { describe, expect, it } from "vitest";
import { gradeAnswer } from "../../../domain/progress";
import { validateContent } from "../../../domain/validate-content";
import { week01 } from "../week01";
import { week02 } from "../week02";
import { day15 } from "./day15";
import { day16 } from "./day16";
import { day17 } from "./day17";
import { week03 } from "./index";
const lessons = [day15, day16, day17];
describe("第3週前半", () => {
  it("既存課を含め参照を検証する", () =>
    expect(validateContent([...week01, ...week02, ...week03], false)).toEqual([]));
  it("縮約と句点を受け入れ誤った形を区別する", () => {
    const q = day15.exitTest[0];
    expect(gradeAnswer(q, "집에서 쉬고 영화를 보았어요。")).toBe("correct");
    expect(gradeAnswer(q, "집에서쉬고 영화를 봤어요")).toBe("incorrect");
    const q2 = day16.exercises[2];
    expect(gradeAnswer(q2, "와서")).toBe("correct");
    expect(gradeAnswer(q2, "오아서")).toBe("incorrect");
  });
  it("出口音声を同課の例・会話・練習音声から独立させる", () => {
    for (const lesson of lessons) {
      const prior = new Set([...lesson.examples, ...lesson.dialogue].map((x) => x.korean));
      for (const q of lesson.exercises) if (q.audio) prior.add(q.audio.text);
      for (const q of lesson.exitTest) if (q.audio) expect(prior.has(q.audio.text)).toBe(false);
    }
  });
});
