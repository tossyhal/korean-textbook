import { describe, expect, it } from "vitest";
import { lessons } from "../src/content";
import { renderReport, reportRows } from "./content-report-data";

describe("教材レポート", () => {
  it("56課を並べ、未収録課を区別する", () => {
    const rows = reportRows([lessons[0]]);
    expect(rows).toHaveLength(56);
    expect(rows[0].lesson?.day).toBe(1);
    expect(rows[1].lesson).toBeUndefined();
    expect(renderReport([lessons[0]], () => undefined)).toContain("| 2 | 未収録 |");
  });

  it("初出課の語彙だけ数え、未確認状態をそのまま表示する", () => {
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
    expect(report).toContain("辞書形の異なり数2、語彙IDの異なり数2");
    expect(report).toContain("| unverified | unverified |");
  });
});
