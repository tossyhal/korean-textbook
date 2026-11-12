import { describe, expect, it } from "vitest";
import { lessons } from "../index";

const question = (day: number, id: string) => {
  const lesson = lessons.find((item) => item.day === day)!;
  return lesson.exitTest.find((item) => item.id === id)!;
};

describe("外部レビュー後の確認問題", () => {
  it("第4節の実際の確認問題は練習と別の語を使う", () => {
    const q = question(4, "day-04-exit-05");
    expect(q.prompt).toContain("책");
    expect(q.answers).toContain("이에요");
    expect(q.prompt).not.toContain("의사");
  });
  it("第40節は並列文から時間順を推測させない", () => {
    const q = question(40, "day-40-exit-listen-1");
    expect(q.audio?.text).toBe("어제 책을 읽고 음악을 들었어요.");
    expect(q.prompt).toBe("文に出てくる行動は？");
    expect(q.answers).toContain("音楽を聞いた");
  });
  it("第48節の場所問題は練習と別の出来事を問う", () => {
    const q = question(48, "day-48-exit-3");
    expect(q.prompt).toContain("역에서 선생님을 만나요");
    expect(q.answers).toContain("駅");
    expect(q.options).toContain("駅");
    expect(q.explanation).toContain("역에서");
  });
});
