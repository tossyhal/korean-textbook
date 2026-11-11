import { describe, expect, it } from "vitest";
import { gradeAnswer, summarize, summarizeProduction } from "../../../domain/progress";
import { day56 } from "./day56";
import { validateContent } from "../../../domain/validate-content";
import { week01 } from "../week01";
import { week02 } from "../week02";
import { week03 } from "../week03";
import { week04 } from "../week04";
import { week05 } from "../week05";
import { week06 } from "../week06";
import { week07 } from "../week07";
import { week08 } from "./index";

describe("第56課の最終評価", () => {
  it("全56課の参照とスキーマを検証する", () => {
    expect(
      validateContent(
        [...week01, ...week02, ...week03, ...week04, ...week05, ...week06, ...week07, ...week08],
        false,
      ),
    ).toEqual([]);
  });
  it("自動評価は読解・聴解・固定入力を各8問とする", () => {
    expect(day56.exitTest).toHaveLength(24);
    for (const skill of ["reading", "listening", "typing"])
      expect(day56.exitTest.filter((q) => q.skill === skill)).toHaveLength(8);
    expect(day56.exercises).toHaveLength(12);
  });
  it("聴解の原文を問題文に漏らさず、音声は未確認", () => {
    for (const q of day56.exitTest.filter((q) => q.skill === "listening")) {
      expect(q.prompt).not.toContain(q.audio!.text);
      expect(q.audio!.status).toBe("unverified");
      expect(q.options).toContain(q.answers[0]);
    }
  });
  it("固定入力は許容形と句点を認め、空白を保持する", () => {
    const q = day56.exitTest.find((q) => q.answers.includes("책을 읽어도 돼요"))!;
    expect(gradeAnswer(q, "책을 읽어도 되어요.")).toBe("correct");
    expect(gradeAnswer(q, "책을읽어도 돼요")).toBe("incorrect");
    const past = day56.exitTest.find((item) => item.id === "day-56-exit-input-2")!;
    expect(gradeAnswer(past, "어제 영화를 보았어요.")).toBe("correct");
    const targets = [
      "grammar-obligation",
      "grammar-condition",
      "grammar-progressive",
      "grammar-permission",
      "grammar-day-10",
      "grammar-want",
    ];
    targets.forEach((tag, index) =>
      expect(
        day56.exitTest.find((item) => item.id === `day-56-exit-input-${index + 3}`)!.tags,
      ).toContain(tag),
    );
    expect(day56.exitTest.find((item) => item.id === "day-56-exit-08")!.tags).toContain(
      "grammar-verb-modifier-future",
    );
  });
  it("音声不可は未実施、作文と発話の自己評価は自動点数と別", () => {
    const q = day56.exitTest.find((q) => q.skill === "listening")!;
    const result = summarize(day56.exitTest, [
      { questionId: q.id, answer: "", result: "unavailable", stage: "first", at: "2026-11-12" },
    ]);
    expect(result.bySkill.listening.unattempted).toBe(8);
    expect(result.complete).toBe(false);
    expect(summarizeProduction([], day56.production.rubric.length).writing.checked).toBe(0);
    expect(summarizeProduction([], day56.production.rubric.length).speaking.checked).toBe(0);
  });
  it("試験音声と試験読解を本文・練習に先出ししない", () => {
    const prior = JSON.stringify([
      ...week01,
      ...week02,
      ...week03,
      ...week04,
      ...week05,
      ...week06,
      ...week07,
      day56.sections,
      day56.examples,
      day56.dialogue,
      day56.exercises,
    ]);
    for (const q of day56.exitTest.filter((q) => q.skill === "listening"))
      expect(prior).not.toContain(q.audio!.text);
    for (const q of day56.exitTest.filter((q) => q.skill === "reading"))
      expect(prior).not.toContain(q.prompt.split("」")[0].slice(1));
  });
  it("発話と作文は別の課題・模範・観点を持ち、会話は各ターンに条件と2例を備える", () => {
    expect(day56.production.prompt).toContain("作文：");
    expect(day56.production.prompt).toContain("発話：");
    expect(day56.production.rubric.filter((x) => x.startsWith("作文："))).toHaveLength(3);
    expect(day56.production.rubric.filter((x) => x.startsWith("発話："))).toHaveLength(3);
    expect(day56.roleplay!.turns).toHaveLength(4);
    for (const turn of day56.roleplay!.turns) {
      expect(turn.goal).toBeTruthy();
      expect(turn.responseExamples).toHaveLength(2);
      expect(turn.rubric.length).toBeGreaterThan(0);
    }
  });
});
