import { expect, it } from "vitest";
import { validateContent } from "./validate-content";
it("未完成の教材を全課検証で検出する", () => {
  expect(validateContent([], true)).toHaveLength(56);
  expect(validateContent([], false)).toEqual([]);
});
it("不完全な課をスキーマで拒否する", () => {
  expect(validateContent([{ id: "day-01", day: 1 }])).not.toEqual([]);
});
