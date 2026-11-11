import { describe, expect, it } from "vitest";
import { lessons } from "../../index";
import { gradeAnswer } from "../../../domain/progress";

describe("第8週の統合", () => {
  it("全56課と既出語の初出を参照できる", () => {
    expect(lessons.map((lesson) => lesson.day)).toEqual(
      Array.from({ length: 56 }, (_, index) => index + 1),
    );
    for (const [word, day] of [
      ["지금", 20],
      ["만들다", 26],
      ["같이", 34],
      ["고르다", 50],
      ["기분", 51],
      ["병", 53],
    ] as const) {
      const entry = lessons
        .flatMap((lesson) => lesson.vocabulary)
        .find((v) => v.dictionaryForm === word);
      expect(entry?.firstDay).toBe(day);
      expect(entry?.meaning).toBeTruthy();
      expect(entry?.partOfSpeech).toBeTruthy();
    }
  });
  it("最終評価の既習語を使う固定入力で空白と句点を扱う", () => {
    const question = lessons[55].exitTest.find((q) =>
      q.answers.includes("지금 음악을 듣고 있어요"),
    )!;
    expect(gradeAnswer(question, "지금 음악을 듣고 있어요.")).toBe("correct");
    expect(gradeAnswer(question, "지금음악을 듣고 있어요")).toBe("incorrect");
  });
  it("指摘された入力の許容形と設問別の復習先を保証する", () => {
    const q = (day: number, id: string) => {
      const lesson = lessons[day - 1];
      return [...lesson.recall, ...lesson.exercises, ...lesson.exitTest].find(
        (item) => item.id === id,
      )!;
    };
    expect(gradeAnswer(q(53, "day-53-ex-5"), "내일 오전에 필요하여요.")).toBe("correct");
    expect(gradeAnswer(q(53, "day-53-ex-5"), "내일 오전에 필요해요.")).toBe("correct");
    expect(gradeAnswer(q(54, "day-54-ex-7"), "어디서 만나요?")).toBe("correct");
    expect(gradeAnswer(q(55, "day-55-ex-5"), "도서관에서 공부하여요.")).toBe("correct");
    for (const [day, id, grammarId, firstDay, sectionId] of [
      [53, "day-53-ex-5", "grammar-w8-53-1", 53, "section-1"],
      [53, "day-53-ex-6", "grammar-w8-53-2", 53, "section-2"],
      [54, "day-54-ex-5", "grammar-d-irregular", 20, "section-1"],
      [54, "day-54-ex-6", "grammar-questions", 12, "section-0"],
      [54, "day-54-ex-7", "grammar-questions", 12, "section-0"],
      [55, "day-55-ex-7", "grammar-condition", 24, "section-0"],
      [55, "day-55-ex-5", "grammar-location-review", 18, "section-2"],
      [56, "day-56-ex-08", "grammar-location-review", 18, "section-2"],
    ] as const) {
      const lesson = lessons[day - 1];
      expect(q(day, id).tags).toContain(grammarId);
      expect(lesson.reviewTargets).toContain(grammarId);
      expect(lesson.grammar.find((g) => g.id === grammarId)).toMatchObject({ firstDay, sectionId });
    }
  });
  it("数量と順序の補充は別の情報を統合し、出口と原文を共有しない", () => {
    const shopping = lessons[52];
    const integrated = shopping.exercises.find((q) => q.id === "day-53-ex-9")!;
    expect(integrated.prompt).toContain("내일 오전에 우유 두 병");
    expect(integrated.answers).toContain("明日の午前に牛乳二本");
    expect(shopping.exitTest.every((q) => !q.prompt.includes("내일 오전에 우유 두 병"))).toBe(true);
    const order = lessons[54].exercises.find((q) => q.id === "day-55-ex-12")!;
    expect(order.prompt).toContain("먼저 숙제를 하고");
    expect(order.answers).toContain("宿題をする");
  });
});
