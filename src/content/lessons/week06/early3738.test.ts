import { describe, expect, it } from "vitest";
import { gradeAnswer } from "../../../domain/progress";
import { validateContent } from "../../../domain/validate-content";
import { week01 } from "../week01";
import { week02 } from "../week02";
import { week03 } from "../week03";
import { week04 } from "../week04";
import { week05 } from "../week05";
import { day36 } from "./day36";
import { day37 } from "./day37";
import { day38 } from "./day38";
const previous = [...week01, ...week02, ...week03, ...week04, ...week05, day36];
describe("第37・38課", () => {
  it("既存課を含め教材参照と既習語を検証する", () => {
    expect(validateContent([...previous, day37, day38], false)).toEqual([]);
    for (const [lesson, earlier] of [
      [day37, previous],
      [day38, [...previous, day37]],
    ] as const)
      for (const word of lesson.vocabulary) {
        const old = earlier
          .flatMap((l) => l.vocabulary)
          .find((v) => v.korean === word.korean && v.partOfSpeech === word.partOfSpeech);
        if (old) expect(word).toEqual(old);
      }
  });
  it("固定入力は句点を許し助詞の誤りを拒否する", () => {
    expect(gradeAnswer(day37.exitTest[4], "대학원에서 공부해요。")).toBe("correct");
    expect(gradeAnswer(day37.exitTest[4], "대학원에 공부해요")).toBe("incorrect");
    expect(gradeAnswer(day38.exitTest[4], "가족은 친절해요.")).toBe("correct");
    expect(gradeAnswer(day38.exitTest[4], "가족는 친절해요")).toBe("incorrect");
  });
  it("出口の文章は既出例と異なりロールプレイは複数例を用意する", () => {
    for (const lesson of [day37, day38]) {
      const prior = [...lesson.examples, ...lesson.dialogue].map((x) => x.korean);
      for (const q of lesson.exitTest)
        for (const sentence of prior) {
          expect(q.prompt).not.toContain(sentence);
          expect(q.audio?.text).not.toBe(sentence);
        }
      expect(lesson.roleplay?.turns.length).toBeGreaterThanOrEqual(3);
      for (const turn of lesson.roleplay?.turns ?? []) {
        expect(turn.responseExamples.length).toBeGreaterThanOrEqual(2);
        expect(turn.partner.audio?.status).toBe("unverified");
      }
    }
  });
});
