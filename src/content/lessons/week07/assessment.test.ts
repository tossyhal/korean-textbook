import { describe, expect, it } from "vitest";
import { gradeAnswer } from "../../../domain/progress";
import { validateContent } from "../../../domain/validate-content";
import { week01 } from "../week01";
import { week02 } from "../week02";
import { week03 } from "../week03";
import { week04 } from "../week04";
import { week05 } from "../week05";
import { week06 } from "../week06";
import { week07 } from "./index";
import { day49 } from "./day49";
describe("第7週の評価", () => {
  it("49課まで参照とスキーマを検証する", () =>
    expect(
      validateContent(
        [...week01, ...week02, ...week03, ...week04, ...week05, ...week06, ...week07],
        false,
      ),
    ).toEqual([]));
  it("確認試験は24問で聴解・読解・入力を分ける", () => {
    expect(day49.exitTest).toHaveLength(24);
    expect(day49.exitTest.filter((q) => q.skill === "listening")).toHaveLength(12);
    expect(day49.exitTest.some((q) => q.skill === "reading")).toBe(true);
    expect(day49.exitTest.some((q) => q.skill === "typing")).toBe(true);
  });
  it("意味聴解は原文を隠して選択し、音声は未確認のままにする", () => {
    for (const l of week07.slice(3))
      for (const q of [...l.exercises, ...l.exitTest].filter((q) => q.type === "listening")) {
        expect(q.prompt).not.toContain(q.audio!.text);
        expect(q.audio!.status).toBe("unverified");
        expect(q.requiresVerifiedAudio).not.toBe(true);
        if (q.options) expect(q.options).toContain(q.answers[0]);
      }
  });
  it("練習音声と出口音声は別で、書取の句点を許し空白を保つ", () => {
    for (const l of week07.slice(3, 6)) {
      const practice = new Set(l.exercises.map((q) => q.audio?.text).filter(Boolean));
      for (const q of l.exitTest) expect(practice.has(q.audio?.text)).toBe(false);
    }
    const q = day49.exitTest.find((q) => q.answers[0] === "사과를 먹어요")!;
    expect(gradeAnswer(q, "사과를 먹어요.")).toBe("correct");
    expect(gradeAnswer(q, "사과를먹어요")).toBe("incorrect");
  });
  it("第49課の聴解原文は前の教材に先出ししない", () => {
    const previous = [
      ...week01,
      ...week02,
      ...week03,
      ...week04,
      ...week05,
      ...week06,
      ...week07.slice(0, 6),
    ];
    const seen = new Set(
      previous.flatMap((l) => [
        ...l.examples.map((e) => e.korean),
        ...l.dialogue.map((e) => e.korean),
        ...[...l.exercises, ...l.exitTest].flatMap((q) => [q.prompt, q.audio?.text ?? ""]),
      ]),
    );
    for (const q of day49.exitTest.filter((q) => q.type === "listening"))
      expect(seen.has(q.audio!.text)).toBe(false);
  });
  it("第47課に同文と別文を備える", () => {
    expect(week07[4].voiceTransfer?.sameSentence.korean).toBeTruthy();
    expect(week07[4].voiceTransfer?.newSentence.korean).not.toBe(
      week07[4].voiceTransfer?.sameSentence.korean,
    );
  });
  it("雨の理由を尋ねる設問と課固有の産出を保つ", () => {
    const q = day49.exitTest.find((item) => item.id === "day-49-exit-listen-10")!;
    expect(q.audio?.text).toBe("오늘은 비가 와서 집에서 쉬어요.");
    expect(q.prompt).toBe("家で休む理由は？");
    expect(q.answers).toContain("雨だから");
    expect(new Set(week07.slice(3, 6).map((lesson) => lesson.production?.prompt)).size).toBe(3);
    expect(new Set(week07.slice(3, 6).map((lesson) => lesson.recall[0].prompt)).size).toBe(3);
  });
});
