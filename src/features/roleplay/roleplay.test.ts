import { describe, expect, it } from "vitest";
import { roleplaySchema } from "../../domain/content";
import { newProgress } from "../../domain/progress";
import { exportBackup, parseBackup } from "../../storage/backup";

const roleplay = {
  scenario: "場面",
  turns: [
    {
      partner: { korean: "가요?", japanese: "行きますか" },
      goal: "答える",
      responseExamples: [
        { korean: "네", japanese: "はい" },
        { korean: "아니요", japanese: "いいえ" },
      ],
      rubric: ["意思を伝えたか"],
    },
    {
      partner: { korean: "언제요?", japanese: "いつですか" },
      goal: "時間を伝える",
      responseExamples: [
        { korean: "내일", japanese: "明日" },
        { korean: "오늘", japanese: "今日" },
      ],
      rubric: ["時間を伝えたか"],
    },
  ],
};
const ids = {
  lessons: new Set(["day-29"]),
  questions: new Set<string>(),
  reviews: new Set<string>(),
  roleplay: new Map([["day-29", 2]]),
};

describe("ロールプレイ", () => {
  it("複数の条件付き回答例を受け入れ、空のターンや回答例は拒否する", () => {
    expect(roleplaySchema.parse(roleplay).turns[0].responseExamples).toHaveLength(2);
    expect(roleplaySchema.safeParse({ ...roleplay, turns: [] }).success).toBe(false);
    expect(
      roleplaySchema.safeParse({
        ...roleplay,
        turns: [
          { ...roleplay.turns[0], responseExamples: [roleplay.turns[0].responseExamples[0]] },
        ],
      }).success,
    ).toBe(false);
    expect(
      roleplaySchema.safeParse({
        ...roleplay,
        turns: [{ ...roleplay.turns[0], responseExamples: [] }],
      }).success,
    ).toBe(false);
  });
  it("下書きと位置をバックアップで復元し、未知の課やターンを拒否する", () => {
    const progress = {
      ...newProgress(),
      roleplay: { "day-29": { turn: 1, drafts: ["返答", "次の返答"] } },
    };
    expect(parseBackup(exportBackup(progress), ids).roleplay).toEqual(progress.roleplay);
    expect(() =>
      parseBackup(
        exportBackup({ ...progress, roleplay: { "day-29": { turn: 2, drafts: [] } } }),
        ids,
      ),
    ).toThrow();
    expect(() =>
      parseBackup(
        exportBackup({ ...progress, roleplay: { "day-30": { turn: 0, drafts: [] } } }),
        ids,
      ),
    ).toThrow();
    expect(() =>
      parseBackup(
        exportBackup({ ...progress, roleplay: { "day-29": { turn: 0, drafts: ["1", "2", "3"] } } }),
        ids,
      ),
    ).toThrow();
    expect(
      parseBackup(JSON.stringify({ ...newProgress(), roleplay: undefined }), ids).roleplay,
    ).toEqual({});
  });
});
