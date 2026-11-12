import { describe, expect, it } from "vitest";
import { lessons } from "../src/content";
import { renderReport, reportRows } from "./content-report-data";

describe("教材レポート", () => {
  it("56節を章・節で並べ、未収録節を区別する", () => {
    const rows = reportRows([lessons[0]]);
    expect(rows).toHaveLength(56);
    expect(rows[0].lesson?.day).toBe(1);
    expect(rows[1].lesson).toBeUndefined();
    expect(renderReport([lessons[0]], () => undefined)).toContain("| 第1章 第2節（2） | 未収録 |");
  });

  it("初出節の語彙だけ数え、未確認状態をそのまま表示する", () => {
    const lesson = structuredClone(lessons[0]);
    lesson.languageStatus = "unverified";
    lesson.audioStatus = "unverified";
    lesson.vocabulary = [
      {
        id: "vocab-a",
        korean: "가요",
        meaning: "行く",
        partOfSpeech: "動詞",
        dictionaryForm: "가다",
        firstDay: 1,
      },
      {
        id: "vocab-b",
        korean: "왔어요",
        meaning: "来た",
        partOfSpeech: "動詞",
        dictionaryForm: "오다",
        firstDay: 2,
      },
    ];
    const row = reportRows([lesson])[0];
    expect(row.newVocabulary).toHaveLength(1);
    const report = renderReport([lesson], () => undefined);
    expect(report).toContain("### 第1章 第1節（内部day 1）");
    expect(report).toContain("辞書形の異なり数2、語彙IDの異なり数2");
    expect(report).toContain("| unverified | unverified |");
  });
});
