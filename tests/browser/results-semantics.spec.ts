import { expect, test } from "@playwright/test";
import { lessons } from "../../src/content";
import { newProgress } from "../../src/domain/progress";

test("確認テストの範囲を切り替え、音声APIがなくても未実施を表示する", async ({ page }) => {
  const lesson = lessons.find((item) => item.day === 7)!;
  const question = lesson.exitTest.find((item) => item.skill === "reading")!;
  const progress = newProgress();
  progress.attempts.push({
    questionId: question.id,
    answer: "",
    result: "incorrect",
    stage: "first",
    at: "2026-11-12",
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript((value) => {
    Object.defineProperty(window, "speechSynthesis", { value: undefined, configurable: true });
    localStorage.setItem("korean-textbook-progress-v1", JSON.stringify(value));
  }, progress);
  await page.goto("#/results");
  const scope = page.getByLabel("評価範囲");
  await expect(scope).toHaveValue(lesson.id);
  await expect(page.getByText(/第7課の確認テスト：自動採点の実施1\//)).toBeVisible();
  await scope.selectOption("all");
  await expect(
    page.getByText(/全履歴（各課の出口テスト）：自動採点の実施1\//, { exact: false }),
  ).toBeVisible();
  await scope.selectOption(lessons.find((item) => item.day === 14)!.id);
  await expect(page.getByText(/第14課の確認テスト：自動採点の実施0\//)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await page.goto("#/lesson/day-01");
  await expect(page.locator('[lang="ko"]').first()).toBeAttached();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});
