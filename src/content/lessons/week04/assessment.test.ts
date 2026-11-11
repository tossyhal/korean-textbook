import { describe, expect, it } from "vitest";
import { gradeAnswer } from "../../../domain/progress";
import { validateContent } from "../../../domain/validate-content";
import { week01 } from "../week01";
import { week02 } from "../week02";
import { week03 } from "../week03";
import { week04 } from "./index";

describe("第4週の評価", () => {
  it("全28課の構造と参照を検証する", () => {
    expect(validateContent([...week01, ...week02, ...week03, ...week04], false)).toEqual([]);
  });
  it("許可の本形・縮約形・句点を受け入れ、分かち書きを守る", () => {
    const q = week04[6].exitTest[11];
    expect(gradeAnswer(q, "물을 마시어도 되어요。")).toBe("correct");
    expect(gradeAnswer(q, "물을 마셔도 돼요")).toBe("correct");
    expect(gradeAnswer(q, "물을 마셔도돼요")).toBe("incorrect");
    expect(gradeAnswer(q, "물을 마시면 안 돼요")).toBe("incorrect");
  });
  it("各聴解は選択肢に正解を含み、中間評価は異なる音声を使う", () => {
    const prior = new Set(
      week04
        .slice(0, 6)
        .flatMap((l) => [
          ...l.examples.map((e) => e.korean),
          ...l.dialogue.map((e) => e.korean),
          ...l.exercises.flatMap((q) => (q.audio ? [q.audio.text] : [])),
        ]),
    );
    for (const q of week04
      .flatMap((l) => [...l.exercises, ...l.exitTest])
      .filter((q) => q.type === "listening"))
      expect(q.options).toContain(q.answers[0]);
    for (const q of week04[6].exitTest.filter((q) => q.audio))
      expect(prior.has(q.audio!.text)).toBe(false);
  });
});

describe("第4週の修正回帰", () => {
  it("크다の連体形では語幹を保ち、해요体のㅡ脱落と区別する", () => {
    const q = week04[4].recall[0];
    expect(gradeAnswer(q, "큰 방")).toBe("correct");
    expect(q.explanation).toContain("語幹크にㄴを付けて큰");
    expect(q.explanation).not.toMatch(/(?:으|ㅡ|ㄹ)が落ち/);
    expect(week03[5].sections.flatMap((section) => section.paragraphs).join(" ")).toMatch(
      /크다は커요.*語幹末のㅡが落ち/,
    );
  });
  it("移動の意味と敬意の対象を区別する", () => {
    const movement = week04[3].exitTest[1];
    expect(movement.prompt).toContain("안 가도 돼요");
    expect(movement.answers).toEqual(["行かなくてもよい"]);
    expect(movement.options).toEqual(["行かなくてもよい", "行ってはいけない", "必ず行く"]);
    const politeness = week04[5].exitTest[4];
    expect(politeness.answers).toEqual(["聞き手への丁寧さを示している"]);
    expect(politeness.options).toContain(politeness.answers[0]);
    expect(politeness.tags).toEqual(["grammar-formal-polite"]);
  });
  it("未縮約形と依頼の助詞を受け入れる", () => {
    const [, , , d25, , d27] = week04;
    for (const [q, answer] of [
      [d25.exercises[0], "가도 되어요"],
      [d25.exercises[2], "하여도 되어요"],
      [d25.exitTest[2], "집에 가도 되어요"],
      [d25.exitTest[3], "책을 가져가면 안 되어요"],
      [d27.exercises[6], "물을 주세요"],
      [d27.exitTest[5], "책을 주세요"],
      [week04[1].exercises[1], "물을 마셔야 하여요"],
      [week04[1].exercises[1], "물을 마시어야 하여요"],
    ] as const)
      expect(gradeAnswer(q, answer)).toBe("correct");
    expect(gradeAnswer(d25.exitTest[2], "집에 가도되어요")).toBe("incorrect");
  });
  it("問う内容に対応する復習先を使う", () => {
    expect(week04[4].exitTest[0].tags).toEqual(["grammar-verb-modifier-present"]);
    expect(week04[5].exercises[6].tags).toEqual(["grammar-honorific-lexicon"]);
    expect(week04[5].exitTest[5].tags).toEqual(["grammar-honorific-lexicon"]);
    expect(week04[3].recall[1].tags).toEqual(["grammar-ability"]);
    expect(week04[5].recall[0].tags).toEqual(["grammar-conjugation"]);
  });
  it("中間確認は24問で、既出の単独入力と近似音声を使わない", () => {
    const exam = week04[6].exitTest;
    expect(exam).toHaveLength(24);
    const earlierInputs = new Set(
      week04
        .slice(0, 6)
        .flatMap((l) =>
          [...l.exercises, ...l.exitTest]
            .filter((q) => q.type === "input")
            .flatMap((q) => q.answers),
        ),
    );
    for (const q of exam.filter((q) => q.type === "input"))
      for (const answer of q.answers) expect(earlierInputs.has(answer)).toBe(false);
    expect(exam.find((q) => q.audio?.text.includes("어제 본 영화"))).toBeUndefined();
    expect(exam.some((q) => /같이|그래서/.test(q.audio?.text ?? ""))).toBe(false);
  });
});

describe("尊敬形の標準形", () => {
  it("一般の丁寧形では複数の標準形を認め、指定された語と空白を守る", () => {
    const d20 = week03[5];
    const d27 = week04[5];
    const d28 = week04[6];
    for (const [q, answers] of [
      [d20.exercises[10], ["사세요", "사셔요", "사시어요"]],
      [d27.exercises[0], ["가세요", "가셔요", "가시어요"]],
      [d27.exercises[1], ["읽으세요", "읽으셔요", "읽으시어요"]],
      [d27.exercises[2], ["사세요", "사셔요", "사시어요"]],
      [d27.exercises[6], ["물을 주세요", "물을 주셔요", "물을 주시어요"]],
      [
        d27.exitTest[2],
        ["선생님이 물을 드세요", "선생님이 물을 드셔요。", "선생님이 물을 드시어요"],
      ],
      [d27.exitTest[5], ["책을 주세요", "책을 주셔요", "책을 주시어요"]],
      [
        d28.exitTest[15],
        ["선생님이 도서관에 계세요", "선생님이 도서관에 계셔요", "선생님이 도서관에 계시어요"],
      ],
    ] as const)
      for (const answer of answers) expect(gradeAnswer(q, answer)).toBe("correct");
    expect(gradeAnswer(d27.exitTest[2], "선생님이 물 드셔요")).toBe("incorrect");
    expect(gradeAnswer(d27.exitTest[2], "선생님이 물을드셔요")).toBe("incorrect");
    expect(gradeAnswer(week02[4].exercises[2], "읽으셔요")).toBe("incorrect");
  });
});
