import { expect, it } from "vitest";
import { validateContent } from "./validate-content";
it("未完成の教材を全課検証で検出する", () => {
  expect(validateContent([], true)).toHaveLength(56);
  expect(validateContent([], false)).toEqual([]);
});
it("不完全な課をスキーマで拒否する", () => {
  expect(validateContent([{ id: "day-01", day: 1 }])).not.toEqual([]);
});

it("教材の未来参照、同一問題、欠落、ID衝突を検出する", () => {
  const question = {
    id: "day-01-ex-01",
    type: "input",
    prompt: "何ですか",
    answers: ["はい"],
    explanation: "説明",
    tags: ["vocab-future"],
    skill: "writing",
    assessmentKind: "practice",
  };
  const lesson = {
    id: "day-01",
    day: 1,
    title: "課",
    objectives: ["目標1", "目標2"],
    prerequisites: [],
    recall: [],
    sections: [{ heading: "本文", paragraphs: ["説明"] }],
    examples: [{ korean: "가", japanese: "か" }],
    dialogue: [{ korean: "가", japanese: "か" }],
    exercises: [question],
    production: { prompt: "課題", model: "例", rubric: ["確認"] },
    exitTest: [{ ...question, id: "day-01-exit-01", assessmentKind: "exit" }],
    vocabulary: [],
    grammar: [],
    reviewTargets: ["vocab-future"],
    modes: { 60: ["学習"], 90: ["学習"], 120: ["学習"] },
    sources: [
      {
        name: "資料",
        url: "https://example.com",
        checkedAt: "2026-01-01",
        checked: "内容",
        status: "checked",
      },
    ],
    languageStatus: "unverified",
    audioStatus: "unverified",
  };
  const future = {
    ...lesson,
    id: "day-02",
    day: 2,
    exercises: [],
    exitTest: [],
    vocabulary: [
      {
        id: "vocab-future",
        korean: "가",
        meaning: "意味",
        partOfSpeech: "名詞",
        dictionaryForm: "가",
        firstDay: 2,
      },
    ],
    grammar: [{ id: "vocab-future", name: "衝突", firstDay: 2 }],
  };
  const errors = validateContent([lesson, future]);
  expect(errors.join("\n")).toMatch(/未習事項の参照/);
  expect(errors.join("\n")).toMatch(/練習と出口テストが同一/);
  expect(errors.join("\n")).toMatch(/出口テストがありません/);
  expect(errors.join("\n")).toMatch(/ID接頭辞が不正|定義または初出日の不一致/);
});
