import { describe, expect, it } from "vitest";
import { gradeAnswer } from "../../../domain/progress";
import { validateContent } from "../../../domain/validate-content";
import { week01 } from "../week01";
import { week02 } from "../week02";
import { week03 } from "../week03";
import { week04 } from "../week04";
import { week05 } from "../week05";
import { day36 } from "./day36";

const previous = [...week01, ...week02, ...week03, ...week04, ...week05];
describe("第36課", () => {
  it("既存課を含め参照と語彙を検証する", () => {
    expect(validateContent([...previous, day36], false)).toEqual([]);
    for (const word of day36.vocabulary) {
      const earlier = previous
        .flatMap((l) => l.vocabulary)
        .find((v) => v.korean === word.korean && v.partOfSpeech === word.partOfSpeech);
      if (earlier) expect(word).toEqual(earlier);
    }
  });
  it("固定入力は句点を許容し異なる答えを拒否する", () => {
    expect(gradeAnswer(day36.exitTest[4], "경기에서。")).toBe("correct");
    expect(gradeAnswer(day36.exitTest[4], "경기에")).toBe("incorrect");
  });
  it("出口の文は例・会話・演習音声と別で、会話の各ターンに二つの例がある", () => {
    const prior = [...day36.examples, ...day36.dialogue].map((x) => x.korean);
    prior.push(...day36.exercises.flatMap((q) => (q.audio ? [q.audio.text] : [])));
    for (const q of day36.exitTest) {
      for (const sentence of prior) {
        expect(q.prompt).not.toContain(sentence);
        expect(q.audio?.text).not.toBe(sentence);
      }
    }
    expect(day36.roleplay?.turns.length).toBeGreaterThanOrEqual(3);
    for (const turn of day36.roleplay?.turns ?? []) {
      expect(turn.responseExamples.length).toBeGreaterThanOrEqual(2);
      expect(turn.partner.audio?.status).toBe("unverified");
    }
  });
});
