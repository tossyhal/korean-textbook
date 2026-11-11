import { describe, expect, it } from "vitest";
import { validateContent } from "../../../domain/validate-content";
import { gradeAnswer } from "../../../domain/progress";
import { week01 } from "../week01";
import { week02 } from "../week02";
import { week03 } from "../week03";
import { week04 } from "../week04";
import { day29 } from "./day29";
import { day30 } from "./day30";
import { day31 } from "./day31";
const lessons = [day29, day30, day31];
const all = [...week01, ...week02, ...week03, ...week04, ...lessons];
describe("第5週前半", () => {
  it("既存課を含む参照を検証する", () => expect(validateContent(all, false)).toEqual([]));
  it("新しい課で同じ語のIDと定義を統一する", () => {
    for (const lesson of lessons)
      for (const v of lesson.vocabulary) {
        const previous = all
          .filter((x) => x.day < lesson.day)
          .flatMap((x) => x.vocabulary)
          .find((x) => x.korean === v.korean && x.partOfSpeech === v.partOfSpeech);
        if (previous) expect(v, v.korean).toEqual(previous);
      }
  });
  it("句点を許容し分かち書きは保持する", () => {
    expect(gradeAnswer(day29.exercises[10], "차 두 잔 주세요。")).toBe("correct");
    expect(gradeAnswer(day29.exercises[10], "차 두잔 주세요")).toBe("incorrect");
  });
  it("出口は例・会話・練習音声を再利用しない", () => {
    for (const lesson of lessons) {
      const prior = new Set([...lesson.examples, ...lesson.dialogue].map((x) => x.korean));
      for (const q of lesson.exercises) if (q.audio) prior.add(q.audio.text);
      for (const q of lesson.exitTest) {
        if (q.audio) expect(prior.has(q.audio.text)).toBe(false);
        for (const sentence of prior) expect(q.prompt).not.toContain(sentence);
      }
      expect(lesson.roleplay?.turns.length).toBeGreaterThanOrEqual(3);
      for (const turn of lesson.roleplay?.turns ?? []) {
        expect(turn.responseExamples.length).toBeGreaterThanOrEqual(2);
        expect(turn.partner.audio?.status).toBe("unverified");
      }
    }
  });
});
