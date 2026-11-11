import { describe, expect, it } from "vitest";
import { validateContent } from "../../../domain/validate-content";
import { week01 } from "../week01";
import { week02 } from "../week02";
import { week03 } from "../week03";
import { week04 } from "../week04";
import { week05 } from "./index";
describe("第5週の評価", () => {
  it("35課の構造と参照が正しい", () =>
    expect(validateContent([...week01, ...week02, ...week03, ...week04, ...week05], false)).toEqual(
      [],
    ));
  it("役割ごとに条件の異なる回答例と音声と観点がある", () => {
    for (const l of week05) {
      expect(l.roleplay!.turns.length).toBeGreaterThanOrEqual(3);
      for (const turn of l.roleplay!.turns) {
        expect(turn.partner.audio?.status).toBe("unverified");
        expect(turn.responseExamples.length).toBeGreaterThanOrEqual(2);
        expect(turn.responseExamples[0].korean).not.toBe(turn.responseExamples[1].korean);
        expect(turn.rubric.length).toBeGreaterThan(0);
      }
    }
  });
  it("聴解の選択肢に正解を含む", () => {
    for (const q of week05
      .flatMap((l) => [...l.exercises, ...l.exitTest])
      .filter((q) => q.type === "listening")) {
      expect(q.options).toContain(q.answers[0]);
      expect(q.audio?.status).toBe("unverified");
    }
  });
  it("週末確認は24問で以前の練習・例文・会話の音声を流用しない", () => {
    const prior = new Set(
      week05
        .slice(0, 6)
        .flatMap((l) => [
          ...l.examples.map((e) => e.korean),
          ...l.dialogue.map((e) => e.korean),
          ...l.exercises.flatMap((q) => (q.audio ? [q.audio.text] : [])),
          ...l.exitTest.flatMap((q) => (q.audio ? [q.audio.text] : [])),
        ]),
    );
    expect(week05[6].exitTest).toHaveLength(24);
    for (const q of week05[6].exitTest) if (q.audio) expect(prior.has(q.audio.text)).toBe(false);
  });
});
import { gradeAnswer } from "../../../domain/progress";
it("固定組立は助詞と句点を許容し、分かち書きを保持する", () => {
  const q = week05[6].exitTest.find((q) => q.id === "day-35-exit-assembly-4")!;
  expect(gradeAnswer(q, "열쇠를 주세요。")).toBe("correct");
  expect(gradeAnswer(q, "열쇠 주세요")).toBe("correct");
  expect(gradeAnswer(q, "열쇠주세요")).toBe("incorrect");
});
it("宿泊状況の必要な備品を内容に基づき判定する", () => {
  const q = week05[6].exitTest.find((q) => q.prompt.includes("욕실에 비누가 없어요"))!;
  expect(q.answers).toEqual(["石けん"]);
  expect(q.options).toContain("タオル");
});
it("出口に技能別の固定入力があり、問う場面の復習先を示す", () => {
  expect(week05[6].exitTest.filter((q) => q.type === "input")).toHaveLength(4);
  expect(week05[6].exitTest[3].tags).toEqual(["grammar-place-position"]);
  expect(week05[6].exitTest[10].tags).toEqual(["grammar-hotel-supplies"]);
  expect(week05[6].exitTest[11].tags).toEqual(["grammar-meeting-arrangement"]);
  expect(week05[5].exitTest.filter((q) => q.type === "input").length).toBeGreaterThanOrEqual(2);
});
it("道案内の返答は進む方向を答え、それぞれの条件を示す", () => {
  const turn = week05[3].roleplay!.turns[2];
  expect(turn.responseExamples.map((e) => e.note)).toEqual(["右へ進む", "左へ進む"]);
  expect(turn.responseExamples.every((e) => !e.korean.endsWith("?"))).toBe(true);
});
it("35課の会話は事前に示す条件と両方の回答例・自己評価が一致する", () => {
  const turns = week05[6].roleplay!.turns;
  const conditions = [
    { goal: ["お茶", "二杯"], korean: ["차", "두 잔"], rubric: ["お茶", "二杯"] },
    { goal: ["四時", "市庁駅"], korean: ["네 시", "시청역"], rubric: ["四時", "市庁駅"] },
    { goal: ["タオル", "二枚"], korean: ["수건", "두 장"], rubric: ["タオル", "二枚"] },
    {
      goal: ["時間がなく", "明日"],
      korean: ["시간이 없어요", "내일"],
      rubric: ["時間がない", "明日"],
    },
  ];
  expect(turns).toHaveLength(conditions.length);
  turns.forEach((turn, i) => {
    const condition = conditions[i];
    for (const part of condition.goal) expect(turn.goal).toContain(part);
    for (const part of condition.rubric) expect(turn.rubric.join(" ")).toContain(part);
    expect(turn.responseExamples).toHaveLength(2);
    for (const response of turn.responseExamples) {
      for (const part of condition.korean) expect(response.korean).toContain(part);
    }
  });
});
it("出口の固定入力と復習先は扱う場面に対応する", () => {
  for (const lesson of week05.slice(0, 3)) {
    const inputs = lesson.exitTest.filter((q) => q.type === "input");
    expect(inputs.length).toBeGreaterThanOrEqual(1);
    expect(gradeAnswer(inputs[0], inputs[0].answers[0] + "。")).toBe("correct");
  }
  const exam = week05[6].exitTest;
  expect(exam[14].tags).toEqual([week05[0].grammar[1].id]);
  expect(exam[15].tags).toEqual([week05[2].grammar[2].id]);
  expect(exam[19].tags).toEqual([week05[1].grammar[1].id]);
  for (const lesson of week05.slice(3, 6)) {
    expect(lesson.recall.map((q) => q.tags[0])).toEqual(["grammar-request", "grammar-location"]);
  }
});
