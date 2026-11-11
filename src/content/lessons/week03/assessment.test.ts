import { describe, expect, it } from "vitest";
import { gradeAnswer } from "../../../domain/progress";
import { validateContent } from "../../../domain/validate-content";
import { week01 } from "../week01";
import { week02 } from "../week02";
import { week03 } from "./index";

describe("第3週の評価", () => {
  const find = (id: string) => {
    const q = week03.flatMap((l) => [...l.exercises, ...l.exitTest]).find((q) => q.id === id);
    if (!q) throw new Error(id);
    return q;
  };
  it("既収録21課の構造と参照を検証する", () => {
    expect(validateContent([...week01, ...week02, ...week03], false)).toEqual([]);
  });
  it("範囲と場所の表記を判定する", () => {
    const q = find("day-21-exit-09");
    expect(gradeAnswer(q, "세 시부터 다섯 시까지 학교에서 공부해요。")).toBe("correct");
    expect(gradeAnswer(q, "세시부터 다섯 시까지 학교에서 공부해요")).toBe("incorrect");
    expect(gradeAnswer(q, "세 시부터 다섯 시까지 학교에 공부해요")).toBe("incorrect");
  });
  it("縮約と句点を認め、誤った活用を認めない", () => {
    const q = find("day-20-exit-04");
    for (const answer of ["책을 봤어요。", "책을 보았어요."])
      expect(gradeAnswer(q, answer)).toBe("correct");
    expect(gradeAnswer(find("day-20-exit-05"), "오늘 집에 오았어요")).toBe("incorrect");
    expect(gradeAnswer(find("day-21-exit-13"), "추워서 물을 안 마시어요。")).toBe("correct");
  });
  it("聴解には答えを含む選択肢があり、週末の音声は前課の例文と異なる", () => {
    const lessons = week03.slice(0, 6);
    const previous = new Set(
      lessons.flatMap((l) => [
        ...l.examples.map((x) => x.korean),
        ...l.dialogue.map((x) => x.korean),
        ...l.exercises.flatMap((q) => (q.audio ? [q.audio.text] : [])),
      ]),
    );
    for (const q of week03
      .flatMap((l) => [...l.exercises, ...l.exitTest])
      .filter((q) => q.type === "listening")) {
      expect(q.options).toContain(q.answers[0]);
    }
    for (const q of week03[6].exitTest.filter((q) => q.audio))
      expect(previous.has(q.audio!.text)).toBe(false);
  });
});

describe("第3週の指摘に対する回帰", () => {
  const all = [...week01, ...week02, ...week03];
  const find = (id: string) => {
    const question = all
      .flatMap((l) => [...l.recall, ...l.exercises, ...l.exitTest])
      .find((q) => q.id === id);
    if (!question) throw new Error(id);
    return question;
  };
  it("全21課を公開教材として統合し、語彙の初出を守る", async () => {
    const { lessons } = await import("../../index");
    expect(lessons.slice(0, 21).map((l) => l.day)).toEqual(
      Array.from({ length: 21 }, (_, i) => i + 1),
    );
    for (const [word, day] of [
      ["좋다", 16],
      ["차", 17],
      ["쓰다", 20],
    ] as const) {
      const first = all.flatMap((l) => l.vocabulary).filter((v) => v.dictionaryForm === word);
      expect(first).toHaveLength(1);
      expect(first[0].firstDay).toBe(day);
    }
    expect(find("day-15-exit-02").prompt).not.toContain("사고");
    expect(find("day-17-exit-06").prompt).not.toContain("써요");
    expect(find("day-21-exit-15").answers).not.toContain("집에만 가요");
  });
  it("本形と縮約形を受け入れ、不正な形と空白を区別する", () => {
    for (const [id, answer] of [
      ["day-15-exit-05", "친구를 만나고 물을 마시어요"],
      ["day-16-ex-04", "보아서"],
      ["day-16-ex-05", "하여서"],
      ["day-16-ex-07", "마시어서"],
      ["day-17-exit-01", "어제는 공부하였지만 오늘은 쉬어요"],
    ])
      expect(gradeAnswer(find(id), answer)).toBe("correct");
    expect(gradeAnswer(find("day-16-ex-03"), "오아서")).toBe("incorrect");
    expect(gradeAnswer(find("day-15-exit-05"), "친구를 만나고물을 마시어요")).toBe("incorrect");
  });
  it("評価対象に対応する初出本文へ戻す", () => {
    for (const [id, tag, day, section] of [
      ["day-18-exit-01", "grammar-range", 18, "section-0"],
      ["day-18-exit-03", "grammar-location-review", 18, "section-2"],
      ["day-19-exit-03", "grammar-adjective-modifier", 19, "section-1"],
      ["day-17-exit-04", "grammar-connect-aseo", 16, "section-0"],
      ["day-17-exit-listen-1", "grammar-connect-aseo", 16, "section-0"],
    ] as const) {
      expect(find(id).tags).toContain(tag);
      expect(all[day - 1].grammar.find((g) => g.id === tag)?.sectionId).toBe(section);
    }
  });
  it("各課の出口で本文・例文・会話・練習の文を解答として再利用しない", () => {
    for (const lesson of all) {
      const prior = new Set(
        [...lesson.examples, ...lesson.dialogue].map((x) => x.korean.replace(/[.。]$/u, "")),
      );
      for (const q of lesson.exercises)
        for (const answer of q.answers) prior.add(answer.replace(/[.。]$/u, ""));
      for (const q of lesson.exitTest) {
        if (q.skill !== "writing") continue;
        for (const answer of q.answers) {
          if (answer.split(" ").length >= 3)
            expect(prior.has(answer.replace(/[.。]$/u, "")), `${lesson.day}: ${answer}`).toBe(
              false,
            );
        }
      }
    }
  });
});
