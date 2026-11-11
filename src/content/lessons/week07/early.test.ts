import { describe, expect, it } from "vitest";
import { validateContent } from "../../../domain/validate-content";
import { summarize } from "../../../domain/progress";
import { week01 } from "../week01";
import { week02 } from "../week02";
import { week03 } from "../week03";
import { week04 } from "../week04";
import { week05 } from "../week05";
import { week06 } from "../week06";
import { day43 } from "./day43";
import { day44 } from "./day44";
import { day45 } from "./day45";
describe("第43〜45課", () => {
  it("既存42課を含めて教材参照を検証する", () =>
    expect(
      validateContent(
        [...week01, ...week02, ...week03, ...week04, ...week05, ...week06, day43, day44, day45],
        false,
      ),
    ).toEqual([]));
  it("未確認の重要音声は回答記録があっても未実施", () => {
    for (const lesson of [day43, day44]) {
      const q = lesson.exitTest.find((q) => q.requiresVerifiedAudio)!;
      expect(q.audio?.status).toBe("unverified");
      const summary = summarize(
        [q],
        [{ questionId: q.id, answer: q.answers[0], result: "correct", stage: "first", at: "now" }],
      );
      expect(summary).toMatchObject({ attempted: 0, unattempted: 1, complete: false });
    }
  });
  it("聴解には発音表記でなく元の表記を使う", () => {
    expect(day44.exitTest.find((q) => q.requiresVerifiedAudio)?.audio?.text).toBe("국물");
    expect(
      day45.exitTest
        .filter((q) => q.type === "listening")
        .every((q) => q.audio?.status === "unverified" && !q.requiresVerifiedAudio),
    ).toBe(true);
  });
});
