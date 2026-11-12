import { describe, expect, it } from "vitest";
import { day56 } from "../../content/lessons/week08/day56";
import { gradeAnswer } from "../../domain/progress";
import { displayOptions } from "./options";

describe("選択肢の表示順", () => {
  it("同じ問題では繰り返し同じ順序を返し、元の配列を変更しない", () => {
    const options = Object.freeze(["正解", "誤答1", "誤答2"]);
    const first = displayOptions("question-1", options);
    expect(displayOptions("question-1", options)).toEqual(first);
    expect(first).not.toBe(options);
    expect([...first].sort()).toEqual([...options].sort());
    expect(options).toEqual(["正解", "誤答1", "誤答2"]);
    expect(displayOptions("empty", [])).toEqual([]);
    expect(displayOptions("single", ["一つ"])).toEqual(["一つ"]);
  });

  it("最終テストの読解と聴解で選択肢と採点を保ち、正答位置を分散する", () => {
    const questions = day56.exitTest.filter(
      (q) => q.skill === "reading" || q.skill === "listening",
    );
    expect(questions).toHaveLength(16);
    const positions = questions.map((question) => {
      const originalOptions = [...question.options!];
      const originalAnswers = [...question.answers];
      const displayed = displayOptions(question.id, question.options!);
      expect([...displayed].sort()).toEqual([...originalOptions].sort());
      expect(question.options).toEqual(originalOptions);
      expect(question.answers).toEqual(originalAnswers);
      const selected = displayed.find((option) => question.answers.includes(option))!;
      expect(gradeAnswer(question, selected)).toBe("correct");
      expect(displayOptions(question.id, question.options!)).toEqual(displayed);
      expect(displayOptions(question.id, question.options!)).toContain(selected);
      return displayed.indexOf(selected);
    });
    expect(new Set(positions).size).toBeGreaterThan(1);
    expect(positions.filter((position) => position === 0).length / positions.length).toBeLessThan(
      0.8,
    );
  });
});
