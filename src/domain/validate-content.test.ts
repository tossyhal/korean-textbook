import { lessons } from "../content";
import { expect, it } from "vitest";
import { productionSpeakingModel, questionSchema } from "./content";
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

it("文法の節参照を初出課で検証する", () => {
  const original = lessons.find((lesson) => lesson.day === 4)!;
  const grammar = original.grammar.find((term) => term.id === "grammar-particles")!;
  expect(grammar.sectionId).toBe("section-1");
  const altered = {
    ...original,
    grammar: original.grammar.map((term) =>
      term.id === grammar.id ? { ...term, sectionId: "section-99" } : term,
    ),
  };
  expect(validateContent([altered]).join("\n")).toContain(
    "文法の参照先がありません: grammar-particles section-99",
  );
});

it("選択肢付き聴解は許容解を選択肢に含める", () => {
  const question = {
    id: "listening-test",
    type: "listening",
    prompt: "意味を選ぶ",
    answers: ["こんにちは"],
    explanation: "説明",
    tags: [],
    options: ["こんにちは", "ありがとう"],
  };
  expect(questionSchema.safeParse(question).success).toBe(true);
  expect(questionSchema.safeParse({ ...question, options: ["ありがとう"] }).success).toBe(false);
  expect(questionSchema.safeParse({ ...question, options: [] }).success).toBe(false);
});

it("録音の手本は発話例を優先し、省略時は従来の模範例を使う", () => {
  const production = {
    prompt: "課題",
    model: "作文：가요. 発話：와요.",
    speakingModel: "와요.",
    rubric: ["確認"],
  };
  expect(productionSpeakingModel(production)).toBe("와요.");
  expect(productionSpeakingModel({ prompt: "課題", model: "가요.", rubric: ["確認"] })).toBe(
    "가요.",
  );
});

it("教材の音声対象に日本語の説明を含めない", () => {
  for (const lesson of lessons) {
    const examples = [
      ...lesson.examples,
      ...lesson.dialogue,
      ...(lesson.roleplay?.turns.flatMap((turn) => [turn.partner, ...turn.responseExamples]) ?? []),
    ];
    const targets = [
      productionSpeakingModel(lesson.production),
      ...examples.flatMap((example) => [
        example.korean,
        ...(example.audio ? [example.audio.text] : []),
      ]),
      ...[...lesson.recall, ...lesson.exercises, ...lesson.exitTest].flatMap((question) =>
        question.audio ? [question.audio.text] : [],
      ),
      ...(lesson.voiceTransfer
        ? [lesson.voiceTransfer.sameSentence.korean, lesson.voiceTransfer.newSentence.korean]
        : []),
    ];
    for (const target of targets)
      expect(target, `Day ${lesson.day}: ${target}`).not.toMatch(/[ぁ-ゟ゠-ヿ一-龯]/u);
  }
});

it("同一節内の出典URL重複を検出し、別節での再利用は許す", () => {
  const original = lessons.find((lesson) => lesson.day === 43)!;
  const duplicate = { ...original, sources: [...original.sources, { ...original.sources[0] }] };
  expect(validateContent([duplicate])).toContain(
    `出典URL重複: ${original.id} ${original.sources[0].url}`,
  );
  const other = lessons.find((lesson) => lesson.day === 44)!;
  const shared = { ...other, sources: [original.sources[0]] };
  expect(
    validateContent([original, shared]).filter((error) => error.startsWith("出典URL重複")),
  ).toEqual([]);
});
