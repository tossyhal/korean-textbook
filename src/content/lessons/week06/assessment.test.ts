import { describe, expect, it } from "vitest";
import { day39 } from "./day39";
import { day40 } from "./day40";
import { day41 } from "./day41";
import { day42 } from "./day42";

describe("第6週後半の評価", () => {
  it("確認テストに読解・入力・聴解を含め、聴解の原文を設問に出さない", () => {
    expect(day42.exitTest).toHaveLength(24);
    for (const skill of ["reading", "writing", "listening"]) {
      expect(day42.exitTest.some((q) => q.skill === skill)).toBe(true);
    }
    for (const q of day42.exitTest.filter((q) => q.type === "listening")) {
      expect(q.options).toContain(q.answers[0]);
      expect(q.prompt).not.toContain(q.audio!.text);
      expect(q.audio!.status).toBe("unverified");
    }
  });
  it("会話の各ターンに回答例と自己確認を用意する", () => {
    for (const lesson of [day39, day40, day41, day42]) {
      for (const turn of lesson.roleplay!.turns) {
        expect(turn.goal).toBeTruthy();
        expect(turn.responseExamples.length).toBeGreaterThanOrEqual(2);
        expect(turn.rubric.length).toBeGreaterThan(0);
      }
    }
    expect(day42.roleplay!.turns).toHaveLength(6);
  });
  it("練習と出口で同じ原文を使わない", () => {
    for (const lesson of [day39, day40, day41]) {
      const practice = new Set(lesson.exercises.map((q) => q.audio?.text ?? q.prompt));
      for (const q of lesson.exitTest) expect(practice.has(q.audio?.text ?? q.prompt)).toBe(false);
    }
  });
});

import { gradeAnswer } from "../../../domain/progress";
it("指定した固定組立は句読点を許し、語順や分かち書きの誤りを拒む", () => {
  const q = day42.exitTest.find((item) => item.answers.includes("토요일에 공부할 거예요"))!;
  expect(gradeAnswer(q, "토요일에 공부할 거예요.")).toBe("correct");
  expect(gradeAnswer(q, "공부할 거예요 토요일에")).toBe("incorrect");
  expect(gradeAnswer(q, "토요일에 공부할거예요")).toBe("incorrect");
});
