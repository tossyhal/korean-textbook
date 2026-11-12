import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { lessons } from "../../src/content";
import { newProgress } from "../../src/domain/progress";

test("旧結果URLから復習を開いても回答履歴と設定を保持する", async ({ page }) => {
  const lesson = lessons.find((item) => item.day === 7)!;
  const question = lesson.exitTest.find((item) => item.skill === "reading")!;
  const progress = newProgress();
  progress.settings = { mode: 60, voice: "legacy-voice" };
  progress.attempts.push({
    questionId: question.id,
    answer: "以前の回答",
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
  await expect(page.locator("main h1")).toHaveText("復習");
  await expect(page.getByRole("link", { name: "学習結果" })).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await page.goto("#/home");
  await expect(page.getByRole("link", { name: "学習結果" })).toHaveCount(0);
  await page.getByText("データ管理", { exact: true }).click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "バックアップを書き出す" }).click();
  const download = await downloadPromise;
  const backup = JSON.parse(await readFile((await download.path())!, "utf8"));
  expect(backup.attempts).toEqual(progress.attempts);
  expect(backup.settings).toEqual(progress.settings);
  await page.goto("#/lesson/day-01");
  await expect(page.locator('[lang="ko"]').first()).toBeAttached();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});
