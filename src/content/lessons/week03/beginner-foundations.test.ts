import { describe, expect, it } from "vitest";
import { gradeAnswer } from "../../../domain/progress";
import { day05 } from "../week01/day05";
import { day08 } from "../week02/day08";
import { day15 } from "./day15";
import { day16 } from "./day16";
import { day18 } from "./day18";

describe("初学者の前提", () => {
  it("二重パッチムの読みを使う課の本文で綴りと区別する", () => {
    expect(day05.sections.flatMap((s) => s.paragraphs).join(" ")).toContain("없어요");
    expect(day05.sections.flatMap((s) => s.paragraphs).join(" ")).toContain("[업써요]");
    expect(day08.sections.flatMap((s) => s.paragraphs).join(" ")).toContain("읽어요[일거요]");
    expect(day15.sections[0].paragraphs[0]).toContain("[일꼬]");
  });
  it("形容詞の述語を接続形の前に示し、未登録だった寝るを辞書形で収録する", () => {
    const paragraphs = day16.sections.flatMap((s) => s.paragraphs);
    expect(paragraphs.findIndex((p) => p.includes("形容詞は性質"))).toBeLessThan(
      paragraphs.findIndex((p) => p.includes("-아서/어서は前")),
    );
    expect(day15.vocabulary.find((v) => v.dictionaryForm === "자다")).toMatchObject({
      meaning: "寝る",
      firstDay: 15,
    });
  });
  it("指示語と名詞を結ぶ助詞を場面の練習で区別する", () => {
    const get = (lesson: typeof day05, id: string) => {
      const question = lesson.exercises.find((q) => q.id === id);
      if (!question) throw new Error(id);
      return question;
    };
    expect(gradeAnswer(get(day05, "day-05-ex-foundation-1"), "이것")).toBe("correct");
    expect(gradeAnswer(get(day05, "day-05-ex-foundation-1"), "여기")).toBe("incorrect");
    expect(gradeAnswer(get(day18, "day-18-ex-foundation-1"), "과")).toBe("correct");
    expect(gradeAnswer(get(day18, "day-18-ex-foundation-1"), "와")).toBe("incorrect");
  });
});

describe("前半の評価素材", () => {
  it("依頼と聴く動作の指示に合う形を採点する", async () => {
    const { day12 } = await import("../week02/day12");
    const { day20 } = await import("./day20");
    const question = (items: typeof day12.exitTest, id: string) => {
      const found = items.find((q) => q.id === id);
      if (!found) throw new Error(id);
      return found;
    };
    expect(gradeAnswer(question(day12.exitTest, "day-12-exit-08"), "물을 마시세요")).toBe(
      "correct",
    );
    expect(gradeAnswer(question(day12.exitTest, "day-12-exit-08"), "물을 마셔 주세요")).toBe(
      "incorrect",
    );
    expect(gradeAnswer(question(day20.exitTest, "day-20-exit-03"), "몰라서 설명을 들어요")).toBe(
      "correct",
    );
  });
  it("中間確認の聴解素材は読解問題の原文と重ならない", async () => {
    const { day28 } = await import("../week04/day28");
    const readingPrompts = day28.exitTest.filter((q) => q.skill === "reading").map((q) => q.prompt);
    for (const question of day28.exitTest.filter((q) => q.audio)) {
      expect(readingPrompts.some((prompt) => prompt.includes(question.audio!.text))).toBe(false);
    }
  });
});
