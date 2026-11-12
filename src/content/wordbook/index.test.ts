import { describe, expect, it } from "vitest";
import { lessons } from "../index";
import { contentIds } from "../../domain/validate-content";
import { newProgress } from "../../domain/progress";
import { exportBackup, parseBackup } from "../../storage/backup";
import { wordbook } from "./index";

describe("単語帳", () => {
  it("教材の全語彙IDを保持し、教材外の語を重複なく収録する", () => {
    const ids = wordbook.map((word) => word.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const word of lessons.flatMap((lesson) => lesson.vocabulary)) {
      expect(ids).toContain(word.id);
    }
    expect(wordbook.some((word) => word.firstDay === undefined)).toBe(true);
  });

  it("確認できた順位を昇順に並べ、順位不明を後ろに置く", () => {
    const known = wordbook.filter((word) => word.frequencyRank !== undefined);
    expect(known.map((word) => word.frequencyRank)).toEqual(
      known.map((word) => word.frequencyRank).sort((a, b) => a! - b!),
    );
    expect(wordbook.slice(known.length).every((word) => word.frequencyRank === undefined)).toBe(
      true,
    );
    expect(
      wordbook.find((word) => word.dictionaryForm === "가다" && word.partOfSpeech === "動詞")
        ?.frequencyRank,
    ).toBe(25);
  });

  it("原資料の同形異義語の順位を教材の別の語義に付けない", () => {
    for (const [id, dictionaryForm, meaning] of [
      ["vocab-jigak", "지각", "遅刻"],
      ["vocab-beda", "베다", "枕などを当てる"],
    ]) {
      expect(wordbook.find((word) => word.id === id)).toMatchObject({
        dictionaryForm,
        meaning,
        frequencyRank: undefined,
      });
    }
  });

  it("基本語と語義を照合した同形異義語の順位を収録する", () => {
    for (const [form, meaning, rank] of [
      ["것", "こと・もの", 1],
      ["하다", "する", 2],
      ["되다", "なる", 5],
      ["나", "私（くだけた言い方）", 8],
      ["우리", "私たち", 13],
      ["년", "年（年数）", 26],
      ["때", "時", 19],
      ["같다", "同じだ・似ている", 22],
      ["잘", "上手に・よく", 68],
      ["말", "言葉・話", 28],
      ["말하다", "話す", 32],
      ["생각하다", "考える", 58],
      ["때문", "ため・せい", 31],
      ["네", "はい", 357],
      ["먹다", "食べる", 70],
      ["쓰다", "書く", 169],
      ["밤", "夜", 276],
      ["타다", "乗る", 260],
      ["감다", "巻く", 4036],
    ] as const) {
      expect(
        wordbook.find((word) => word.dictionaryForm === form && word.meaning === meaning),
      ).toMatchObject({ frequencyRank: rank });
    }
    expect(
      wordbook.find((word) => word.dictionaryForm === "감다" && word.meaning === "（髪を）洗う")
        ?.frequencyRank,
    ).toBeUndefined();
    expect(wordbook.find((word) => word.id === "vocab-number-il")).toMatchObject({
      meaning: "一（日にも使う）",
      frequencyRank: 7600,
    });
  });

  it("教材外の復習をバックアップから復元し、不明IDを拒む", () => {
    const extra = wordbook.find((word) => word.firstDay === undefined)!;
    const progress = newProgress();
    progress.reviews.push({ id: extra.id, due: "2026-01-01", interval: 1 });
    const ids = contentIds(
      lessons,
      wordbook.map((word) => word.id),
    );
    expect(parseBackup(exportBackup(progress), ids).reviews[0].id).toBe(extra.id);
    progress.reviews[0].id = "unknown-word";
    expect(() => parseBackup(exportBackup(progress), ids)).toThrow();
  });
});
