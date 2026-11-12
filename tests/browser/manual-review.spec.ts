import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

test("手動登録を保存・バックアップし、解除しても回答履歴を残す", async ({ page }) => {
  await page.goto("#/lesson/day-01?exercises");
  const question = page.locator("#day-01-ex-01");
  await question.getByLabel("回答").fill("ㅏ");
  await question.getByRole("button", { name: "答え合わせ" }).click();
  await expect(question.getByText("正解", { exact: true })).toBeVisible();
  await question.getByRole("button", { name: "復習に追加" }).click();
  await page.goto("#/reference");
  const word = page.locator(".wordbook-entry").first();
  const wordId = await word.getAttribute("id");
  const wordText = await word.locator("[lang=ko]").first().innerText();
  await word.getByRole("button", { name: "復習に追加" }).click();
  await expect(word.getByRole("button", { name: "復習から外す" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.reload();
  await expect(word.getByRole("button", { name: "復習から外す" })).toBeVisible();
  await page.goto("#/review");
  await page
    .locator(".question")
    .filter({ hasText: wordText })
    .getByRole("button", { name: "答えを見る", exact: true })
    .click();
  await page.goto("#/home");
  await page.getByText("データ管理", { exact: true }).click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "バックアップを書き出す" }).click();
  const download = await downloadPromise;
  const data = JSON.parse(await readFile((await download.path())!, "utf8"));
  expect(data.reviews.filter((item: { id: string }) => item.id === wordId)).toHaveLength(1);
  expect(data.reviews.some((item: { id: string }) => item.id === "day-01-ex-01")).toBe(true);
  await page.getByLabel("バックアップを選ぶ").setInputFiles({
    name: "backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(data)),
  });
  await page.getByRole("button", { name: "この内容を適用" }).click();
  await page.goto("#/reference");
  await word.getByRole("button", { name: "復習から外す" }).click();
  await expect(word.getByRole("button", { name: "復習に追加" })).toBeVisible();
  await page.reload();
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("korean-textbook-progress-v1")!),
  );
  expect(saved.reviews.some((item: { id: string }) => item.id === wordId)).toBe(false);
  expect(
    saved.attempts.some((item: { questionId: string }) => item.questionId === "day-01-ex-01"),
  ).toBe(true);
});
