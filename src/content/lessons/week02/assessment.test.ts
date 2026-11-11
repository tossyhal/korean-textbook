import { describe, expect, it } from "vitest";
import { gradeAnswer } from "../../../domain/progress";
import { validateContent } from "../../../domain/validate-content";
import { week01 } from "../week01";
import { week02 } from "./index";

const question = (id: string) => {
  const result = week02.flatMap((l) => [...l.exercises, ...l.exitTest]).find((q) => q.id === id);
  if (!result) throw new Error(`問題がありません: ${id}`);
  return result;
};
describe("第2週の評価", () => {
  it("全課の参照を検証する", () => {
    expect(validateContent([...week01, ...week02], false)).toEqual([]);
  });
  it("縮約・未縮約と句点を認め、空白を保持する", () => {
    for (const answer of ["봐 주세요。", "보아 주세요."])
      expect(gradeAnswer(question("day-12-ex-13"), answer)).toBe("correct");
    expect(gradeAnswer(question("day-12-ex-13"), "봐주세요")).toBe("incorrect");
    for (const answer of ["봤어요", "보았어요。"])
      expect(gradeAnswer(question("day-09-ex-03"), answer)).toBe("correct");
    expect(gradeAnswer(question("day-09-ex-05"), "왔어요。")).toBe("correct");
    expect(gradeAnswer(question("day-09-ex-05"), "오았어요")).toBe("incorrect");
    expect(gradeAnswer(question("day-14-exit-10"), "어제 집에 왔어요。")).toBe("correct");
  });
  it("必須表現を場面で使う", () => {
    expect(gradeAnswer(question("day-12-exit-01"), "천천히 읽어 주세요。")).toBe("correct");
    expect(gradeAnswer(question("day-12-exit-02"), "다시")).toBe("correct");
    expect(gradeAnswer(question("day-12-ex-03"), "읽으세요")).toBe("correct");
    expect(gradeAnswer(question("day-12-exit-05"), "어떻게")).toBe("correct");
    expect(gradeAnswer(question("day-12-exit-04"), "여기에 오세요。")).toBe("correct");
    expect(gradeAnswer(question("day-12-exit-03"), "왜 학교에 가요?")).toBe("correct");
    expect(question("day-14-exit-09").prompt).not.toContain("시월 육 일");
    expect(question("day-14-exit-10").prompt).not.toContain("보다");
  });
  it("数詞と単位の原則形、体系と分かち書きを検証する", () => {
    expect(gradeAnswer(question("day-11-exit-02"), "여덟 시 이십 분。")).toBe("correct");
    expect(gradeAnswer(question("day-11-exit-02"), "팔 시 스무 분")).toBe("incorrect");
    expect(gradeAnswer(question("day-11-exit-02"), "여덟시 이십분")).toBe("incorrect");
    expect(gradeAnswer(question("day-11-exit-05"), "스무 개")).toBe("correct");
    expect(gradeAnswer(question("day-11-exit-05"), "스물 개")).toBe("incorrect");
  });
  it("週末の予定問題は既習の情報を組み合わせ、単独の活用だけでは答えられない", () => {
    const exam = question("day-14-exit-12");
    expect(exam.prompt).toContain("내일、집에서、밥을、먹다");
    for (const answer of ["내일 집에서 밥을 먹을 거예요", "내일 집에서 밥을 먹을 것이에요。"])
      expect(gradeAnswer(exam, answer)).toBe("correct");
    for (const answer of [
      "먹을 거예요",
      "내일 집에서 밥을 먹어요",
      "내일 학교에서 밥을 먹을 거예요",
    ])
      expect(gradeAnswer(exam, answer)).toBe("incorrect");
    const previousAnswers = week02
      .slice(0, 6)
      .flatMap((lesson) => [...lesson.exercises, ...lesson.exitTest].flatMap((q) => q.answers));
    for (const answer of exam.answers) expect(previousAnswers).not.toContain(answer);
  });
  it("聴解は選択肢を持ち、週末音声の文を前課から再利用しない", () => {
    const listening = week02
      .flatMap((l) => [...l.exercises, ...l.exitTest])
      .filter((q) => q.type === "listening");
    for (const q of listening) for (const answer of q.answers) expect(q.options).toContain(answer);
    const previous = new Set(
      week02
        .slice(0, 6)
        .flatMap((l) => [
          ...l.examples.map((x) => x.korean),
          ...l.dialogue.map((x) => x.korean),
          ...l.exercises.flatMap((q) => (q.audio ? [q.audio.text] : [])),
        ]),
    );
    for (const q of week02[6].exitTest.filter((q) => q.audio)) {
      expect(previous.has(q.audio!.text)).toBe(false);
      for (const sentence of q
        .audio!.text.split(/(?<=[.!?])/u)
        .map((s) => s.trim())
        .filter(Boolean))
        expect(previous.has(sentence)).toBe(false);
    }
  });
});
