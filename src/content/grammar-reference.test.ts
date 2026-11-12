import { describe, expect, it } from "vitest";
import { lessons } from ".";
import { getGrammarReference } from "./grammar-reference";
import { bindingsEarly } from "./grammar-reference-data/chapter01_03";
import { bindingsMiddle } from "./grammar-reference-data/chapter04_06";
import { bindingsLate } from "./grammar-reference-data/chapter07_08";

describe("文法参照", () => {
  it("自己紹介の文を前の節の終声問題と混同しない", () => {
    const reference = getGrammarReference(lessons, "grammar-day-04")!;
    expect(reference.prompt).toContain("私は学生です");
    expect(reference.answer).toContain("학생이에요");
  });

  it("可能の例文は希望ではなく可能を表す", () => {
    const reference = getGrammarReference(lessons, "grammar-ability")!;
    expect(reference.answer).toContain("수 있어요");
    expect(reference.example?.korean).toContain("수 있어요");
  });

  it("依頼の理由は-(으)니까を答えに含む", () => {
    const reference = getGrammarReference(lessons, "grammar-reason-nikka")!;
    expect(reference.answer).toContain("으니까");
  });

  it("ㄷ変化の例は듣다に対応する", () => {
    const reference = getGrammarReference(lessons, "grammar-d-irregular")!;
    expect(reference.prompt).toContain("듣다");
    expect(reference.answer).toContain("들어요");
    expect(reference.example?.korean).toContain("들어요");
  });

  it("禁止の例は許可ではなく禁止を表す", () => {
    const reference = getGrammarReference(lessons, "grammar-prohibition")!;
    expect(reference.answer).toContain("으면 안 돼요");
    expect(reference.example?.korean).toContain("면 안 돼요");
  });

  it("参照先が不足した場合は無関係な別の例に置き換えない", () => {
    const withoutExamples = lessons.map((lesson) =>
      lesson.day === 13 ? { ...lesson, examples: [] } : lesson,
    );
    expect(getGrammarReference(withoutExamples, "grammar-ability")).toBeUndefined();
    expect(getGrammarReference(lessons, "unknown")).toBeUndefined();
  });
});

it("全ての文法項目が初出節の実在する参照元を持つ", () => {
  const grammar = new Map(
    lessons.flatMap((lesson) => lesson.grammar).map((item) => [item.id, item]),
  );
  const bindings = { ...bindingsEarly, ...bindingsMiddle, ...bindingsLate };
  expect(grammar.size).toBe(165);
  for (const item of grammar.values()) {
    const reference = getGrammarReference(lessons, item.id);
    expect(reference, item.id).toBeDefined();
    if (!reference) continue;
    const binding = bindings[item.id as keyof typeof bindings];
    expect(reference.lesson.day, item.id).toBe(item.firstDay);
    expect(
      reference.lesson.grammar.some((entry) => entry.id === item.id),
      item.id,
    ).toBe(true);
    expect(reference.section, item.id).toBe(
      reference.lesson.sections[Number(item.sectionId?.match(/^section-(\d+)$/)?.[1])],
    );
    expect(reference.prompt.trim(), item.id).not.toBe("");
    expect(reference.answer.trim(), item.id).not.toBe("");
    expect(reference.explanation.trim(), item.id).not.toBe("");
    if (binding.questionId) {
      expect(
        reference.lesson.exercises.some(
          (question) => question.id === binding.questionId && question.answers.length > 0,
        ),
        item.id,
      ).toBe(true);
    } else {
      expect(binding.paragraphIndices?.length, item.id).toBeGreaterThan(0);
      for (const index of binding.paragraphIndices ?? []) {
        expect(reference.section.paragraphs[index]?.trim(), item.id).toBeTruthy();
      }
    }
    if (binding.example) {
      expect(reference.example?.korean, item.id).toBe(binding.example);
      expect(reference.example?.japanese.trim(), item.id).toBeTruthy();
    }
  }
});

it("指定段落が失われた場合は別の段落へ置き換えない", () => {
  const damaged = lessons.map((lesson) =>
    lesson.day === 15
      ? {
          ...lesson,
          sections: lesson.sections.map((section, index) =>
            index === 2 ? { ...section, paragraphs: [] } : section,
          ),
        }
      : lesson,
  );
  expect(getGrammarReference(damaged, "grammar-possession-ui")).toBeUndefined();
});

it("対象の所有表現は同じ節の並列表現ではなく의を参照する", () => {
  const reference = getGrammarReference(lessons, "grammar-possession-ui")!;
  expect(reference.answer).toContain("친구의 책");
});
