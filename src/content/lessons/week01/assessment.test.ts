import { describe, expect, it } from "vitest";
import { gradeAnswer } from "../../../domain/progress";
import { week01 } from "./index";

const getQuestion = (id: string) => {
  const question = week01
    .flatMap((lesson) => [...lesson.exercises, ...lesson.exitTest])
    .find((q) => q.id === id);
  if (!question) throw new Error(`問題がありません: ${id}`);
  return question;
};

describe("第1週の評価問題", () => {
  it("縮約形と未縮約形、文末句点を許容し、分かち書きを区別する", () => {
    for (const [id, forms] of [
      ["day-06-ex-11", ["물을 마셔요。", "물을 마시어요."]],
      ["day-07-exit-13", ["학교에서 물을 마셔요", "학교에서 물을 마시어요。"]],
      ["day-07-exit-14", ["선생님은 의사예요", "선생님은 의사이에요."]],
    ] as const) {
      const question = getQuestion(id);
      for (const form of forms) expect(gradeAnswer(question, form)).toBe("correct");
      expect(gradeAnswer(question, forms[0].replaceAll(" ", ""))).toBe("incorrect");
    }
  });

  it("日本語で意味を答える聴解は選択肢に正答を含む", () => {
    const questions = week01
      .slice(3)
      .flatMap((lesson) => [...lesson.exercises, ...lesson.exitTest])
      .filter((q) => q.type === "listening" && !q.prompt.includes("書き取"));
    expect(questions.length).toBeGreaterThanOrEqual(8);
    for (const q of questions) {
      expect(q.options?.length).toBeGreaterThanOrEqual(2);
      for (const answer of q.answers) expect(q.options).toContain(answer);
    }
  });

  it("週末の聴解と読解原文を前課の例文・会話・練習音声から流用しない", () => {
    const previous = new Set(
      week01
        .slice(0, 6)
        .flatMap((lesson) => [
          ...lesson.examples.map((e) => e.korean),
          ...lesson.dialogue.map((e) => e.korean),
          ...lesson.exercises.flatMap((q) => (q.audio ? [q.audio.text] : [])),
        ]),
    );
    const originals = week01[6].exitTest.flatMap((q) => [
      ...(q.audio ? [q.audio.text] : []),
      ...Array.from(q.prompt.matchAll(/『([^』]+)』/gu), (match) => match[1]).filter((text) =>
        /[가-힣].*[.!?]/u.test(text),
      ),
    ]);
    expect(originals.length).toBeGreaterThanOrEqual(9);
    for (const original of originals) {
      expect(previous.has(original)).toBe(false);
      for (const sentence of original
        .split(/(?<=[.!?])/u)
        .map((part) => part.trim())
        .filter(Boolean)) {
        expect(previous.has(sentence)).toBe(false);
      }
    }
  });
});
