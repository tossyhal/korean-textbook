import { describe, expect, it } from "vitest";
import { gradeAnswer, summarize } from "../../../domain/progress";
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
import { day53 } from "./day53";
import { day54 } from "./day54";
import { day55 } from "./day55";

describe("第53〜55課", () => {
  const lessons = [day53, day54, day55];
  it("前課を含め教材の参照を検証する", () => {
    expect(
      validateContent(
        [
          ...week01,
          ...week02,
          ...week03,
          ...week04,
          ...week05,
          ...week06,
          ...week07,
          day50,
          day51,
          day52,
          ...lessons,
        ],
        false,
      ),
    ).toEqual([]);
  });
  it("自由回答を不正解にせず未回答を未実施にする", () => {
    const q = day54.exitTest.find((item) => item.type === "self")!;
    expect(q.answers).toEqual([]);
    expect(gradeAnswer(q, "自分の答え")).toBe("self");
    expect(summarize([q], [])).toMatchObject({
      self: { total: 1, attempted: 0, unattempted: 1 },
      complete: false,
    });
    for (const lesson of lessons)
      for (const item of [...lesson.recall, ...lesson.exercises, ...lesson.exitTest])
        if (item.type === "self") {
          expect(item.answers).toEqual([]);
          expect(item.rubric?.length).toBeGreaterThanOrEqual(3);
          expect(item.rubric?.length).toBeLessThanOrEqual(5);
        }
  });
  it("通常課として演習と初見の出口を備える", () => {
    for (const lesson of lessons) {
      expect(lesson.lessonKind).not.toBe("exam");
      expect(lesson.exercises.length).toBeGreaterThanOrEqual(12);
      expect(lesson.exitTest.length).toBeGreaterThanOrEqual(5);
    }
    expect(day53.exitTest[0].prompt).toContain("내일 저녁에 빵 세 개");
  });
  it("会話の全ターンに条件、二つの例と確認観点がある", () => {
    for (const lesson of [day53, day54]) {
      expect(lesson.roleplay!.turns.length).toBeGreaterThanOrEqual(4);
      expect(lesson.roleplay!.turns.length).toBeLessThanOrEqual(6);
      for (const turn of lesson.roleplay!.turns) {
        expect(turn.goal.length).toBeGreaterThan(0);
        expect(turn.responseExamples.length).toBeGreaterThanOrEqual(2);
        expect(turn.rubric.length).toBeGreaterThan(0);
        expect(turn.partner.audio?.status).toBe("unverified");
      }
    }
  });
});
