import { describe, expect, it } from "vitest";
import { day32 } from "../week05/day32";
import { day34 } from "../week05/day34";
import { day41 } from "../week06/day41";
import { day42 } from "../week06/day42";
import { day44 } from "./day44";
import { day45 } from "./day45";
import { day46 } from "./day46";
import { day48 } from "./day48";
import { day49 } from "./day49";

const clauses = (text: string) =>
  text
    .split(/[.!?。！？]/u)
    .map((s) => s.trim().replace(/^(作文|発話)：/u, ""))
    .filter(Boolean);

describe("確認テストの独立性と復習先", () => {
  it("確認の音声文は練習音声と作文・発話の模範文を再利用しない", () => {
    for (const lesson of [day34, day46]) {
      const prior = [
        ...lesson.exercises.flatMap((q) => (q.audio ? clauses(q.audio.text) : [])),
        ...clauses(lesson.production?.model ?? ""),
        ...clauses(lesson.production?.speakingModel ?? ""),
      ];
      for (const q of lesson.exitTest.filter((q) => q.audio)) {
        for (const clause of clauses(q.audio!.text)) {
          expect(prior).not.toContain(clause);
          if (q.id.endsWith("-90")) expect(prior.some((p) => p.includes(clause))).toBe(false);
        }
      }
    }
  });
  it("指摘された設問は練習と同じ語を同じ技能で再度問わない", () => {
    expect(day32.exitTest.some((q) => q.answers.includes("오른쪽으로"))).toBe(false);
    expect(day44.exitTest.some((q) => /表記옷の終声|먹다の後半/u.test(q.prompt))).toBe(false);
    expect(day45.exitTest.some((q) => /네 개を日本語/u.test(q.prompt))).toBe(false);
    expect(day48.exitTest.some((q) => q.prompt.includes("언제 만나요?"))).toBe(false);
    expect(day41.exitTest.some((q) => q.prompt.includes("재미있어서 한국어를 공부해요"))).toBe(
      false,
    );
    expect(day42.exitTest.some((q) => q.prompt.includes("재미있어서 한국어를 공부해요"))).toBe(
      true,
    );
  });
  it("入力問題は現在形・場所・同行・過去形の復習先を指す", () => {
    expect(
      day49.exitTest.filter((q) => q.id.startsWith("day-49-exit-input-")).map((q) => q.tags[0]),
    ).toEqual([
      "grammar-conjugation",
      "grammar-location",
      "grammar-noun-and",
      "grammar-day09-conjugation",
    ]);
  });
});
