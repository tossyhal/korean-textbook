import { expect, it } from "vitest";
import { addManualReview, removeManualReview } from "./manual";

it("手動登録は重複や既存予定の変更をせず、解除後に再登録できる", () => {
  const initial = [{ id: "word", due: "2026-02-01", interval: 7 }];
  expect(addManualReview(initial, "word", "2026-01-01")).toEqual(initial);
  const added = addManualReview(initial, "question", "2026-01-01");
  expect(added).toEqual([...initial, { id: "question", due: "2026-01-01", interval: 0 }]);
  expect(removeManualReview(added, "question")).toEqual(initial);
  expect(
    addManualReview(removeManualReview(added, "question"), "question", "2026-01-02")[1].due,
  ).toBe("2026-01-02");
});
